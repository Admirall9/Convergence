from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.mssql import NVARCHAR

from src.db.base import Base


class AwarenessTopics(Base):
    __tablename__ = "AwarenessTopics"

    TopicID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    Title: Mapped[str] = mapped_column(NVARCHAR(255))
    Category: Mapped[str | None] = mapped_column(NVARCHAR(100), nullable=True)
    Description: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)


class AwarenessArticles(Base):
    __tablename__ = "AwarenessArticles"

    ArticleID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    TopicID: Mapped[int] = mapped_column(ForeignKey("AwarenessTopics.TopicID", ondelete="CASCADE"))
    Title: Mapped[str] = mapped_column(NVARCHAR(255))
    Content: Mapped[str] = mapped_column(NVARCHAR(None))
    DatePublished: Mapped[date | None] = mapped_column(Date, nullable=True)
    AuthorID: Mapped[int | None] = mapped_column(ForeignKey("Users.UserID"), nullable=True)


class Quizzes(Base):
    __tablename__ = "Quizzes"

    QuizID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    TopicID: Mapped[int] = mapped_column(ForeignKey("AwarenessTopics.TopicID", ondelete="CASCADE"))
    Title: Mapped[str] = mapped_column(NVARCHAR(255))
    Description: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)


class QuizQuestions(Base):
    __tablename__ = "QuizQuestions"

    QuestionID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    QuizID: Mapped[int] = mapped_column(ForeignKey("Quizzes.QuizID", ondelete="CASCADE"))
    QuestionText: Mapped[str] = mapped_column(NVARCHAR(500))
    CorrectAnswer: Mapped[str] = mapped_column(NVARCHAR(255))
    OptionA: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)
    OptionB: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)
    OptionC: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)
    OptionD: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)


class QuizResults(Base):
    __tablename__ = "QuizResults"

    ResultID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    UserID: Mapped[int] = mapped_column(ForeignKey("Users.UserID", ondelete="CASCADE"))
    QuizID: Mapped[int] = mapped_column(ForeignKey("Quizzes.QuizID", ondelete="CASCADE"))
    Score: Mapped[float] = mapped_column()
    CompletionDate: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


