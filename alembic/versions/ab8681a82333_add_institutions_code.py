"""add institutions.code

Revision ID: ab8681a82333
Revises: 889b6461f8d4
Create Date: 2025-10-13 19:04:05.408558
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mssql

# revision identifiers, used by Alembic.
revision = 'ab8681a82333'
down_revision = '889b6461f8d4'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('Institutions', sa.Column('Code', mssql.NVARCHAR(length=50), nullable=True))
    op.create_index('ix_Institutions_Code', 'Institutions', ['Code'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_Institutions_Code', table_name='Institutions')
    op.drop_column('Institutions', 'Code')


