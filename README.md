# TUC Share

## Backend

1. Go to *Backend* directory-
```
cd Backend
```

2. Create Virtual environment-
```
python -m venv .venv
```
2. Activate the virtual environment- 

- (For Windows)-  `.\.venv\Scripts\activate`
- (For macOS/Linux)- `source .venv/bin/activate`

3. Install the required package-

```
pip install -r requirements.txt
```

4. Create a `.env` file which contain the *USERNAME* and *PASSWORD* of TU Chemnitz. Put the following line inside the `.env` file- 

```
USERNAM=<TUC USERANME>
PASSWORD=<TUC PASSWORD>
```

5. Download the [Chrome Driver](https://chromedriver.storage.googleapis.com/index.html?path=104.0.5112.20/), extract the zip and put the *chromedriver.exe* in the Backent root directory

6. Strat the *Backend* using- 
```
uvicorn main:app --reload
```

7. The *Backend* will be running on- 
- *http://127.0.0.1:8000/*

8. The API documentation could be found at- 
- *http://127.0.0.1:8000/docs*

---
## Frontend

1. Go to *Frontend*  directory-
```
cd Frontend
```
2. Install the required package-

```
yarn install
```
3. Strat the *Frontend* using- 
```
yarn start
```

4. Create a `.env` file and put the following line inside the `.env` file- 

```
SKIP_PREFLIGHT_CHECK=true
```
4. The *Frontend* will be running on- 
- *http://127.0.0.1:3000/*

