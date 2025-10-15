from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.mssql import NVARCHAR

from src.db.base import Base


class Notifications(Base):
    __tablename__ = "Notifications"

    NotificationID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    UserID: Mapped[int | None] = mapped_column(ForeignKey("Users.UserID"), nullable=True)
    Title: Mapped[str] = mapped_column(NVARCHAR(255))
    Message: Mapped[str] = mapped_column(NVARCHAR(None))
    Type: Mapped[str | None] = mapped_column(NVARCHAR(50), nullable=True)
    IsRead: Mapped[bool] = mapped_column(default=False)
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SystemParameters(Base):
    __tablename__ = "SystemParameters"

    ParamID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    Key: Mapped[str] = mapped_column(NVARCHAR(100), unique=True)
    Value: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)
    Description: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)


class DataSources(Base):
    __tablename__ = "DataSources"

    SourceID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    Name: Mapped[str] = mapped_column(NVARCHAR(100))
    URL: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)
    Type: Mapped[str | None] = mapped_column(NVARCHAR(50), nullable=True)
    LastSync: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    Status: Mapped[str | None] = mapped_column(NVARCHAR(50), nullable=True)


class ErrorLogs(Base):
    __tablename__ = "ErrorLogs"

    ErrorID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    Module: Mapped[str] = mapped_column(NVARCHAR(100))
    Message: Mapped[str] = mapped_column(NVARCHAR(None))
    Severity: Mapped[str | None] = mapped_column(NVARCHAR(50), nullable=True)
    Timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ETLJobs(Base):
    __tablename__ = "ETLJobs"

    JobID: Mapped[str] = mapped_column(NVARCHAR(50), primary_key=True)
    SourceURL: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)
    FilePath: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)
    Status: Mapped[str] = mapped_column(NVARCHAR(50), default="started")
    PagesParsed: Mapped[int] = mapped_column(Integer, default=0)
    Errors: Mapped[int] = mapped_column(Integer, default=0)
    CreatedAt: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


