from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.mssql import NVARCHAR

from src.db.base import Base


class Reviews(Base):
    __tablename__ = "Reviews"

    ReviewID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    OfficialID: Mapped[int] = mapped_column(ForeignKey("Officials.OfficialID", ondelete="CASCADE"))
    UserID: Mapped[int] = mapped_column(ForeignKey("Users.UserID", ondelete="CASCADE"))
    Rating: Mapped[float] = mapped_column(Numeric(2, 1))
    Title: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)
    Comment: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)
    DatePosted: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    IsApproved: Mapped[bool] = mapped_column(Boolean, default=False)
    FlagCount: Mapped[int] = mapped_column(Integer, default=0)


class ReviewFlags(Base):
    __tablename__ = "ReviewFlags"

    FlagID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ReviewID: Mapped[int] = mapped_column(ForeignKey("Reviews.ReviewID", ondelete="CASCADE"))
    UserID: Mapped[int] = mapped_column(ForeignKey("Users.UserID", ondelete="CASCADE"))
    Reason: Mapped[str] = mapped_column(NVARCHAR(255))
    DateFlagged: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ReviewModeration(Base):
    __tablename__ = "ReviewModeration"

    ModerationID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ReviewID: Mapped[int] = mapped_column(ForeignKey("Reviews.ReviewID", ondelete="CASCADE"))
    ModeratorID: Mapped[int] = mapped_column(ForeignKey("Users.UserID"))
    Decision: Mapped[str] = mapped_column(NVARCHAR(50))
    Notes: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)
    DecisionDate: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


