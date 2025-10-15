from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base


class Institution(Base):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    type: Mapped[str] = mapped_column(String(50))  # Ministry, Agency, Region, etc.
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("institution.id"), nullable=True)

    parent: Mapped["Institution"] = relationship(remote_side="Institution.id")
    officials: Mapped[list["Official"]] = relationship(back_populates="institution")


class Official(Base):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    person_name: Mapped[str] = mapped_column(String(255), index=True)
    institution_id: Mapped[int] = mapped_column(ForeignKey("institution.id"))

    institution: Mapped[Institution] = relationship(back_populates="officials")
    tenures: Mapped[list["Tenure"]] = relationship(back_populates="official")


class Tenure(Base):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    official_id: Mapped[int] = mapped_column(ForeignKey("official.id"))
    role: Mapped[str] = mapped_column(String(120))
    start_date: Mapped[datetime]
    end_date: Mapped[Optional[datetime]] = mapped_column(nullable=True)

    official: Mapped[Official] = relationship(back_populates="tenures")

    __table_args__ = (
        UniqueConstraint("official_id", "role", "start_date", name="uq_tenure_official_role_start"),
    )


