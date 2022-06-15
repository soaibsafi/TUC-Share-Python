from ast import Bytes
from sqlalchemy import Column, ForeignKey, Integer, LargeBinary, String, DateTime, BLOB
from sqlalchemy.orm import relationship

from .db_config import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String)
    user_name = Column(String, unique=True)
    password = Column(String)
    user_type = Column(String)

    files = relationship("FileInfo", back_populates="owner")

class FileInfo(Base):
    __tablename__ = "file_info"

    file_id = Column(Integer, primary_key=True, index=True)
    file = Column(String)
    file_name = Column(String)
    file_size = Column(Integer)
    file_type = Column(String)
    upload_date_time = Column(DateTime)
    file_hash = Column(String)
    user_ip = Column(String)
    status = Column(String)
    user_id = Column(Integer, ForeignKey("users.user_id"))

    owner = relationship("User", back_populates="files")
    request_file = relationship("RequestInfo", back_populates="file")


class RequestInfo(Base):
    __tablename__ = "request_info"

    req_id = Column(Integer, primary_key=True, index=True)
    reason = Column(String)
    type = Column(String)
    file_id = Column(Integer, ForeignKey("file_info.file_id"))

    file = relationship("FileInfo", back_populates="request_file")



class DownloadInfo(Base):
    __tablename__ = "download_info"

    download_id = Column(Integer, primary_key=True, index=True)
    user_ip = Column(String)
    last_download_time = Column(DateTime)
    download_url = Column(String)
    user_id = Column(Integer, ForeignKey("users.user_id"))