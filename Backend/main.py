from fastapi import FastAPI

from utils import session

app = FastAPI()

session = session.get_session('https://www.tu-chemnitz.de/informatik/DVS/blocklist/')
@app.get("/")
async def root():
    staus = session.get("https://www.tu-chemnitz.de/informatik/DVS/blocklist/e3b0b44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
    print(staus.status_code)
    return {"message": staus.status_code}

    

@app.get("/status")
async def root():
    staus = session.get("https://www.tu-chemnitz.de/informatik/DVS/blocklist/w3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
    print(staus.status_code)
    return {"Status": staus.status_code}