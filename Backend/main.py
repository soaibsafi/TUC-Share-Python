from typing import List
import time
import os
import asyncio
import datetime

import aiofiles
import base64
from base64 import b64encode

from fastapi import Depends, FastAPI, HTTPException, File, UploadFile, Response, Body
from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Dict

from fastapi.middleware.cors import CORSMiddleware

from database import query, model, schemas
from database.db_config import SessionLocal, engine
from utils import hash, helper, session

model.Base.metadata.create_all(bind=engine)
file_path = "./database/a.pdf"
app = FastAPI()

tuc_session = session.get_session()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/", response_model=schemas.User)
async def create_user(user: schemas.User, db: Session = Depends(get_db)):
    print(user)
    return query.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = query.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/login")
def login_validation(user: Dict[str, str], db: Session = Depends(get_db)):
    username = user["username"]
    password = user["password"]
    print(user)
    db_user = query.get_user_by_username(db, username)
    if db_user==None:
        raise HTTPException(status_code=404, detail="User Not Found")
    hashed_pass = hash.hash_passpord(password)
    password_ckeck = db_user.password == hashed_pass
    if password_ckeck is False:
        raise HTTPException(status_code=404, detail="Password doesn't match")
    return db_user

@app.post("/uploadFile")
async def upload_file(file: UploadFile = File(...), db : Session = Depends(get_db)):
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
        with open("cache/"+file.filename, 'wb') as f:
            f.write(contents)

        file_hash = str(hash.hash_file(filename))
        print(file_hash)
        url = "https://www.tu-chemnitz.de/informatik/DVS/blocklist/"+file_hash
        s = tuc_session.get(url)
        status = s.status_code
    except Exception:
        return {"filehash": "58140fb61e19df0f71ad6ac47617f1b931f5c69de4eb561020c9d2cdcfb5527e"} # TODO : remove this hash id
    finally:
        await file.close()

    with open(filename, 'rb') as file_data:
        bytes_content = file_data.read()
    data = base64.b64encode(bytes_content).decode('utf-8')

    #d2 = base64.b64decode(data) # file download er somoy lagbe
    return query.upload_file(
        db,
        data,
        root_name,
        file_size,
        file_type,
        upload_date_time,
        file_hash,
        user_ip,
        status )

@app.get("/fileType/{file_id}")
def get_file_type(file_id:int, db: Session = Depends(get_db)):
    db_file = query.get_file_type_by_file_id(db, file_id)
    return {"file_name":db_file.file_name, "file_type":db_file.file_type}

@app.post("/request")
def get_pending_requests(reqInfo: schemas.RequestInfo, db: Session = Depends(get_db)):
    return query.add_request_info(reqInfo, db)

@app.get("/requests")
def get_pending_requests(db: Session = Depends(get_db)):
    return query.get_all_pending_request(db)

@app.delete("/request")
def delete_request(request_id: int, db: Session = Depends(get_db)):
    return query.delete_request_by_id(request_id, db)


@app.delete("/unblock")
def unblock_file(file_hash: str):
    url = "https://www.tu-chemnitz.de/informatik/DVS/blocklist/"+file_hash
    sts = tuc_session.delete(url)
    code = sts.status_code
    status = {
        'code': code,
        'fstatus': helper.file_status(code)
    }
    return status

@app.put("/block")
def block_file(file_hash: str):
    url = "https://www.tu-chemnitz.de/informatik/DVS/blocklist/"+file_hash
    sts = tuc_session.put(url)
    code = sts.status_code
    status = {
        'code': code,
        'fstatus': helper.file_status(code)
    }
    return status

@app.get("/checkStatus")
def check_file_status(file_hash: str):
    url = "https://www.tu-chemnitz.de/informatik/DVS/blocklist/"+file_hash
    sts = tuc_session.get(url)
    code = sts.status_code
    status = {
        'code': code,
        'fstatus': helper.file_status(code)
    }
    return status

@app.delete("/file/{file_id}")
def delete_file(file_id:int, db: Session = Depends(get_db)):
    result =  query.delete_file_by_file_id(file_id, db)
    if not result:
        raise HTTPException(status_code=404, detail="File not found")
    return {"detail":"Successfully Deleted"}

@app.get("/fileInfo/")
def get_file_info(file_hash:str, db: Session = Depends(get_db)):
    db_file = query.get_file_info(db, file_hash=file_hash)
    if db_file is None:
        raise HTTPException(status_code=404, detail="File not found")
    return db_file

@app.get("/files/{user_id}")
def get_files_of_single_user(user_id:int, db: Session = Depends(get_db)):
    return (query.get_all_files_of_a_user(user_id, db), {"status":"SUCESS"})

@app.get("/download/{file_url}/{file_name}", response_class=FileResponse)
async def download_as_user(file_url: str, db: Session = Depends(get_db)):
    filepath =  query.write_single_file(file_url, db)
    return filepath


@app.get("/clearCache")
def clear_cache():
    helper.clear_cache()
    return {"Cache clear successful"}

@app.get("/guestDownload/{file_url}/{file_name}", response_class=FileResponse)
async def download_as_guest(file_url: str , db: Session = Depends(get_db)):
    file_path = query.write_single_file(file_url, db)
    return StreamingResponse(helper.get_guest_download_file(file_path))

