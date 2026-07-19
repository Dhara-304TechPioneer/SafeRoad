from __future__ import annotations

import enum
from datetime import datetime, UTC

from sqlalchemy import DateTime, Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class UserRole(str, enum.Enum):
    citizen = 'citizen'
    municipal_officer = 'municipal_officer'
    admin = 'admin'


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False, default=UserRole.citizen)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    reports_reported: Mapped[list['Report']] = relationship(back_populates='reporter', foreign_keys='Report.reported_by')
    reports_assigned: Mapped[list['Report']] = relationship(back_populates='assignee', foreign_keys='Report.assigned_to')
    assignments_created: Mapped[list['ReportAssignment']] = relationship(back_populates='assigned_by_user', foreign_keys='ReportAssignment.assigned_by')
    assignments_received: Mapped[list['ReportAssignment']] = relationship(back_populates='assigned_to_user', foreign_keys='ReportAssignment.assigned_to')
    workflow_changes: Mapped[list['ReportStatusHistory']] = relationship(back_populates='changed_by_user', foreign_keys='ReportStatusHistory.changed_by')
    report_comments: Mapped[list['ReportComment']] = relationship(back_populates='author', foreign_keys='ReportComment.user_id')
