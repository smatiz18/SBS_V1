#!/bin/bash

export SBS_V1_PYTHON_BACKEND_PATH=$HOME/projects/SBS_V1/sbs-v1-python-backend

cd $SBS_V1_PYTHON_BACKEND_PATH

# activate virtual environmnt
source venv/bin/activate

# run backend api
python3 run.py
