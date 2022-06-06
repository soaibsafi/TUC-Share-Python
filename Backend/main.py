from fastapi import FastAPI

from utils import session

app = FastAPI()

session = session.get_session('https://www.tu-chemnitz.de/informatik/DVS/blocklist/')
@app.get("/")
async def root():
    staus = session.get("https://www.tu-chemnitz.de/informatik/DVS/blocklist/bb48e8bbbfed9d383765faf78c8f29ce2e4ac49177b02b9b3ecb94a26e7feed5")
    print(staus.status_code)
    return {"message": staus.status_code}

    

@app.get("/status")
async def root():
    staus = session.put("https://www.tu-chemnitz.de/informatik/DVS/blocklist/bb48e8bbbfed9d383765faf78c8f29ce2e4ac49177b02b9b3ecb94a26e7feed5")
    print(staus.status_code)
    return {"Status": staus.status_code}