import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import os

from dotenv import load_dotenv
from pathlib import Path



def get_session():
  load_dotenv()
  options = Options()
  options.headless = True
  driver = webdriver.Chrome(options=options)

  url = "https://www.tu-chemnitz.de/informatik/DVS/blocklist/"
  driver.get(url)

  driver.find_element(By.ID, 'krbSubmit').click()
  driver.find_element(By.ID, 'username').send_keys(os.getenv('USERNAM'))
  driver.find_element(By.XPATH, "//input[@value='Go on']").submit()
  driver.find_element(By.ID, 'password').send_keys(os.getenv('PASSWORD'))
  driver.find_element(By.XPATH, "//input[@value='Login']").submit()
  print(driver.session_id)
  driver.get(url)
  time.sleep(10)
  headers = {
  "User-Agent":
  "Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0"
  }
  s = requests.session()
  s.headers.update(headers)

  for cookie in driver.get_cookies():
    c = {cookie['name']: cookie['value']}
    s.cookies.update(c)
  
  return s


