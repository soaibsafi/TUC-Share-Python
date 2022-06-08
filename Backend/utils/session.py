import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.firefox import GeckoDriverManager



def get_session(url):
  driver = webdriver.Chrome()
  # Here I had to select my school among others
  url = "https://www.tu-chemnitz.de/informatik/DVS/blocklist/"
  driver.get(url)
  time.sleep(25)

  headers = {
  "User-Agent":"Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0"
  }
  session = requests.session()
  session.headers.update(headers)

  for cookie in driver.get_cookies():
    c = {cookie['name']: cookie['value']}
    session.cookies.update(c)
  return session