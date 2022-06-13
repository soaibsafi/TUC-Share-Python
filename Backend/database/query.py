from operator import and_
from sqlalchemy.orm import Session
from sqlalchemy import delete
from database.db_config import engine

from . import model, schemas
from utils import hash
import base64
import datetime


def create_user(db: Session, user: schemas.User):
    hashed_password = hash.hash_passpord(user.password)
    db_user = model.User(fullname=user.fullname, user_name=user.user_name, password=hashed_password , user_type=user.user_type )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user(db: Session, user_id: int):
    return db.query(model.User).filter(model.User.user_id == user_id).first()

def get_user_by_username(db: Session, useranme: str):
    return db.query(model.User).filter(model.User.user_name == useranme).first()

def get_file_type_by_file_id(db: Session, file_id: int):
    return db.query(model.FileInfo).filter(model.FileInfo.file_id == file_id).first()

def upload_file(db: Session, file, file_name, file_size, file_type, upload_date_time, file_hash, user_ip, status, user_id=None):
    db_file = model.FileInfo(
            file=file,
            file_name=file_name,
            file_size=file_size,
            file_type=file_type,
            upload_date_time=upload_date_time,
            file_hash=file_hash,
            user_ip=user_ip,
            status=status,
            user_id = user_id
            )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file


def get_file_info(db: Session, file_hash: str):
    return db.query(
        model.FileInfo.file_name,
        model.FileInfo.file_type,
        model.FileInfo.file_size,
        model.FileInfo.file_type,
        model.FileInfo.upload_date_time,
        model.FileInfo.status,
        model.FileInfo.file_id,
        model.FileInfo.user_ip,
        model.FileInfo.user_id
        ).filter(model.FileInfo.file_hash == file_hash).first()

def delete_file_by_file_id(file_id: int, db: Session):
    file = db.query(model.FileInfo).filter(model.FileInfo.file_id == file_id).first()
    if file==None:
        return False
    db.delete(file)
    db.commit()
    #db.refresh(file)
    return True

def add_request_info(reqInfo: schemas.RequestInfo, db: Session):
    db_req = model.RequestInfo(
        reason = reqInfo.reason,
        file_id = reqInfo.file_id
    )
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return db_req

def delete_request_by_id(req_id: int, db: Session):
    req = db.query(model.RequestInfo).filter(model.RequestInfo.req_id == req_id).first()
    if req==None:
        return False
    db.delete(req)
    db.commit()
    return True

def get_all_pending_request(db: Session):
    data = db.query(
        model.FileInfo.file_name,
        model.FileInfo.file_type,
        model.FileInfo.file_size,
        model.FileInfo.upload_date_time,
        model.FileInfo.file_hash,
        model.RequestInfo.reason,
        model.RequestInfo.req_id
        ).filter(model.RequestInfo.file_id == model.FileInfo.file_id).all()
    #t = db.query(model.RequestInfo).all()
    print(data)
    return data


def get_all_files_of_a_user(user_id:int, db: Session):
    return db.query(
        model.FileInfo.file_id,
        model.FileInfo.file_name,
        model.FileInfo.file_type,
        model.FileInfo.file_size,
        model.FileInfo.file_type,
        model.FileInfo.upload_date_time,
        model.FileInfo.status,
        model.FileInfo.user_ip,
        model.FileInfo.user_id,
        model.FileInfo.file_hash
        ).filter(model.FileInfo.user_id == user_id).all()


def write_single_file(file_hash:str, db: Session):
    f = db.query(model.FileInfo).filter(model.FileInfo.file_hash == file_hash).first()
    file_contents = base64.b64decode(f.file)
    filepath = 'cache/'+f.file_name+f.file_type
    try:
        with open(filepath, 'wb') as fl:
            fl.write(file_contents)
    except Exception:
        return {"message": "There was an error downloading the file"}
    finally:
        fl.close()
    return filepath

def create_download_info(
        user_ip,
        download_date_time,
        file_hash,
        user_id,
        db: Session):
    db_download = model.DownloadInfo(
        user_ip = user_ip,
        last_download_time = download_date_time,
        download_url = file_hash,
        user_id = user_id
    )
    db.add(db_download)
    db.commit()
    db.refresh(db_download)
    return db_download

def download_availablity(file_hash, user_ip, db: Session):
    dn_info  = db.query(model.DownloadInfo).filter(
        and_(model.DownloadInfo.download_url == file_hash,
        model.DownloadInfo.user_ip == user_ip)).order_by(
        model.DownloadInfo.download_id.desc()).first()
    #dn_info = descending.first()
    #print(dn_info.last_download_time)
    return dn_info


def delete_file_scheduled(db: Session):
    current_time = datetime.datetime.now()
    print(current_time)
    schedule_time = current_time - datetime.timedelta(days = 14)
    print(schedule_time)
    files = db.query(model.FileInfo).filter(model.FileInfo.upload_date_time < schedule_time).all()
    if files==None:
        return False
    for file in files :
        db.delete(file)
    db.commit()
    return True
