import os
import hashlib

from pathlib import Path

salt = os.urandom(32)

def hash_passpord(password):
    plaintext = password.encode()
    d = hashlib.sha256(plaintext)
    hash = d.hexdigest()
    return hash

def hash_file(filepath):
    sha256_hash = hashlib.sha256()
    with open(filepath,"rb") as f:
        for byte_block in iter(lambda: f.read(4096),b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()
