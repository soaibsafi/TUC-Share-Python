import requests
from selenium import webdriver
from selenium.webdriver.common.by import By

from selenium.webdriver.support.ui import Select # for <SELECT> HTML form
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from webdriver_manager.firefox import GeckoDriverManager
import time
# from anticaptchaofficial.recaptchav2proxyless import *

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import os

from dotenv import load_dotenv
from pathlib import Path



load_dotenv()


options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)
# driver = webdriver.Chrome()


# On Windows, use: webdriver.PhantomJS('C:\phantomjs-1.9.7-windows\phantomjs.exe')

# Service selection
# Here I had to select my school among others


# print(os.getenv('USERNAME'))

url = "https://www.tu-chemnitz.de/informatik/DVS/blocklist/"
driver.get(url)

# driver.find_element_by_id('krbSubmit').click()
driver.find_element(By.ID, 'krbSubmit').click()
driver.find_element(By.ID, 'username').send_keys(os.getenv('USERNAME'))
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
print(s)
s.headers.update(headers)

for cookie in driver.get_cookies():
  c = {cookie['name']: cookie['value']}
  s.cookies.update(c)

status = s.get("https://www.tu-chemnitz.de/informatik/DVS/blocklist/119a182f53b991b8ab6fd447581dd22a5a1c94bd72e1a940c8dd457a59088f84")
print("GET -> ", status.status_code)
status = s.put("https://www.tu-chemnitz.de/informatik/DVS/blocklist/bb28e8bbbfed9d383765faf78c8f29ce2e4ac49177b02b9b3ecb94a26e7feed5")
print("PUT -> ", status.status_code)
status = s.get("https://www.tu-chemnitz.de/informatik/DVS/blocklist/bb28e8bbbfed9d383765faf78c8f29ce2e4ac49177b02b9b3ecb94a26e7feed5")
print("GET -> ", status.status_code)
status = s.delete("https://www.tu-chemnitz.de/informatik/DVS/blocklist/bb28e8bbbfed9d383765faf78c8f29ce2e4ac49177b02b9b3ecb94a26e7feed5")
print("DELETE -> ", status.status_code)
status = s.get("https://www.tu-chemnitz.de/informatik/DVS/blocklist/bb28e8bbbfed9d383765faf78c8f29ce2e4ac49177b02b9b3ecb94a26e7feed5")
print("GET after DELETE -> ", status.status_code)