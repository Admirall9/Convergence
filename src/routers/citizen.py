from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from src.core.security import create_access_token, hash_password, verify_password, decode_token
from src.core.settings import settings
from src.db.models.security import Users
from src.db.models.reviews import Reviews
from src.db.session import SessionLocal
from src.schemas.citizen import ReviewCreate, ReviewOut, UserCreate, UserOut


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/citizen/token")


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register", response_model=UserOut)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(Users).filter(Users.Email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    user = Users(
        Username=payload.email,  # Use email as username for now
        Email=payload.email, 
        PasswordHash=hash_password(payload.password), 
        IsActive=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserOut(id=user.UserID, email=user.Email, is_active=user.IsActive)


@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.Email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.PasswordHash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(subject=str(user.UserID), secret=settings.auth_secret)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/reviews", response_model=ReviewOut)
def create_review(payload: ReviewCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    data = decode_token(token, settings.auth_secret)
    if not data or "sub" not in data:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = int(data["sub"])
    review = Reviews(
        OfficialID=payload.official_id,
        UserID=user_id,
        Rating=float(payload.rating),
        Title=None,
        Comment=payload.content,
        IsApproved=False,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return ReviewOut(
        id=review.ReviewID,
        user_id=review.UserID,
        official_id=review.OfficialID,
        rating=float(review.Rating),
        content=review.Comment or "",
        status="approved" if review.IsApproved else "pending",
        created_at=review.DatePosted,
    )


