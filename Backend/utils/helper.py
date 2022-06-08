import requests

def get_ip():
    response = requests.get(url = "https://geolocation-db.com/json/")
    data = response.json()
    print(data["IPv4"])
    return data["IPv4"]

def get_blocking_status(hash):
    response = requests.get(url = "https://www.tu-chemnitz.de/informatik/DVS/blocklist/"+hash)
    return response.text
