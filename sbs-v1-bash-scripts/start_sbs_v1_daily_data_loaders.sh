#!/bin/bash

export PYO3_PYTHON=$HOME/projects/SBS_V1/sbs-v1-python-backend/venv/bin/python3.13
export RUSTFLAGS="-L$HOME/python-shared/lib -lpython3.13"
export PYTHONPATH=$HOME/projects/SBS_V1/sbs-v1-python-backend/venv/lib/python3.13:$HOME/projects/SBS_V1/sbs-v1-python-backend/venv/lib/python3.13/site-packages

SBS_V1_PYTHON_BACKEND_PATH=$HOME/projects/SBS_V1/sbs-v1-python-backend
SBS_V1_RUST_BACKEND_PATH=$HOME/projects/SBS_V1/sbs-v1-rust-backend

# activate virtual environment
source $SBS_V1_PYTHON_BACKEND_PATH/venv/bin/activate

# go to rust backend dir
cd $SBS_V1_RUST_BACKEND_PATH/rust_backend

# run daily data loaders
RUST_LOG=info cargo run --bin sbs_v1_daily_data_loaders
