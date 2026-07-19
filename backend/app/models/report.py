from __future__ import annotations

import enum
import uuid
from datetime import datetime, UTC

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.user import User


class ReportSeverity(str, enum.Enum):
    LOW = 'LOW'
    MEDIUM = 'MEDIUM'
    HIGH = 'HIGH'
    CRITICAL = 'CRITICAL'


class ReportStatus(str, enum.Enum):
    REPORTED = 'REPORTED'
    AI_VERIFIED = 'AI_VERIFIED'
    OFFICER_VERIFIED = 'OFFICER_VERIFIED'
    ACKNOWLEDGED = 'ACKNOWLEDGED'
    ASSIGNED = 'ASSIGNED'
    IN_PROGRESS = 'IN_PROGRESS'
    QUALITY_CHECK = 'QUALITY_CHECK'
    RESOLVED = 'RESOLVED'
    CLOSED = 'CLOSED'


class Report(Base):
    __tablename__ = 'reports'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[ReportSeverity] = mapped_column(Enum(ReportSeverity), nullable=False, default=ReportSeverity.MEDIUM)
    status: Mapped[ReportStatus] = mapped_column(Enum(ReportStatus), nullable=False, default=ReportStatus.REPORTED)
    latitude: Mapped[float] = mapped_column(nullable=False)
    longitude: Mapped[float] = mapped_column(nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    reported_by: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False, index=True)
    assigned_to: Mapped[int | None] = mapped_column(ForeignKey('users.id'), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    reporter: Mapped[User] = relationship(foreign_keys=[reported_by], back_populates='reports_reported')
    assignee: Mapped[User | None] = relationship(foreign_keys=[assigned_to], back_populates='reports_assigned')
    assignments: Mapped[list['ReportAssignment']] = relationship(back_populates='report', cascade='all, delete-orphan')
    status_history: Mapped[list['ReportStatusHistory']] = relationship(back_populates='report', cascade='all, delete-orphan')
    comments: Mapped[list['ReportComment']] = relationship(back_populates='report', cascade='all, delete-orphan')


class ReportAssignment(Base):
    __tablename__ = 'assignments'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('reports.id'), nullable=False, index=True)
    assigned_by: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False, index=True)
    assigned_to: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False, index=True)
    assigned_department: Mapped[str | None] = mapped_column(String(100), nullable=True)
    priority: Mapped[str] = mapped_column(String(20), nullable=False, default='MEDIUM')
    deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    assigned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    report: Mapped[Report] = relationship(back_populates='assignments')
    assigned_by_user: Mapped[User] = relationship(foreign_keys=[assigned_by], back_populates='assignments_created')
    assigned_to_user: Mapped[User] = relationship(foreign_keys=[assigned_to], back_populates='assignments_received')


class ReportStatusHistory(Base):
    __tablename__ = 'status_history'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('reports.id'), nullable=False, index=True)
    previous_status: Mapped[ReportStatus] = mapped_column(Enum(ReportStatus), nullable=False)
    new_status: Mapped[ReportStatus] = mapped_column(Enum(ReportStatus), nullable=False)
    changed_by: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False, index=True)
    remarks: Mapped[str | None] = mapped_column(Text, nullable=True)
    changed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    report: Mapped[Report] = relationship(back_populates='status_history')
    changed_by_user: Mapped[User] = relationship(foreign_keys=[changed_by], back_populates='workflow_changes')


class ReportComment(Base):
    __tablename__ = 'report_comments'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('reports.id'), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False, index=True)
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    report: Mapped[Report] = relationship(back_populates='comments')
    author: Mapped[User] = relationship(foreign_keys=[user_id], back_populates='report_comments')
