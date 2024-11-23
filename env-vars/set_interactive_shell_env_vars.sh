#!/bin/bash

# Paths to the encrypted and temporary files
ENCRYPTED_FILE="$HOME/projects/SBS_V1/env-vars/sbs_v1_env_vars.txt.enc"
TEMP_FILE="$HOME/projects/SBS_V1/env-vars/decrypted_sbs_v1_env_vars.txt"

# Ensure OpenSSL is installed
if ! command -v openssl &> /dev/null; then
    echo "Error: OpenSSL is not installed. Please install it to continue."
    exit 1
fi

# Prompt user for the decryption password
echo "Enter the password to decrypt the environment variables:"
read -s PASSWORD

# Attempt to decrypt the file
openssl enc -d -aes-256-cbc -pbkdf2 -md sha256 -in "$ENCRYPTED_FILE" -out "$TEMP_FILE" -pass pass:"$PASSWORD"

# Check if decryption succeeded
if [ $? -ne 0 ]; then
    echo "Error: Failed to decrypt the file. Check your password and try again."
    rm -f "$TEMP_FILE"  # Remove any partial file
    exit 1
fi

# Source the decrypted file to apply the variables to the current shell
if ! source "$TEMP_FILE"; then
    echo "Error: Decrypted file is not valid. It may not contain environment variables."
    rm -f "$TEMP_FILE"
    exit 1
fi

# Append the environment variables to ~/.bashrc to persist them
cat "$TEMP_FILE" >> ~/.bashrc

# Remove the temporary decrypted file
rm -f "$TEMP_FILE"

echo "Environment variables have been successfully set for ~/.bashrc ."

echo "Run source ~/.bashrc to apply new env variables to current shell."
