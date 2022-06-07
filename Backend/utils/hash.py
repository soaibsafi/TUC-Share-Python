import os
import hashlib

from pathlib import Path

salt = os.urandom(32)

def hash_passpord(password):
    plaintext = password.encode()
    print(plaintext)
    d = hashlib.sha256(plaintext)
    hash = d.hexdigest()
    return hash

def hash_file(filepath):
    sha256_hash = hashlib.sha256()
    with open(filepath,"rb") as f:
        for byte_block in iter(lambda: f.read(4096),b""):
            sha256_hash.update(byte_block)
        print(sha256_hash.hexdigest())


size = Path('d2.pdf').stat().st_size
print((round(size/1024)/100))