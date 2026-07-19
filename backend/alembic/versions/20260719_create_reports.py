"""create reports table

Revision ID: 4e0f70c4f6d2
Revises: 74b04e39fa10
Create Date: 2026-07-19 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '4e0f70c4f6d2'
down_revision = '74b04e39fa10'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('severity', sa.Enum('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', name='reportseverity'), nullable=False),
        sa.Column('status', sa.Enum('REPORTED', 'AI_VERIFIED', 'OFFICER_VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', name='reportstatus'), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('address', sa.String(length=255), nullable=False),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('reported_by', sa.Integer(), nullable=False),
        sa.Column('assigned_to', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['reported_by'], ['users.id']),
        sa.ForeignKeyConstraint(['assigned_to'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_reports_assigned_to'), 'reports', ['assigned_to'], unique=False)
    op.create_index(op.f('ix_reports_reported_by'), 'reports', ['reported_by'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_reports_reported_by'), table_name='reports')
    op.drop_index(op.f('ix_reports_assigned_to'), table_name='reports')
    op.drop_table('reports')
