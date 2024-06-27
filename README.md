# Climate Companion

## Setup
1. Install the dependencies:
```bash
npm install / i
```

2. MySQL :
```bash
# remove current mysql
brew remove mysql
brew cleanup

# install mysql
brew install mysql

# start mysql server
brew services start mysql

# verify mysql installation
mysql -u root -p
```

3. Database:
~~~~sql
-- create database
CREATE DATABASE climate_companion;

-- switch to database
USE climate_companion;

-- create table
CREATE TABLE locations (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL);
~~~~

4. Python:
```bash
# install python
brew install python

# install python dependencies
pip3 install Flask flask_mysqldb

# run python (inside project root)
# ~/climate-companion
python3 app.py
```

5. Adjust authentication:
```bash
# inside ~/assets/ts/auth/auth.ts
# credentials for meteomatics api
const username = 'USERNAME';
const password = 'PASSWORD';

# inside ~/assets/ts/api/opencagedata.ts
# api key from opencage
const apiKey = 'API_KEY';
```
Weather: [Meteomatics API](https://www.meteomatics.com/en/sign-up-weather-api-test-account/#contact)

Geolocation: [Opencage API](https://opencagedata.com/users/sign_up)


6. Start the development server on `http://localhost:3000`
```bash
# start the development server
npm run dev
```