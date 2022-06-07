from typing import List
import time
import asyncio
from unittest import result

from matplotlib.style import use

from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session


from database import query, model, schemas
from database.db_config import SessionLocal, engine


model.Base.metadata.create_all(bind=engine)
file_path = "./database/a.pdf"
app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def read_in_chunks(file_object, chunk_size=1024):
    while True:
        data = file_object.read(chunk_size)
        if not data:
            break
        yield data

def iterfile():
    f = open(file_path, mode="rb")
    while True:
        data = f.read(1024)
        if not data:
            break
        yield data

    # with open(file_path, mode="rb") as file_like:
    #     #TODO get file size -> divide into chunk -> for loop every chunk
    #     for file in file_like:
    #         for i in range(52):
    #             time.sleep(0.001)
    #             yield from file_like



@app.get("/", response_class=FileResponse)
async def main():
    #return StreamingResponse(iterfile())
    return file_path



@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.User, db: Session = Depends(get_db)):
    return query.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = query.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/login")
def login_validation(user: schemas.User, db: Session = Depends(get_db)):
    print(user.user_name)
    db_user = query.get_user_by_username(db, user.user_name)
    hashed_pass =  user.password
    password_ckeck = 
    result = True
    return db_user
# # return user type as response

# #Admin API
# @app.get("/requests")
# # get all pending requests

# @app.delete("/unblock")
# # delete hash from https://www.tu-chemnitz.de/informatik/DVS/blocklist/

# @app.put("/block")
# # add file hash to the https://www.tu-chemnitz.de/informatik/DVS/blocklist/

# #User API
# @app.get("/checkHash")
# # check hash from https://www.tu-chemnitz.de/informatik/DVS/blocklist/

# @app.post("/uploadFile")
# # Add selected file to the database and return the corresponding url

# @app.get("/files/{user_id}")
# # Return all files belongs to this user

# @app.delete("/file/{file_id}")
# # delete a file for register user

# @app.get("/fileInfo")
# # return file information

# @app.get("/download")
# # download the actual file

# @app.post("/changeStatus")
# # user can send request to admin to block/unblock