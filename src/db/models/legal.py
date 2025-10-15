from datetime import date

from sqlalchemy import Date, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.mssql import NVARCHAR

from src.db.base import Base


class LawIssues(Base):
    __tablename__ = "LawIssues"

    IssueID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    IssueNumber: Mapped[str] = mapped_column(NVARCHAR(50))
    PublicationDate: Mapped[date] = mapped_column(Date)
    SourceURL: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)
    PDFFilePath: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)


class Laws(Base):
    __tablename__ = "Laws"

    LawID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    IssueID: Mapped[int] = mapped_column(ForeignKey("LawIssues.IssueID", ondelete="CASCADE"))
    LawNumber: Mapped[str] = mapped_column(NVARCHAR(50))
    Title: Mapped[str] = mapped_column(NVARCHAR(500))
    Category: Mapped[str | None] = mapped_column(NVARCHAR(100), nullable=True)
    EffectiveDate: Mapped[date | None] = mapped_column(Date, nullable=True)
    Summary: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)


class LawArticles(Base):
    __tablename__ = "LawArticles"

    ArticleID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    LawID: Mapped[int] = mapped_column(ForeignKey("Laws.LawID", ondelete="CASCADE"))
    ArticleNumber: Mapped[str | None] = mapped_column(NVARCHAR(20), nullable=True)
    Content: Mapped[str] = mapped_column(NVARCHAR(None))
    Keywords: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)


class LawTags(Base):
    __tablename__ = "LawTags"

    TagID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    LawID: Mapped[int] = mapped_column(ForeignKey("Laws.LawID", ondelete="CASCADE"))
    TagName: Mapped[str] = mapped_column(NVARCHAR(100))


