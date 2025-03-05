# Use Rust official image for building
FROM rust:latest AS builder

# Set the working directory inside the container
WORKDIR /app

# Install dependencies required for building with OpenSSL
RUN apt-get update && apt-get install -y pkg-config libssl-dev

# Copy only Cargo files first to optimize Docker caching
COPY rust_backend/Cargo.toml rust_backend/Cargo.lock rust_backend/

# Copy the entire Rust source code after the dependencies
COPY rust_backend/src/ rust_backend/src/

# Set working directory to project
WORKDIR /app/rust_backend

# Build the Rust project (forces static linking for OpenSSL)
RUN cargo build --release

# Use Ubuntu 22.04 (which includes OpenSSL 3.x) as the runtime image
FROM ubuntu:22.04

# Install OpenSSL 3.x and CA certificates
RUN apt-get update && apt-get install -y libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy the Rust binary from the builder stage
COPY --from=builder /app/rust_backend/target/release/sbs_v1_rust_backend_api .

# Expose API port
EXPOSE 8000

# Run the Rust application
CMD ["./sbs_v1_rust_backend_api"]
