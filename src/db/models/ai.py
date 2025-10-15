from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.mssql import NVARCHAR

from src.db.base import Base


class AIQueries(Base):
    __tablename__ = "AIQueries"

    QueryID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    UserID: Mapped[int | None] = mapped_column(ForeignKey("Users.UserID"), nullable=True)
    QueryText: Mapped[str] = mapped_column(NVARCHAR(None))
    QueryDate: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AIAnswers(Base):
    __tablename__ = "AIAnswers"

    AnswerID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    QueryID: Mapped[int] = mapped_column(ForeignKey("AIQueries.QueryID", ondelete="CASCADE"))
    AnswerText: Mapped[str] = mapped_column(NVARCHAR(None))
    ConfidenceScore: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    DisclaimerAdded: Mapped[bool | None] = mapped_column(default=None)
    AnswerDate: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AIAnswerSources(Base):
    __tablename__ = "AIAnswerSources"

    SourceID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    AnswerID: Mapped[int] = mapped_column(ForeignKey("AIAnswers.AnswerID", ondelete="CASCADE"))
    LawID: Mapped[int | None] = mapped_column(ForeignKey("Laws.LawID"), nullable=True)
    ArticleID: Mapped[int | None] = mapped_column(ForeignKey("LawArticles.ArticleID"), nullable=True)
    RelevanceScore: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)


class AIUserFeedback(Base):
    __tablename__ = "AIUserFeedback"

    FeedbackID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    AnswerID: Mapped[int] = mapped_column(ForeignKey("AIAnswers.AnswerID", ondelete="CASCADE"))
    UserID: Mapped[int | None] = mapped_column(ForeignKey("Users.UserID"), nullable=True)
    FeedbackType: Mapped[str] = mapped_column(NVARCHAR(50))
    Comment: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)
    FeedbackDate: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


