from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.mssql import NVARCHAR

from src.db.base import Base


class Users(Base):
    __tablename__ = "Users"

    UserID: Mapped[int] = mapped_column("UserID", Integer, primary_key=True, autoincrement=True)
    Username: Mapped[str | None] = mapped_column("Username", NVARCHAR(100), unique=True, index=True, nullable=True)
    Email: Mapped[str] = mapped_column("Email", NVARCHAR(255), unique=True, index=True)
    PasswordHash: Mapped[str] = mapped_column("PasswordHash", NVARCHAR(255))
    FullName: Mapped[str | None] = mapped_column("FullName", NVARCHAR(255), nullable=True)
    Language: Mapped[str | None] = mapped_column("Language", NVARCHAR(10), nullable=True)
    IsActive: Mapped[bool] = mapped_column("IsActive", Boolean, default=True)
    DateCreated: Mapped[datetime] = mapped_column("DateCreated", DateTime, default=datetime.utcnow)
    LastLogin: Mapped[datetime | None] = mapped_column("LastLogin", DateTime, nullable=True)
    VerifiedCitizen: Mapped[bool] = mapped_column("VerifiedCitizen", Boolean, default=False)


class Roles(Base):
    __tablename__ = "Roles"

    RoleID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    RoleName: Mapped[str] = mapped_column(NVARCHAR(50), unique=True)
    Description: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)


class UserRoles(Base):
    __tablename__ = "UserRoles"

    UserRoleID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    UserID: Mapped[int] = mapped_column(ForeignKey("Users.UserID", ondelete="CASCADE"))
    RoleID: Mapped[int] = mapped_column(ForeignKey("Roles.RoleID", ondelete="CASCADE"))


class AuditLogs(Base):
    __tablename__ = "AuditLogs"

    LogID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    UserID: Mapped[int | None] = mapped_column(ForeignKey("Users.UserID", ondelete="SET NULL"), nullable=True)
    Action: Mapped[str] = mapped_column(NVARCHAR(255))
    Entity: Mapped[str] = mapped_column(NVARCHAR(100))
    EntityID: Mapped[int | None] = mapped_column(Integer, nullable=True)
    Timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    Details: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)  # NVARCHAR(MAX)


