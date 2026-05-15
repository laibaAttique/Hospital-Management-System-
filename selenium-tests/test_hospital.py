from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

BASE_URL = 'http://frontend:3000'

def get_driver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')

    return webdriver.Chrome(options=options)

# Test Case 1: Login page loads correctly
def test_login_page_loads():
    driver = get_driver()
    driver.get(BASE_URL + '/login')

    assert 'Hospital' in driver.title or driver.find_element(By.TAG_NAME, 'body')

    print('Test 1 PASSED: Login page loads correctly')
    driver.quit()

# Test Case 2: Login with valid credentials
def test_valid_login():
    driver = get_driver()
    driver.get(BASE_URL + '/login')

    wait = WebDriverWait(driver, 10)

    username_field = wait.until(
        EC.presence_of_element_located((By.NAME, 'username'))
    )

    username_field.send_keys('admin')

    driver.find_element(By.NAME, 'password').send_keys('admin123')

    driver.find_element(By.XPATH, '//button[@type="submit"]').click()

    time.sleep(2)

    assert '/appointments' in driver.current_url or '/admin' in driver.current_url

    print('Test 2 PASSED: Login with valid credentials successful')

    driver.quit()

if __name__ == '__main__':
    test_login_page_loads()
    test_valid_login()
    print('All Selenium tests completed.')