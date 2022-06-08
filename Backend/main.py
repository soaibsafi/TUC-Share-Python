from typing import List
import time
import os
import asyncio
import datetime
from unittest import result
import base64
from base64 import b64encode

from fastapi import Depends, FastAPI, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session


from database import query, model, schemas
from database.db_config import SessionLocal, engine
from utils import hash, helper

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



@app.get("/download", response_class=FileResponse)
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
    db_user = query.get_user_by_username(db, user.user_name)
    if db_user==None:
        raise HTTPException(status_code=404, detail="User Not Found")
    hashed_pass =  hash.hash_passpord(user.password)
    password_ckeck = db_user.password == hashed_pass
    if password_ckeck is False:
        raise HTTPException(status_code=404, detail="Password doesn't match")
    return db_user.user_type

@app.post("/uploadFile")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    print(file)
    filename = file.filename
    root_name, file_type = os.path.splitext(filename)
    upload_date_time = datetime.datetime.now()
    user_ip = helper.get_ip()
    try:
        contents = await file.read()
        file_size = len(contents)
        if file_size > 10485760:
            raise HTTPException(status_code=403, detail="Mam 10 MiB File Allowed")
        with open(file.filename, 'wb') as f:
            f.write(contents)
        
        file_hash = str(hash.hash_file(filename))
        print(file_hash)
        status = "Block"
    except Exception:
        return {"message": "There was an error uploading the file"}
    finally:
        await file.close()
    
    with open(filename, 'rb') as file_data:
        bytes_content = file_data.read()
    data = base64.b64encode(bytes_content).decode('utf-8')
   
    d2 = base64.b64decode(data) # file download er somoy lagbe
    #print(bytes_content)
    #print(bytes_content)
    return query.upload_file(db, data, root_name, file_size, file_type, upload_date_time, file_hash, user_ip, status ) 

@app.get("/fileType/{file_id}")
def get_file_type(file_id:int, db: Session = Depends(get_db)):
    db_file = query.get_file_type_by_file_id(db, file_id)
    return {"file_name":db_file.file_name, "file_type":db_file.file_type}
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