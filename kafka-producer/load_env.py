import os
from dotenv import load_dotenv

load_dotenv()
def get_env_var(key , default_value):
    value = os.getenv(key)
    if not value:
        if default_value:
            return default_value
        else:
            raise ValueError(f'Missing environment variable {key}')
    else:
        return value
