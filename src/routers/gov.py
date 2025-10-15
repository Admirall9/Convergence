from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.db.session import SessionLocal
from src.db.models.government import Institutions, Officials, OfficialAssignments
from src.schemas.gov import (
    InstitutionCreate,
    InstitutionOut,
    OfficialCreate,
    OfficialOut,
    TenureCreate,
    TenureOut,
)


router = APIRouter()


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/institutions", response_model=InstitutionOut)
def create_institution(payload: InstitutionCreate, db: Session = Depends(get_db)):
    # Ensure code uniqueness if provided
    if payload.code:
        existing = db.query(Institutions).filter(Institutions.Code == payload.code).first()
        if existing:
            raise HTTPException(status_code=409, detail="Institution code already exists")
    inst = Institutions(
        InstitutionName=payload.name,
        InstitutionType=payload.type,
        ParentInstitutionID=payload.parent_id if payload.parent_id and payload.parent_id > 0 else None,
        RegionID=None,
        Code=payload.code,
    )
    db.add(inst)
    db.commit()
    db.refresh(inst)
    return InstitutionOut(
        id=inst.InstitutionID,
        code=inst.Code or "",
        name=inst.InstitutionName,
        type=inst.InstitutionType,
        parent_id=inst.ParentInstitutionID,
    )


@router.get("/institutions", response_model=list[InstitutionOut])
def list_institutions(db: Session = Depends(get_db)):
    rows = db.query(Institutions).all()
    return [
        InstitutionOut(
            id=r.InstitutionID,
            code=r.Code or "",
            name=r.InstitutionName,
            type=r.InstitutionType,
            parent_id=r.ParentInstitutionID,
        )
        for r in rows
    ]


@router.post("/officials", response_model=OfficialOut)
def create_official(payload: OfficialCreate, db: Session = Depends(get_db)):
    off = Officials(FullName=payload.person_name)
    db.add(off)
    db.commit()
    db.refresh(off)
    return OfficialOut(id=off.OfficialID, person_name=payload.person_name, institution_id=payload.institution_id)


@router.post("/tenures", response_model=TenureOut)
def create_tenure(payload: TenureCreate, db: Session = Depends(get_db)):
    ten = OfficialAssignments(
        OfficialID=payload.official_id,
        InstitutionID=None,
        PositionTitle=payload.role,
        StartDate=payload.start_date.date() if hasattr(payload.start_date, 'date') else payload.start_date,
        EndDate=payload.end_date.date() if payload.end_date and hasattr(payload.end_date, 'date') else payload.end_date,
        IsActive=True,
    )
    db.add(ten)
    db.commit()
    db.refresh(ten)
    return TenureOut(id=ten.AssignmentID, official_id=payload.official_id, role=payload.role, start_date=payload.start_date, end_date=payload.end_date)


