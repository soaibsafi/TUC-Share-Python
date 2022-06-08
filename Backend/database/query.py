from sqlalchemy.orm import Session

from . import model, schemas
from utils import hash


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
    return db.query(model.User).filter(model.FileInfo.file_id == file_id).first()

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
            user_id=user_id
            ) 
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file



# async def upload_file(file: UploadFile = File(...)):
#     filepath = file.filename
#     filename, filetype = os.path.splitext(filepath)
#     print(filename)
#     print(filetype)
#     upload_date_time = datetime.datetime.now()
#     user_ip = helper.get_ip()
#     f = await file.read()
#     filesize = len(f)
#     if filesize > 83886080:
#         raise HTTPException(status_code=403, detail="Mam 10 MiB File Allowed")
#     try:   
#         file = await file.read() 
#         with open(file.filepath, 'wb') as f:
#             f.write(file)
#     except Exception:
#         return {"message": "There was an error uploading the file"}
#     # finally:
#     #     await file.close()
#     file_hash = hash.hash_file(filepath)
#     status = "Block"

#     return query.upload_file(file, filename, filesize, filetype, upload_date_time, file_hash, user_ip, status ) 
