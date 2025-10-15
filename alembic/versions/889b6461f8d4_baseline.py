"""baseline

Revision ID: 889b6461f8d4
Revises: 09bcd6505f73
Create Date: 2025-10-13 17:58:32.215945
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mssql

# revision identifiers, used by Alembic.
revision = '889b6461f8d4'
down_revision = '09bcd6505f73'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # SECURITY
    op.create_table(
        'Users',
        sa.Column('UserID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('Username', mssql.NVARCHAR(length=100), nullable=True),
        sa.Column('Email', mssql.NVARCHAR(length=255), nullable=False),
        sa.Column('PasswordHash', mssql.NVARCHAR(length=255), nullable=False),
        sa.Column('FullName', mssql.NVARCHAR(length=255), nullable=True),
        sa.Column('Language', mssql.NVARCHAR(length=10), nullable=True),
        sa.Column('IsActive', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('DateCreated', sa.DateTime(), nullable=False, server_default=sa.text('GETUTCDATE()')),
        sa.Column('LastLogin', sa.DateTime(), nullable=True),
        sa.Column('VerifiedCitizen', sa.Boolean(), nullable=False, server_default=sa.text('0')),
    )
    op.create_unique_constraint('uq_users_email', 'Users', ['Email'])
    op.create_unique_constraint('uq_users_username', 'Users', ['Username'])

    op.create_table(
        'Roles',
        sa.Column('RoleID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('RoleName', mssql.NVARCHAR(length=50), nullable=False),
        sa.Column('Description', mssql.NVARCHAR(length=255), nullable=True),
    )
    op.create_unique_constraint('uq_roles_name', 'Roles', ['RoleName'])

    op.create_table(
        'UserRoles',
        sa.Column('UserRoleID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('UserID', sa.Integer(), sa.ForeignKey('Users.UserID', ondelete='CASCADE'), nullable=False),
        sa.Column('RoleID', sa.Integer(), sa.ForeignKey('Roles.RoleID', ondelete='CASCADE'), nullable=False),
    )

    op.create_table(
        'AuditLogs',
        sa.Column('LogID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('UserID', sa.Integer(), sa.ForeignKey('Users.UserID'), nullable=True),
        sa.Column('Action', mssql.NVARCHAR(length=255), nullable=False),
        sa.Column('Entity', mssql.NVARCHAR(length=100), nullable=False),
        sa.Column('EntityID', sa.Integer(), nullable=True),
        sa.Column('Timestamp', sa.DateTime(), nullable=False, server_default=sa.text('GETUTCDATE()')),
        sa.Column('Details', sa.UnicodeText(), nullable=True),
    )

    # GOVERNMENT
    op.create_table(
        'Regions',
        sa.Column('RegionID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('RegionName', mssql.NVARCHAR(length=150), nullable=False),
        sa.Column('Code', mssql.NVARCHAR(length=10), nullable=True),
        sa.Column('Population', sa.Integer(), nullable=True),
        sa.Column('CapitalCityID', sa.Integer(), nullable=True),
    )

    op.create_table(
        'Provinces',
        sa.Column('ProvinceID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('RegionID', sa.Integer(), sa.ForeignKey('Regions.RegionID', ondelete='CASCADE'), nullable=False),
        sa.Column('ProvinceName', mssql.NVARCHAR(length=150), nullable=False),
        sa.Column('Code', mssql.NVARCHAR(length=10), nullable=True),
    )

    op.create_table(
        'Cities',
        sa.Column('CityID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('ProvinceID', sa.Integer(), sa.ForeignKey('Provinces.ProvinceID', ondelete='CASCADE'), nullable=False),
        sa.Column('CityName', mssql.NVARCHAR(length=150), nullable=False),
        sa.Column('Population', sa.Integer(), nullable=True),
    )

    op.create_table(
        'Institutions',
        sa.Column('InstitutionID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('Code', mssql.NVARCHAR(length=50), nullable=True),
        sa.Column('InstitutionName', mssql.NVARCHAR(length=200), nullable=False),
        sa.Column('InstitutionType', mssql.NVARCHAR(length=50), nullable=False),
        sa.Column('RegionID', sa.Integer(), sa.ForeignKey('Regions.RegionID'), nullable=True),
        sa.Column('ParentInstitutionID', sa.Integer(), sa.ForeignKey('Institutions.InstitutionID'), nullable=True),
    )

    op.create_table(
        'Officials',
        sa.Column('OfficialID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('FullName', mssql.NVARCHAR(length=255), nullable=False),
        sa.Column('PhotoURL', mssql.NVARCHAR(length=255), nullable=True),
        sa.Column('Biography', sa.UnicodeText(), nullable=True),
        sa.Column('ContactInfo', mssql.NVARCHAR(length=255), nullable=True),
    )

    op.create_table(
        'OfficialAssignments',
        sa.Column('AssignmentID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('OfficialID', sa.Integer(), sa.ForeignKey('Officials.OfficialID', ondelete='CASCADE'), nullable=False),
        sa.Column('InstitutionID', sa.Integer(), sa.ForeignKey('Institutions.InstitutionID', ondelete='CASCADE'), nullable=False),
        sa.Column('PositionTitle', mssql.NVARCHAR(length=150), nullable=False),
        sa.Column('StartDate', sa.Date(), nullable=False),
        sa.Column('EndDate', sa.Date(), nullable=True),
        sa.Column('IsActive', sa.Boolean(), nullable=False, server_default=sa.text('1')),
    )

    # REVIEWS
    op.create_table(
        'Reviews',
        sa.Column('ReviewID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('OfficialID', sa.Integer(), sa.ForeignKey('Officials.OfficialID', ondelete='CASCADE'), nullable=False),
        sa.Column('UserID', sa.Integer(), sa.ForeignKey('Users.UserID', ondelete='CASCADE'), nullable=False),
        sa.Column('Rating', sa.Numeric(2, 1), nullable=False),
        sa.Column('Title', mssql.NVARCHAR(length=255), nullable=True),
        sa.Column('Comment', sa.UnicodeText(), nullable=True),
        sa.Column('DatePosted', sa.DateTime(), nullable=False, server_default=sa.text('GETUTCDATE()')),
        sa.Column('IsApproved', sa.Boolean(), nullable=False, server_default=sa.text('0')),
        sa.Column('FlagCount', sa.Integer(), nullable=False, server_default=sa.text('0')),
    )

    op.create_table(
        'ReviewFlags',
        sa.Column('FlagID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('ReviewID', sa.Integer(), sa.ForeignKey('Reviews.ReviewID', ondelete='CASCADE'), nullable=False),
        sa.Column('UserID', sa.Integer(), sa.ForeignKey('Users.UserID'), nullable=False),
        sa.Column('Reason', mssql.NVARCHAR(length=255), nullable=False),
        sa.Column('DateFlagged', sa.DateTime(), nullable=False, server_default=sa.text('GETUTCDATE()')),
    )

    op.create_table(
        'ReviewModeration',
        sa.Column('ModerationID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('ReviewID', sa.Integer(), sa.ForeignKey('Reviews.ReviewID', ondelete='CASCADE'), nullable=False),
        sa.Column('ModeratorID', sa.Integer(), sa.ForeignKey('Users.UserID'), nullable=False),
        sa.Column('Decision', mssql.NVARCHAR(length=50), nullable=False),
        sa.Column('Notes', sa.UnicodeText(), nullable=True),
        sa.Column('DecisionDate', sa.DateTime(), nullable=False, server_default=sa.text('GETUTCDATE()')),
    )

    # LEGAL
    op.create_table(
        'LawIssues',
        sa.Column('IssueID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('IssueNumber', mssql.NVARCHAR(length=50), nullable=False),
        sa.Column('PublicationDate', sa.Date(), nullable=False),
        sa.Column('SourceURL', mssql.NVARCHAR(length=255), nullable=True),
        sa.Column('PDFFilePath', mssql.NVARCHAR(length=255), nullable=True),
    )

    op.create_table(
        'Laws',
        sa.Column('LawID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('IssueID', sa.Integer(), sa.ForeignKey('LawIssues.IssueID', ondelete='CASCADE'), nullable=False),
        sa.Column('LawNumber', mssql.NVARCHAR(length=50), nullable=False),
        sa.Column('Title', mssql.NVARCHAR(length=500), nullable=False),
        sa.Column('Category', mssql.NVARCHAR(length=100), nullable=True),
        sa.Column('EffectiveDate', sa.Date(), nullable=True),
        sa.Column('Summary', sa.UnicodeText(), nullable=True),
    )

    op.create_table(
        'LawArticles',
        sa.Column('ArticleID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('LawID', sa.Integer(), sa.ForeignKey('Laws.LawID', ondelete='CASCADE'), nullable=False),
        sa.Column('ArticleNumber', mssql.NVARCHAR(length=20), nullable=True),
        sa.Column('Content', sa.UnicodeText(), nullable=False),
        sa.Column('Keywords', mssql.NVARCHAR(length=255), nullable=True),
    )

    op.create_table(
        'LawTags',
        sa.Column('TagID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('LawID', sa.Integer(), sa.ForeignKey('Laws.LawID', ondelete='CASCADE'), nullable=False),
        sa.Column('TagName', mssql.NVARCHAR(length=100), nullable=False),
    )

    # ECONOMY
    op.create_table(
        'Budgets',
        sa.Column('BudgetID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('Year', sa.Integer(), nullable=False),
        sa.Column('RegionID', sa.Integer(), sa.ForeignKey('Regions.RegionID'), nullable=True),
        sa.Column('InstitutionID', sa.Integer(), sa.ForeignKey('Institutions.InstitutionID'), nullable=False),
        sa.Column('TotalAmount', sa.Numeric(18, 2), nullable=False),
        sa.Column('Currency', mssql.NVARCHAR(length=10), nullable=True),
        sa.Column('DatePublished', sa.Date(), nullable=True),
    )

    op.create_table(
        'BudgetItems',
        sa.Column('ItemID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('BudgetID', sa.Integer(), sa.ForeignKey('Budgets.BudgetID', ondelete='CASCADE'), nullable=False),
        sa.Column('Category', mssql.NVARCHAR(length=150), nullable=False),
        sa.Column('Description', mssql.NVARCHAR(length=500), nullable=True),
        sa.Column('Amount', sa.Numeric(18, 2), nullable=False),
        sa.Column('RegionID', sa.Integer(), sa.ForeignKey('Regions.RegionID'), nullable=True),
    )

    op.create_table(
        'Suppliers',
        sa.Column('SupplierID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('SupplierName', mssql.NVARCHAR(length=255), nullable=False),
        sa.Column('TIN', mssql.NVARCHAR(length=50), nullable=True),
        sa.Column('Country', mssql.NVARCHAR(length=100), nullable=True),
    )

    op.create_table(
        'PublicContracts',
        sa.Column('ContractID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('ContractNumber', mssql.NVARCHAR(length=50), nullable=False),
        sa.Column('SupplierID', sa.Integer(), sa.ForeignKey('Suppliers.SupplierID'), nullable=False),
        sa.Column('InstitutionID', sa.Integer(), sa.ForeignKey('Institutions.InstitutionID'), nullable=False),
        sa.Column('Amount', sa.Numeric(18, 2), nullable=False),
        sa.Column('StartDate', sa.Date(), nullable=True),
        sa.Column('EndDate', sa.Date(), nullable=True),
        sa.Column('Status', mssql.NVARCHAR(length=50), nullable=True),
        sa.Column('Description', mssql.NVARCHAR(length=500), nullable=True),
    )

    # AWARENESS
    op.create_table(
        'AwarenessTopics',
        sa.Column('TopicID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('Title', mssql.NVARCHAR(length=255), nullable=False),
        sa.Column('Category', mssql.NVARCHAR(length=100), nullable=True),
        sa.Column('Description', mssql.NVARCHAR(length=None), nullable=True),
    )

    op.create_table(
        'AwarenessArticles',
        sa.Column('ArticleID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('TopicID', sa.Integer(), sa.ForeignKey('AwarenessTopics.TopicID', ondelete='CASCADE'), nullable=False),
        sa.Column('Title', mssql.NVARCHAR(length=255), nullable=False),
        sa.Column('Content', mssql.NVARCHAR(length=None), nullable=False),
        sa.Column('DatePublished', sa.Date(), nullable=True),
        sa.Column('AuthorID', sa.Integer(), sa.ForeignKey('Users.UserID'), nullable=True),
    )

    op.create_table(
        'Quizzes',
        sa.Column('QuizID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('TopicID', sa.Integer(), sa.ForeignKey('AwarenessTopics.TopicID', ondelete='CASCADE'), nullable=False),
        sa.Column('Title', mssql.NVARCHAR(length=255), nullable=False),
        sa.Column('Description', mssql.NVARCHAR(length=255), nullable=True),
    )

    op.create_table(
        'QuizQuestions',
        sa.Column('QuestionID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('QuizID', sa.Integer(), sa.ForeignKey('Quizzes.QuizID', ondelete='CASCADE'), nullable=False),
        sa.Column('QuestionText', mssql.NVARCHAR(length=500), nullable=False),
        sa.Column('CorrectAnswer', mssql.NVARCHAR(length=255), nullable=False),
        sa.Column('OptionA', mssql.NVARCHAR(length=255), nullable=True),
        sa.Column('OptionB', mssql.NVARCHAR(length=255), nullable=True),
        sa.Column('OptionC', mssql.NVARCHAR(length=255), nullable=True),
        sa.Column('OptionD', mssql.NVARCHAR(length=255), nullable=True),
    )

    op.create_table(
        'QuizResults',
        sa.Column('ResultID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('UserID', sa.Integer(), sa.ForeignKey('Users.UserID', ondelete='CASCADE'), nullable=False),
        sa.Column('QuizID', sa.Integer(), sa.ForeignKey('Quizzes.QuizID', ondelete='CASCADE'), nullable=False),
        sa.Column('Score', sa.Numeric(4, 2), nullable=False),
        sa.Column('CompletionDate', sa.DateTime(), nullable=True),
    )

    # AI
    op.create_table(
        'AIQueries',
        sa.Column('QueryID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('UserID', sa.Integer(), sa.ForeignKey('Users.UserID'), nullable=True),
        sa.Column('QueryText', sa.UnicodeText(), nullable=False),
        sa.Column('QueryDate', sa.DateTime(), nullable=False, server_default=sa.text('GETUTCDATE()')),
    )

    op.create_table(
        'AIAnswers',
        sa.Column('AnswerID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('QueryID', sa.Integer(), sa.ForeignKey('AIQueries.QueryID', ondelete='CASCADE'), nullable=False),
        sa.Column('AnswerText', sa.UnicodeText(), nullable=False),
        sa.Column('ConfidenceScore', sa.Numeric(5, 2), nullable=True),
        sa.Column('DisclaimerAdded', sa.Boolean(), nullable=True),
        sa.Column('AnswerDate', sa.DateTime(), nullable=False, server_default=sa.text('GETUTCDATE()')),
    )

    op.create_table(
        'AIAnswerSources',
        sa.Column('SourceID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('AnswerID', sa.Integer(), sa.ForeignKey('AIAnswers.AnswerID', ondelete='CASCADE'), nullable=False),
        sa.Column('LawID', sa.Integer(), sa.ForeignKey('Laws.LawID'), nullable=True),
        sa.Column('ArticleID', sa.Integer(), sa.ForeignKey('LawArticles.ArticleID'), nullable=True),
        sa.Column('RelevanceScore', sa.Numeric(5, 2), nullable=True),
    )

    op.create_table(
        'AIUserFeedback',
        sa.Column('FeedbackID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('AnswerID', sa.Integer(), sa.ForeignKey('AIAnswers.AnswerID', ondelete='CASCADE'), nullable=False),
        sa.Column('UserID', sa.Integer(), sa.ForeignKey('Users.UserID'), nullable=True),
        sa.Column('FeedbackType', mssql.NVARCHAR(length=50), nullable=False),
        sa.Column('Comment', sa.UnicodeText(), nullable=True),
        sa.Column('FeedbackDate', sa.DateTime(), nullable=False, server_default=sa.text('GETUTCDATE()')),
    )

    # SYSTEM
    op.create_table(
        'Notifications',
        sa.Column('NotificationID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('UserID', sa.Integer(), sa.ForeignKey('Users.UserID'), nullable=True),
        sa.Column('Title', mssql.NVARCHAR(length=255), nullable=False),
        sa.Column('Message', sa.UnicodeText(), nullable=False),
        sa.Column('Type', mssql.NVARCHAR(length=50), nullable=True),
        sa.Column('IsRead', sa.Boolean(), nullable=False, server_default=sa.text('0')),
        sa.Column('CreatedDate', sa.DateTime(), nullable=False, server_default=sa.text('GETUTCDATE()')),
    )

    op.create_table(
        'SystemParameters',
        sa.Column('ParamID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('Key', mssql.NVARCHAR(length=100), nullable=False),
        sa.Column('Value', mssql.NVARCHAR(length=255), nullable=True),
        sa.Column('Description', mssql.NVARCHAR(length=255), nullable=True),
    )
    op.create_unique_constraint('uq_systemparameters_key', 'SystemParameters', ['Key'])

    op.create_table(
        'DataSources',
        sa.Column('SourceID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('Name', mssql.NVARCHAR(length=100), nullable=False),
        sa.Column('URL', mssql.NVARCHAR(length=255), nullable=True),
        sa.Column('Type', mssql.NVARCHAR(length=50), nullable=True),
        sa.Column('LastSync', sa.DateTime(), nullable=True),
        sa.Column('Status', mssql.NVARCHAR(length=50), nullable=True),
    )

    op.create_table(
        'ErrorLogs',
        sa.Column('ErrorID', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('Module', mssql.NVARCHAR(length=100), nullable=False),
        sa.Column('Message', sa.UnicodeText(), nullable=False),
        sa.Column('Severity', mssql.NVARCHAR(length=50), nullable=True),
        sa.Column('Timestamp', sa.DateTime(), nullable=False, server_default=sa.text('GETUTCDATE()')),
    )


def downgrade() -> None:
    # Reverse creation order to satisfy FKs
    op.drop_table('ErrorLogs')
    op.drop_table('DataSources')
    op.drop_constraint('uq_systemparameters_key', 'SystemParameters', type_='unique')
    op.drop_table('SystemParameters')
    op.drop_table('Notifications')

    op.drop_table('AIUserFeedback')
    op.drop_table('AIAnswerSources')
    op.drop_table('AIAnswers')
    op.drop_table('AIQueries')

    op.drop_table('QuizResults')
    op.drop_table('QuizQuestions')
    op.drop_table('Quizzes')
    op.drop_table('AwarenessArticles')
    op.drop_table('AwarenessTopics')

    op.drop_table('PublicContracts')
    op.drop_table('Suppliers')
    op.drop_table('BudgetItems')
    op.drop_table('Budgets')

    op.drop_table('LawTags')
    op.drop_table('LawArticles')
    op.drop_table('Laws')
    op.drop_table('LawIssues')

    op.drop_table('ReviewModeration')
    op.drop_table('ReviewFlags')
    op.drop_table('Reviews')

    op.drop_table('OfficialAssignments')
    op.drop_table('Officials')
    op.drop_table('Institutions')
    op.drop_table('Cities')
    op.drop_table('Provinces')
    op.drop_table('Regions')

    op.drop_table('AuditLogs')
    op.drop_table('UserRoles')
    op.drop_constraint('uq_roles_name', 'Roles', type_='unique')
    op.drop_table('Roles')
    op.drop_constraint('uq_users_username', 'Users', type_='unique')
    op.drop_constraint('uq_users_email', 'Users', type_='unique')
    op.drop_table('Users')


