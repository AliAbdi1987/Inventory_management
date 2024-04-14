import time
import jwt
import secrets
from decouple import config
JWT_SECRET_KEY = config('SECRET')
JWT_ALGORITHM = config('ALGORITHM')


# This function returns the generated tokens (JWTs)
def token_response(token: str):
    return {
        token
    }


# This function is used for signing the JWT string
def sign_jwt(owner_id: str):
    payload = {
        "userID": owner_id,
        "exp": time.time() + 3000
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token_response(token)


def decode_jwt(token: str):
    try:
        decode_token = jwt.decode(token, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return decode_token if decode_token["exp"] >= time.time() else None
    except:
        return {}
