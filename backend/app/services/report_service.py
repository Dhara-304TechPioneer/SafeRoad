from __future__ import annotations

import shutil
from datetime import datetime, UTC
from pathlib import Path
from typing import Any
from uuid import UUID

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.report import Report, ReportAssignment, ReportComment, ReportSeverity, ReportStatus, ReportStatusHistory
from app.models.user import User, UserRole

UPLOAD_DIR = Path(__file__).resolve().parents[1] / 'uploads'
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_TRANSITIONS = {
    ReportStatus.REPORTED: {ReportStatus.AI_VERIFIED},
    ReportStatus.AI_VERIFIED: {ReportStatus.OFFICER_VERIFIED},
    ReportStatus.OFFICER_VERIFIED: {ReportStatus.ACKNOWLEDGED, ReportStatus.ASSIGNED},
    ReportStatus.ACKNOWLEDGED: {ReportStatus.ASSIGNED},
    ReportStatus.ASSIGNED: {ReportStatus.IN_PROGRESS, ReportStatus.RESOLVED},
    ReportStatus.IN_PROGRESS: {ReportStatus.QUALITY_CHECK, ReportStatus.RESOLVED},
    ReportStatus.QUALITY_CHECK: {ReportStatus.RESOLVED, ReportStatus.CLOSED},
    ReportStatus.RESOLVED: {ReportStatus.CLOSED},
    ReportStatus.CLOSED: set(),
}


