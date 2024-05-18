"""Add listing model

Revision ID: a44a39c65f5a
Revises: 
Create Date: 2024-05-18 14:43:42.563839

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'a44a39c65f5a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Drop the table if it exists
    op.execute('DROP TABLE IF EXISTS listing')

    # Create the new table
    op.create_table('listing',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('people_needed', sa.Integer(), nullable=False),
    sa.Column('price', sa.Integer(), nullable=False),
    sa.Column('elo', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('listing')
