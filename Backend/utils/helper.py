import requests
import os
import glob

def get_ip():
    response = requests.get(url = "https://geolocation-db.com/json/")
    data = response.json()
    print(data["IPv4"])
    return data["IPv4"]

def get_blocking_status(hash):
    response = requests.get(url = "https://www.tu-chemnitz.de/informatik/DVS/blocklist/"+hash)
    return response.text


def get_guest_download_file(file_path):
    f = open(file_path, mode="rb")
    while True:
        data = f.read(64)
        if not data:
            break
        yield data

    # with open(file_path, mode="rb") as file_like:
    #     #TODO get file size -> divide into chunk -> for loop every chunk
    #     for file in file_like:
    #         for i in range(52):
    #             time.sleep(0.001)
    #             yield from file_like


def clear_cache():
    cache_dir = "./cache/"
    filelist = glob.glob(os.path.join(cache_dir, "*"))
    print(filelist)
    for f in filelist:
        os.remove(f)

def file_status(code):
    if code == 200:
        return "Unblocked"
    elif code == 210:
        return "Block"
    elif code == 204:
        return "Removed"
    elif code == 201:
        return "Created"
    else:
        return "Null"

def days_hours_minutes(td):
    return td.days, td.seconds//3600, (td.seconds//60)%60