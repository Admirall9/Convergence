from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.mssql import NVARCHAR

from src.db.base import Base


class Budgets(Base):
    __tablename__ = "Budgets"

    BudgetID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    Year: Mapped[int] = mapped_column(Integer)
    RegionID: Mapped[int | None] = mapped_column(ForeignKey("Regions.RegionID"), nullable=True)
    InstitutionID: Mapped[int] = mapped_column(ForeignKey("Institutions.InstitutionID"))
    TotalAmount: Mapped[float] = mapped_column(Numeric(18, 2))
    Currency: Mapped[str | None] = mapped_column(NVARCHAR(10), nullable=True)
    DatePublished: Mapped[date | None] = mapped_column(Date, nullable=True)


class BudgetItems(Base):
    __tablename__ = "BudgetItems"

    ItemID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    BudgetID: Mapped[int] = mapped_column(ForeignKey("Budgets.BudgetID", ondelete="CASCADE"))
    Category: Mapped[str] = mapped_column(NVARCHAR(150))
    Description: Mapped[str | None] = mapped_column(NVARCHAR(500), nullable=True)
    Amount: Mapped[float] = mapped_column(Numeric(18, 2))
    RegionID: Mapped[int | None] = mapped_column(ForeignKey("Regions.RegionID"), nullable=True)


class Suppliers(Base):
    __tablename__ = "Suppliers"

    SupplierID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    SupplierName: Mapped[str] = mapped_column(NVARCHAR(255))
    TIN: Mapped[str | None] = mapped_column(NVARCHAR(50), nullable=True)
    Country: Mapped[str | None] = mapped_column(NVARCHAR(100), nullable=True)


class PublicContracts(Base):
    __tablename__ = "PublicContracts"

    ContractID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ContractNumber: Mapped[str] = mapped_column(NVARCHAR(50))
    SupplierID: Mapped[int] = mapped_column(ForeignKey("Suppliers.SupplierID"))
    InstitutionID: Mapped[int] = mapped_column(ForeignKey("Institutions.InstitutionID"))
    Amount: Mapped[float] = mapped_column(Numeric(18, 2))
    StartDate: Mapped[date | None] = mapped_column(Date, nullable=True)
    EndDate: Mapped[date | None] = mapped_column(Date, nullable=True)
    Status: Mapped[str | None] = mapped_column(NVARCHAR(50), nullable=True)
    Description: Mapped[str | None] = mapped_column(NVARCHAR(500), nullable=True)


