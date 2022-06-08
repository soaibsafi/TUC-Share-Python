import requests

def get_ip():
    response = requests.get(url = "https://geolocation-db.com/json/")
    data = response.json()
    print(data["IPv4"])
    return data["IPv4"]

def get_blocking_status(hash):
    response = requests.get(url = "https://www.tu-chemnitz.de/informatik/DVS/blocklist/"+hash)
    return response.text


def get_download_file(file_path):
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