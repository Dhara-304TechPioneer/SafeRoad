from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, File, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_active_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.report import (
    ReportCreate,
    ReportListResponse,
    ReportResponse,
    ReportUpdate,
    WorkflowAssignRequest,
    WorkflowCommentRequest,
    WorkflowCommentResponse,
    WorkflowHistoryEntry,
    WorkflowStatusRequest,
    WorkflowVerifyRequest,
)
from app.services.report_service import ReportService

router = APIRouter()


def _serialize_report(report) -> ReportResponse:
    return ReportResponse(
        id=report.id,
        title=report.title,
        description=report.description,
        severity=report.severity.value,
        status=report.status.value,
        latitude=report.latitude,
        longitude=report.longitude,
        address=report.address,
        image_url=report.image_url,
        reported_by=report.reported_by,
        assigned_to=report.assigned_to,
        created_at=report.created_at,
        updated_at=report.updated_at,
    )


def _serialize_history(entry) -> WorkflowHistoryEntry:
    return WorkflowHistoryEntry(
        id=entry.id,
        report_id=entry.report_id,
        previous_status=entry.previous_status.value,
        new_status=entry.new_status.value,
        changed_by=entry.changed_by,
        remarks=entry.remarks,
        changed_at=entry.changed_at,
    )


def _serialize_comment(entry) -> WorkflowCommentResponse:
    return WorkflowCommentResponse(
        id=entry.id,
        report_id=entry.report_id,
        user_id=entry.user_id,
        comment=entry.comment,
        created_at=entry.created_at,
    )


@router.post('', response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(payload: ReportCreate, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> ReportResponse:
    service = ReportService(db)
    report = service.create_report(current_user, payload.model_dump())
    return _serialize_report(report)


@router.get('', response_model=ReportListResponse)
def list_reports(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=100),
    search: str | None = None,
    status: str | None = None,
    severity: str | None = None,
    sort_by: str = Query(default='date_desc'),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> ReportListResponse:
    service = ReportService(db)
    items, total = service.list_reports(user=current_user, page=page, size=size, search=search, status=status, severity=severity, sort_by=sort_by)
    return ReportListResponse(
        items=[_serialize_report(item) for item in items],
        total=total,
        page=page,
        size=size,
    )


@router.get('/{report_id}', response_model=ReportResponse)
def get_report(report_id: UUID, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> ReportResponse:
    service = ReportService(db)
    report = service.get_report(report_id, current_user)
    return _serialize_report(report)


@router.put('/{report_id}', response_model=ReportResponse)
def update_report(report_id: UUID, payload: ReportUpdate, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> ReportResponse:
    service = ReportService(db)
    report = service.update_report(report_id, current_user, payload.model_dump(exclude_unset=True))
    return _serialize_report(report)


@router.delete('/{report_id}', status_code=status.HTTP_204_NO_CONTENT, response_model=None)
def delete_report(report_id: UUID, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> None:
    service = ReportService(db)
    service.delete_report(report_id, current_user)


@router.get('/{report_id}/history', response_model=list[WorkflowHistoryEntry])
def get_history(report_id: UUID, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> list[WorkflowHistoryEntry]:
    service = ReportService(db)
    return [_serialize_history(entry) for entry in service.list_history(report_id, current_user)]


@router.post('/{report_id}/verify', response_model=dict)
def verify_report(report_id: UUID, payload: WorkflowVerifyRequest, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> dict[str, object]:
    service = ReportService(db)
    report, history = service.verify_report(report_id, current_user, payload.remarks)
    return {'success': True, 'status': report.status.value, 'history': [_serialize_history(entry) for entry in history]}


@router.post('/{report_id}/assign', response_model=dict)
def assign_report(report_id: UUID, payload: WorkflowAssignRequest, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> dict[str, object]:
    service = ReportService(db)
    report, assignment = service.assign_report(report_id, current_user, payload.model_dump())
    return {'success': True, 'assignment': {'id': assignment.id, 'report_id': assignment.report_id, 'assigned_by': assignment.assigned_by, 'assigned_to': assignment.assigned_to, 'assigned_department': assignment.assigned_department, 'priority': assignment.priority, 'deadline': assignment.deadline, 'assigned_at': assignment.assigned_at}, 'status': report.status.value}


@router.post('/{report_id}/status', response_model=dict)
def update_workflow_status(report_id: UUID, payload: WorkflowStatusRequest, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> dict[str, object]:
    service = ReportService(db)
    report, history = service.update_status(report_id, current_user, payload.model_dump())
    return {'success': True, 'status': report.status.value, 'history': [_serialize_history(entry) for entry in history]}


@router.post('/{report_id}/comments', response_model=WorkflowCommentResponse)
def add_comment(report_id: UUID, payload: WorkflowCommentRequest, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> WorkflowCommentResponse:
    service = ReportService(db)
    comment = service.add_comment(report_id, current_user, payload.comment)
    return _serialize_comment(comment)


@router.get('/{report_id}/comments', response_model=list[WorkflowCommentResponse])
def list_comments(report_id: UUID, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> list[WorkflowCommentResponse]:
    service = ReportService(db)
    return [_serialize_comment(entry) for entry in service.list_comments(report_id, current_user)]


@router.post('/upload')
def upload_image(file: UploadFile = File(...), current_user: User = Depends(get_current_active_user)) -> dict[str, str]:
    del current_user
    service = ReportService(next(get_db()))
    image_url = service.upload_image(file)
    return {'image_url': image_url}