class ReportService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def _get_report_for_user(self, report_id: UUID, user: User) -> Report:
        report = self.db.get(Report, report_id)
        if report is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Report not found')

        if user.role == UserRole.citizen and report.reported_by != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Not allowed to access this report')
        return report

    def _ensure_management_permission(self, user: User) -> None:
        if user.role not in {UserRole.municipal_officer, UserRole.admin}:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Only officers and admins can manage workflow')

    def _record_status_change(self, report: Report, previous_status: ReportStatus, new_status: ReportStatus, user: User, remarks: str | None) -> None:
        entry = ReportStatusHistory(
            report_id=report.id,
            previous_status=previous_status,
            new_status=new_status,
            changed_by=user.id,
            remarks=remarks,
        )
        self.db.add(entry)

    def _transition_status(self, report: Report, new_status: ReportStatus, user: User, remarks: str | None = None) -> None:
        if report.status == new_status:
            return
        allowed = ALLOWED_TRANSITIONS.get(report.status, set())
        if new_status not in allowed:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Illegal transition from {report.status.value} to {new_status.value}')
        previous_status = report.status
        report.status = new_status
        self._record_status_change(report, previous_status, new_status, user, remarks)

    def list_reports(
        self,
        *,
        user: User,
        page: int,
        size: int,
        search: str | None,
        status: str | None,
        severity: str | None,
        sort_by: str,
    ) -> tuple[list[Report], int]:
        query = select(Report)

        if user.role == UserRole.citizen:
            query = query.where(Report.reported_by == user.id)

        if search:
            search_term = f'%{search.lower()}%'
            query = query.where(
                func.lower(Report.title).like(search_term)
                | func.lower(Report.description).like(search_term)
                | func.lower(Report.address).like(search_term)
            )

        if status:
            query = query.where(Report.status == ReportStatus[status.upper()])

        if severity:
            query = query.where(Report.severity == ReportSeverity[severity.upper()])

        if sort_by == 'date_desc':
            query = query.order_by(Report.created_at.desc())
        else:
            query = query.order_by(Report.created_at.asc())

        total_query = select(func.count()).select_from(query.subquery())
        total = self.db.execute(total_query).scalar_one()

        paged_query = query.offset((page - 1) * size).limit(size)
        items = self.db.scalars(paged_query).all()
        return items, total

    def get_report(self, report_id: UUID, user: User) -> Report:
        return self._get_report_for_user(report_id, user)

    def create_report(self, user: User, payload: dict[str, Any]) -> Report:
        report = Report(
            title=payload['title'],
            description=payload['description'],
            severity=ReportSeverity[payload['severity'].upper()],
            latitude=payload['latitude'],
            longitude=payload['longitude'],
            address=payload['address'],
            image_url=payload.get('image_url'),
            reported_by=user.id,
        )
        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)
        return report

    def update_report(self, report_id: UUID, user: User, payload: dict[str, Any]) -> Report:
        report = self._get_report_for_user(report_id, user)

        if user.role == UserRole.citizen and report.reported_by != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Not allowed to edit this report')
        if user.role == UserRole.citizen and report.status in {ReportStatus.AI_VERIFIED, ReportStatus.OFFICER_VERIFIED, ReportStatus.ACKNOWLEDGED, ReportStatus.ASSIGNED, ReportStatus.IN_PROGRESS, ReportStatus.QUALITY_CHECK, ReportStatus.RESOLVED, ReportStatus.CLOSED}:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='This report can no longer be edited by the owner')

        if 'title' in payload and payload['title'] is not None:
            report.title = payload['title']
        if 'description' in payload and payload['description'] is not None:
            report.description = payload['description']
        if 'severity' in payload and payload['severity'] is not None:
            report.severity = ReportSeverity[payload['severity'].upper()]
        if 'status' in payload and payload['status'] is not None:
            if user.role not in {UserRole.municipal_officer, UserRole.admin}:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Only officers and admins can change workflow status')
            self._transition_status(report, ReportStatus[payload['status'].upper()], user, remarks='Status updated via report edit')
        if 'latitude' in payload and payload['latitude'] is not None:
            report.latitude = payload['latitude']
        if 'longitude' in payload and payload['longitude'] is not None:
            report.longitude = payload['longitude']
        if 'address' in payload and payload['address'] is not None:
            report.address = payload['address']
        if 'image_url' in payload and payload['image_url'] is not None:
            report.image_url = payload['image_url']
        if 'assigned_to' in payload and payload['assigned_to'] is not None:
            self._ensure_management_permission(user)
            report.assigned_to = payload['assigned_to']
            report.status = ReportStatus.ASSIGNED
            self._record_status_change(report, report.status, ReportStatus.ASSIGNED, user, 'Assigned to officer')

        report.updated_at = datetime.now(UTC)
        self.db.commit()
        self.db.refresh(report)
        return report

    def delete_report(self, report_id: UUID, user: User) -> None:
        report = self._get_report_for_user(report_id, user)

        if user.role == UserRole.citizen and report.reported_by != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Not allowed to delete this report')
        if user.role == UserRole.citizen and report.status in {ReportStatus.AI_VERIFIED, ReportStatus.OFFICER_VERIFIED, ReportStatus.ACKNOWLEDGED, ReportStatus.ASSIGNED, ReportStatus.IN_PROGRESS, ReportStatus.QUALITY_CHECK, ReportStatus.RESOLVED, ReportStatus.CLOSED}:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='This report can no longer be deleted by the owner')

        self.db.delete(report)
        self.db.commit()

    def verify_report(self, report_id: UUID, user: User, remarks: str | None) -> tuple[Report, list[ReportStatusHistory]]:
        self._ensure_management_permission(user)
        report = self._get_report_for_user(report_id, user)

        if report.status == ReportStatus.REPORTED:
            new_status = ReportStatus.AI_VERIFIED
        elif report.status == ReportStatus.AI_VERIFIED:
            new_status = ReportStatus.OFFICER_VERIFIED
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Report is not in a verifiable state')

        previous_status = report.status
        report.status = new_status
        self._record_status_change(report, previous_status, new_status, user, remarks)
        report.updated_at = datetime.now(UTC)
        self.db.commit()
        self.db.refresh(report)
        history = self.db.scalars(select(ReportStatusHistory).where(ReportStatusHistory.report_id == report.id).order_by(ReportStatusHistory.changed_at.asc())).all()
        return report, history

    def assign_report(self, report_id: UUID, user: User, payload: dict[str, Any]) -> tuple[Report, ReportAssignment]:
        self._ensure_management_permission(user)
        report = self._get_report_for_user(report_id, user)

        assignee = self.db.get(User, payload['assigned_to'])
        if assignee is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Assigned user not found')

        assignment = ReportAssignment(
            report_id=report.id,
            assigned_by=user.id,
            assigned_to=payload['assigned_to'],
            assigned_department=payload.get('assigned_department'),
            priority=payload.get('priority', 'MEDIUM').upper(),
            deadline=payload.get('deadline'),
        )
        self.db.add(assignment)
        report.assigned_to = payload['assigned_to']
        self._transition_status(report, ReportStatus.ASSIGNED, user, 'Assigned to officer')
        report.updated_at = datetime.now(UTC)
        self.db.commit()
        self.db.refresh(report)
        self.db.refresh(assignment)
        return report, assignment

    def update_status(self, report_id: UUID, user: User, payload: dict[str, Any]) -> tuple[Report, list[ReportStatusHistory]]:
        self._ensure_management_permission(user)
        report = self._get_report_for_user(report_id, user)
        new_status = ReportStatus[payload['status'].upper()]
        self._transition_status(report, new_status, user, payload.get('remarks'))
        report.updated_at = datetime.now(UTC)
        self.db.commit()
        self.db.refresh(report)
        history = self.db.scalars(select(ReportStatusHistory).where(ReportStatusHistory.report_id == report.id).order_by(ReportStatusHistory.changed_at.asc())).all()
        return report, history

    def list_history(self, report_id: UUID, user: User) -> list[ReportStatusHistory]:
        report = self._get_report_for_user(report_id, user)
        return self.db.scalars(select(ReportStatusHistory).where(ReportStatusHistory.report_id == report.id).order_by(ReportStatusHistory.changed_at.asc())).all()

    def add_comment(self, report_id: UUID, user: User, comment: str) -> ReportComment:
        report = self._get_report_for_user(report_id, user)
        if user.role == UserRole.citizen and report.reported_by != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Only the report owner can add comments')

        entry = ReportComment(report_id=report.id, user_id=user.id, comment=comment)
        self.db.add(entry)
        self.db.commit()
        self.db.refresh(entry)
        return entry

    def list_comments(self, report_id: UUID, user: User) -> list[ReportComment]:
        report = self._get_report_for_user(report_id, user)
        return self.db.scalars(select(ReportComment).where(ReportComment.report_id == report.id).order_by(ReportComment.created_at.asc())).all()

    def upload_image(self, file: UploadFile) -> str:
        if file.content_type not in {'image/jpeg', 'image/png', 'image/jpg'}:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Only JPEG or PNG images are allowed')

        if file.size and file.size > 10 * 1024 * 1024:
            raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail='Image must be smaller than 10MB')

        file_name = f'{datetime.now(UTC).strftime("%Y%m%d%H%M%S")}_{file.filename or "upload"}'
        target_path = UPLOAD_DIR / file_name
        with target_path.open('wb') as buffer:
            shutil.copyfileobj(file.file, buffer)

        return f'/uploads/{file_name}'
