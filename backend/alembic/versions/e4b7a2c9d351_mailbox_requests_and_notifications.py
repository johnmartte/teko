"""mailbox requests and admin notifications

Revision ID: e4b7a2c9d351
Revises: d91f2c7a4e10
Create Date: 2026-10-09 20:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e4b7a2c9d351'
down_revision: Union[str, Sequence[str], None] = 'd91f2c7a4e10'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('mailbox_requests',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('planner_user_id', sa.String(length=64), nullable=False),
    sa.Column('planner_user_name', sa.String(length=200), nullable=False),
    sa.Column('planner_user_email', sa.String(length=320), nullable=False),
    sa.Column('status', sa.String(length=20), nullable=False, server_default='pending'),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_mailbox_requests_id'), 'mailbox_requests', ['id'], unique=False)
    op.create_index(op.f('ix_mailbox_requests_planner_user_id'), 'mailbox_requests', ['planner_user_id'], unique=False)
    op.create_index(op.f('ix_mailbox_requests_status'), 'mailbox_requests', ['status'], unique=False)

    op.create_table('admin_notifications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('kind', sa.String(length=50), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('body', sa.Text(), nullable=True),
    sa.Column('module', sa.String(length=50), nullable=True),
    sa.Column('ref_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_admin_notifications_id'), 'admin_notifications', ['id'], unique=False)
    op.create_index(op.f('ix_admin_notifications_kind'), 'admin_notifications', ['kind'], unique=False)
    op.create_index(op.f('ix_admin_notifications_created_at'), 'admin_notifications', ['created_at'], unique=False)

    op.create_table('admin_notification_reads',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('notification_id', sa.Integer(), nullable=False),
    sa.Column('admin_id', sa.Integer(), nullable=False),
    sa.Column('read_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['notification_id'], ['admin_notifications.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['admin_id'], ['admin_users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('notification_id', 'admin_id', name='uq_notification_admin')
    )
    op.create_index(op.f('ix_admin_notification_reads_id'), 'admin_notification_reads', ['id'], unique=False)
    op.create_index(op.f('ix_admin_notification_reads_notification_id'), 'admin_notification_reads', ['notification_id'], unique=False)
    op.create_index(op.f('ix_admin_notification_reads_admin_id'), 'admin_notification_reads', ['admin_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('admin_notification_reads')
    op.drop_table('admin_notifications')
    op.drop_table('mailbox_requests')
