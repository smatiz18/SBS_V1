#!/bin/bash

export SBS_V1_RUST_BACKEND_PATH=$HOME/projects/SBS_V1/sbs-v1-rust-backend

cd $SBS_V1_RUST_BACKEND_PATH/rust_backend

RUST_LOG=info cargo run --bin sbs_v1_rust_backend_api
