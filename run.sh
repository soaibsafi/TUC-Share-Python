#!/bin/sh

cd Backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
echo -e "USERNAM=\nPASSWORD=" >> .env
uvicorn main:app --reload