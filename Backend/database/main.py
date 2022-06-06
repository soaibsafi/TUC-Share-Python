from typing import List

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from . import query, model, schemas
from .db_config import SessionLocal, engine

model.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.User, db: Session = Depends(get_db)):
    return query.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = query.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.get("/login")
# return user type as response

#Admin API
@app.get("/requests")
# get all pending requests

@app.delete("/unblock")
# delete hash from https://www.tu-chemnitz.de/informatik/DVS/blocklist/

@app.put("/block")
# add file hash to the https://www.tu-chemnitz.de/informatik/DVS/blocklist/

#User API
@app.get("/checkHash")
# check hash from https://www.tu-chemnitz.de/informatik/DVS/blocklist/

@app.post("/uploadFile")
# Add selected file to the database and return the corresponding url

@app.get("/files/{user_id}")
# Return all files belongs to this user

@app.delete("/file/{file_id}")
# delete a file for register user

@app.get("/fileInfo")
# return file information

@app.get("/download")
# download the actual file

@app.post("/changeStatus")
# user can send request to admin to block/unblock