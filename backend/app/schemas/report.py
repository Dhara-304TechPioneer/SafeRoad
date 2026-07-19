from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ReportCreate(BaseModel):
    model_config = ConfigDict(extra='forbid')

    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=5000)
    severity: str = Field(...)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: str = Field(..., min_length=3, max_length=255)
    image_url: str | None = None

    @field_validator('severity')
    @classmethod
    def validate_severity(cls, value: str) -> str:
        allowed = {'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'}
        if value.upper() not in allowed:
            raise ValueError('severity must be one of LOW, MEDIUM, HIGH, CRITICAL')
        return value.upper()


class ReportUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid')

    title: str | None = Field(default=None, min_length=3, max_length=200)
    description: str | None = Field(default=None, min_length=10, max_length=5000)
    severity: str | None = Field(default=None)
    status: str | None = Field(default=None)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    address: str | None = Field(default=None, min_length=3, max_length=255)
    image_url: str | None = None
    assigned_to: int | None = None

    @field_validator('severity')
    @classmethod
    def validate_severity(cls, value: str | None) -> str | None:
        if value is None:
            return value
        allowed = {'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'}
        if value.upper() not in allowed:
            raise ValueError('severity must be one of LOW, MEDIUM, HIGH, CRITICAL')
        return value.upper()

    @field_validator('status')
    @classmethod
    def validate_status(cls, value: str | None) -> str | None:
        if value is None:
            return value
        allowed = {'REPORTED', 'AI_VERIFIED', 'OFFICER_VERIFIED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS', 'QUALITY_CHECK', 'RESOLVED', 'CLOSED'}
        if value.upper() not in allowed:
            raise ValueError('status must be one of REPORTED, AI_VERIFIED, OFFICER_VERIFIED, ACKNOWLEDGED, ASSIGNED, IN_PROGRESS, QUALITY_CHECK, RESOLVED, CLOSED')
        return value.upper()


class ReportResponse(BaseModel):
    id: UUID
    title: str
    description: str
    severity: str
    status: str
    latitude: float
    longitude: float
    address: str
    image_url: str | None
    reported_by: int
    assigned_to: int | None
    created_at: datetime
    updated_at: datetime


class ReportListResponse(BaseModel):
    items: list[ReportResponse]
    total: int
    page: int
    size: int


class WorkflowVerifyRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    remarks: str | None = Field(default=None, max_length=2000)


class WorkflowAssignRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    assigned_to: int = Field(...)
    assigned_department: str | None = Field(default=None, max_length=100)
    deadline: datetime | None = None
    priority: str = Field(default='MEDIUM', max_length=20)


class WorkflowStatusRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    status: str = Field(...)
    remarks: str | None = Field(default=None, max_length=2000)

    @field_validator('status')
    @classmethod
    def validate_status(cls, value: str) -> str:
        allowed = {'REPORTED', 'AI_VERIFIED', 'OFFICER_VERIFIED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS', 'QUALITY_CHECK', 'RESOLVED', 'CLOSED'}
        if value.upper() not in allowed:
            raise ValueError('status must be one of REPORTED, AI_VERIFIED, OFFICER_VERIFIED, ACKNOWLEDGED, ASSIGNED, IN_PROGRESS, QUALITY_CHECK, RESOLVED, CLOSED')
        return value.upper()


class WorkflowCommentRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    comment: str = Field(..., min_length=1, max_length=2000)


class WorkflowHistoryEntry(BaseModel):
    id: UUID
    report_id: UUID
    previous_status: str
    new_status: str
    changed_by: int
    remarks: str | None
    changed_at: datetime


class WorkflowAssignmentResponse(BaseModel):
    id: UUID
    report_id: UUID
    assigned_by: int
    assigned_to: int
    assigned_department: str | None
    priority: str
    deadline: datetime | None
    assigned_at: datetime


class WorkflowCommentResponse(BaseModel):
    id: UUID
    report_id: UUID
    user_id: int
    comment: str
    created_at: datetime
