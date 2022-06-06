from sqlalchemy.orm import Session

from . import model, schemas


def create_user(db: Session, user: schemas.User):
    db_user = model.User(fullname=user.fullname, user_name=user.user_name, password=user.password , user_type=user.user_type )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user(db: Session, user_id: int):
    return db.query(model.User).filter(model.User.user_id == user_id).first()

