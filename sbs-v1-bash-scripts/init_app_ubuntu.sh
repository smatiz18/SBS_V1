#!/bin/bash
# GLOBAL ENVIRONMENT VARIABLES MUST BE SET MANUALLY

cd $HOME

sudo apt-get update
sudo apt install pkg-config
sudo apt-get install build-essential libssl-dev libffi-dev zlib1g-dev
sudo apt install curl
sudo apt install wget
sudo apt-get install python3-venv

# download python
wget https://www.python.org/ftp/python/3.13.0/Python-3.13.0.tgz
tar -xzf Python-3.13.0.tgz
cd Python-3.13.0
./configure --enable-optimizations --enable-shared --prefix=$HOME/python-shared
make -j$(nproc) 
make install

cd $HOME

SBS_V1_UI_PATH=$HOME/projects/SBS_V1/sbs-v1-ui
export SBS_V1_PYTHON_BACKEND_PATH=$HOME/projects/SBS_V1/sbs-v1-python-backend
SBS_V1_JUPYTER_PATH=$HOME/projects/SBS_V1/sbs-v1-jupyter

# create virtual environments and install required libraries
# set linker to python-shared 
LD_LIBRARY_PATH=$HOME/python-shared/lib:$LD_LIBRARY_PATH
$HOME/python-shared/bin/python3 -m venv $SBS_V1_PYTHON_BACKEND_PATH/venv
$HOME/python-shared/bin/python3 -m venv $SBS_V1_JUPYTER_PATH/venv

source $SBS_V1_PYTHON_BACKEND_PATH/venv/bin/activate
pip install -r $SBS_V1_PYTHON_BACKEND_PATH/requirements.txt
deactivate

source $SBS_V1_JUPYTER_PATH/venv/bin/activate
pip install -r $SBS_V1_JUPYTER_PATH/requirements.txt
deactivate

# install rust
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh

# install node
sudo apt install -y nodejs
sudo apt install -y npm
cd $SBS_V1_UI_PATH 
npm install

cd $HOME
