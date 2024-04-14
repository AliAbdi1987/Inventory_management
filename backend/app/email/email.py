from sqlalchemy.orm import Session
from sqlalchemy import select, update, delete, insert
from app.database.models import Owner
from datetime import timedelta
from dotenv import load_dotenv
import os
import datetime
from jose import jwt, JWTError
import time
import jwt
# import requests
# import json
import smtplib


SECRET_KEY = os.getenv("SECRET")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
EMAIL_RESET_TOKEN_EXPIRE_HOURS = os.getenv("EMAIL_RESET_TOKEN_EXPIRE_HOURS")
POSTMARK_TOKEN = os.getenv("POSTMARK_TOKEN")
MY_EMAIL = os.getenv("MY_EMAIL")
MY_PASSWORD = os.getenv("PASSWORD")


def generate_password_reset_token(email: str) -> str:
    delta = timedelta(hours=int(EMAIL_RESET_TOKEN_EXPIRE_HOURS))
    now = datetime.datetime.now(datetime.UTC)
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email},
        SECRET_KEY,
        algorithm="HS256",
    )
    return encoded_jwt


def token_response(token: str):
    return {
        token
    }


def sign_jwt_reset_password(email: str):
    payload = {
        "userEMAIL": email,
        "exp": time.time() + 9999
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token_response(token)


def decode_jwt_reset_password(token: str) -> str | None:
    try:
        decode_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if decode_token["exp"] >= time.time():
            return str(decode_token.get("userEMAIL"))
        else:
            return None
    except:
        return None


def get_owner_by_email(*, session: Session, email: str) -> Owner | None:
    statement = select(Owner).where(Owner.email == email)
    session_owner = session.execute(statement).scalars().first()
    return session_owner


def send_password_reset_email(email: str, token: str):
    # Should come from a .env-variable
    reset_url = f"http://localhost:5173/resetpassword?token={token}"
    message = {
        "HtmlBody": f'<strong>You have requested to reset your password.</strong> Please click on the link to reset your password: <a href="{reset_url}">Reset Password</a>',
    }

    # headers = {
    #     "Accept": "application/json",
    #     "Content-Type": "application/json",
    #     "X-Postmark-Server-Token": f"{POSTMARK_TOKEN}"
    # }
    #
    # try:
    #     response = requests.post(
    #         "https://api.postmarkapp.com/email", headers=headers, data=json.dumps(message))
    #     response.raise_for_status()  # This will raise an exception for HTTP error responses
    #     print(f"Email sent to {email}: {response.status_code}")
    #     # Optionally print response JSON data
    #     print(response.json())
    # except requests.exceptions.HTTPError as e:
    #     # This catches HTTP errors and prints the response JSON if available
    #     print(f"Failed to send email to {email}, HTTP error: {e}")
    #     try:
    #         print(e.response.json())
    #     except ValueError:  # Includes simplejson.decoder.JSONDecodeError
    #         print("Error response content is not JSON")
    # except Exception as e:
    #     # This catches other errors, such as connection errors
    #     print(f"Failed to send email to {email}: {e}")

    with smtplib.SMTP("smtp.gmail.com", 587) as connection:
        connection.starttls()
        connection.login(user=MY_EMAIL, password=MY_PASSWORD)
        connection.sendmail(
            from_addr=MY_EMAIL,
            to_addrs=email,
            msg=f"Subject: Reset Password Inventrix for {email}\n\n{message}"
        )


def verify_password_reset_token(token: str) -> str | None:
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return str(decoded_token["sub"])
    except JWTError:
        return None
