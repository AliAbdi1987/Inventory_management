from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .jwt_handler import decode_jwt


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == 'Bearer':
                raise HTTPException(status_code=403, detail='Invalid or Expired token')
            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail='Invalid or Expired token')

    def varify_jwt(self, jwt_token: str):
        is_token_valid: bool = False  # A false flag
        payload = decode_jwt(jwt_token)
        if payload:
            is_token_valid = True
        return is_token_valid
