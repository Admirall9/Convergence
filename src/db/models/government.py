from datetime import date
from typing import Optional

from sqlalchemy import Boolean, Date, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.mssql import NVARCHAR

from src.db.base import Base


class Regions(Base):
    __tablename__ = "Regions"

    RegionID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    RegionName: Mapped[str] = mapped_column(NVARCHAR(150))
    Code: Mapped[str | None] = mapped_column(NVARCHAR(10), nullable=True)
    Population: Mapped[int | None] = mapped_column(Integer, nullable=True)
    CapitalCityID: Mapped[int | None] = mapped_column(ForeignKey("Cities.CityID"), nullable=True)


class Provinces(Base):
    __tablename__ = "Provinces"

    ProvinceID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    RegionID: Mapped[int] = mapped_column(ForeignKey("Regions.RegionID", ondelete="CASCADE"))
    ProvinceName: Mapped[str] = mapped_column(NVARCHAR(150))
    Code: Mapped[str | None] = mapped_column(NVARCHAR(10), nullable=True)


class Cities(Base):
    __tablename__ = "Cities"

    CityID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ProvinceID: Mapped[int] = mapped_column(ForeignKey("Provinces.ProvinceID", ondelete="CASCADE"))
    CityName: Mapped[str] = mapped_column(NVARCHAR(150))
    Population: Mapped[int | None] = mapped_column(Integer, nullable=True)


class Institutions(Base):
    __tablename__ = "Institutions"

    InstitutionID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    Code: Mapped[str | None] = mapped_column(NVARCHAR(50), nullable=True)
    InstitutionName: Mapped[str] = mapped_column(NVARCHAR(200))
    InstitutionType: Mapped[str] = mapped_column(NVARCHAR(50))
    RegionID: Mapped[int | None] = mapped_column(ForeignKey("Regions.RegionID"), nullable=True)
    ParentInstitutionID: Mapped[int | None] = mapped_column(ForeignKey("Institutions.InstitutionID"), nullable=True)


class Officials(Base):
    __tablename__ = "Officials"

    OfficialID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    FullName: Mapped[str] = mapped_column(NVARCHAR(255))
    PhotoURL: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)
    Biography: Mapped[str | None] = mapped_column(NVARCHAR(None), nullable=True)
    ContactInfo: Mapped[str | None] = mapped_column(NVARCHAR(255), nullable=True)


class OfficialAssignments(Base):
    __tablename__ = "OfficialAssignments"

    AssignmentID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    OfficialID: Mapped[int] = mapped_column(ForeignKey("Officials.OfficialID", ondelete="CASCADE"))
    InstitutionID: Mapped[int] = mapped_column(ForeignKey("Institutions.InstitutionID", ondelete="CASCADE"))
    PositionTitle: Mapped[str] = mapped_column(NVARCHAR(150))
    StartDate: Mapped[date] = mapped_column(Date)
    EndDate: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    IsActive: Mapped[bool] = mapped_column(Boolean, default=True)


