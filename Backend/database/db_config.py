from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./database/tuc_share.db"
#SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://TUCShare_DB_rw:geeChui5va@mysql.hrz.tu-chemnitz.de/TUCShare_DB"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    #SQLALCHEMY_DATABASE_URL,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
