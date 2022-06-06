import datetime

from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    user_id: int
    fullname: str
    user_name: str
    password: str
    user_type: str

class FileInfo(BaseModel):
    file_id: int
    file: str
    file_name: str
    file_size: int
    file_type: str
    upload_date_time: datetime.datetime
    file_hash: str
    user_ip: Optional[str] = None
    status: str
    user_id: int

class RequestInfo(BaseModel):
    req_id: int
    reason: str
    file_id: int

class DownloadInfo(BaseModel):
    download_id: int
    user_ip: str
    last_download_time: datetime.datetime
    download_url: str
    user_id: Optional[int] = None