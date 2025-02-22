
import os
import uvicorn
import requests
import json

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from starlette.responses import JSONResponse
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr, BaseModel
from typing import List

from twilio.rest import Client
from pydantic import BaseModel

from dotenv import load_dotenv

load_dotenv()

#  Test the environment variables
print("Debugging mail username", os.environ.get("MAIL_USERNAME"))

# Initialize FastAPI app
app = FastAPI()

origins = [
    # "https://mlops-project-3repcia0n-jeremies-projects-257f201c.vercel.app", 
    # "https://mlops-project-taupe.vercel.app/",# for production
    'https://cridupn.vercel.app',
    'https://cridupn-git-main-jeremies-projects-257f201c.vercel.app',
    'https://cridupn-ciloc3p51-jeremies-projects-257f201c.vercel.app',
    "http://localhost:3000", # for local development
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"]
)

class EmailSchema(BaseModel):
    email: List[EmailStr]
    subject: str
    body: str

# Define payment request model
class PaymentRequest(BaseModel):
    Numero: str
    Montant: float
    currency: Optional[str] = "CDF"
    description: Optional[str] = None

class SMSNotification(BaseModel):
    phone: str
    message: str

print("Debugging mail username", os.environ.get("MAIL_USERNAME"))
conf = ConnectionConfig(
    MAIL_USERNAME = "jnlandu00",
    MAIL_PASSWORD = "nsvnyjrslzmikfvd",
    MAIL_FROM = "jnlandu00@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="CRIDUPN",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = False  # Disable SSL certificate verification
)
# Root endpoint
@app.get("/")
async def root():
    return {"message": "Payment API is running"}



headers = {
"Content-Type": "application/json",
"Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJcL2xvZ2luIiwicm9sZXMiOlsiTUVSQ0hBTlQiXSwiZXhwIjoxNzc5OTcwMTc1LCJzdWIiOiJlNzFiM2I4ZDMyNGFmYTMwOWU0NzY4MGI1ZjE0NDhhNCJ9.cLawA7kXCwBNYADRdwy9BJKwxQJOjUf0nTQ1i2Wipnw",
}
# Payment endpoint
@app.post("/payment")
async def process_payment(payment: PaymentRequest):

    print("Processus de payement")

    data = {
        "merchant": "BUKINEURS",
        "type": "1",
        "phone": payment.Numero,
        "reference": "MM40159",
        "amount": payment.Montant,
        "currency": payment.currency,
        "callbackUrl": "http://abcd.efgh.cd/callback"
    }

    print("Debugging data Num", data)
    # print("Debugging data curr", data)
    gateway = "http://backend.flexpay.cd/api/rest/v1/paymentService"

    
    try:
        response = requests.post(gateway, data=json.dumps(data), headers=headers, timeout=300)
        print("Response debugging: ", response)
        print("Response text: ", response.text)
        json_res = response.json()
        print("Debugging order Number X :", json_res)
        print("Debugging order Number XX:", json_res.get("orderNumber", ""))

        if response.status_code == 200:
            json_res = response.json()
            code = json_res.get("code", "")
            print("Code details: ", code)

            if code != "0":
                error_message = "Impossible de traiter la demande, veuillez réessayer"
                # print("Debugg order Number 1", order_number)
                print(error_message)

            else:
                print("Debugg order Number 5 code 1")
                # print("Debugg order Number 4", order_number)
                message = json_res.get("message", "")
                print("Code details with success demand: ", message)
                order_number = json_res.get("orderNumber", "")
                print("Debugg order Number", order_number)
                return {"orderNumber": order_number, "message": message}
               
        else:
         print("Une erreur lors du traitement de votre requête")
         raise HTTPException(status_code=response.status_code, detail="Une erreur lors du traitement de votre requête")
    

    except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


print("start transaction")
print("Processus de payement")
         
@app.get("/check-payment/{orderNumber}")
async def check_payment_status(orderNumber: str) :
    try:
        gateway = f"https://backend.flexpay.cd/api/rest/v1/check/{orderNumber}"
        response = requests.get(
            gateway, 
            headers=headers, 
            timeout=300
        )
        # Log response for debugging
        print(f"FlexPay Response: {response.status_code}", response.text)
        
        response.raise_for_status()  # Raise exception for bad status codes
        
        json_res = response.json()
        transaction = json_res.get("transaction", {})
        verification = transaction.get("status", "")  # Default to pending
        print("Debugging transaction status:", verification)
        print("Debugging transaction:", transaction)
        print("Debugging transaction message:", json_res.get("message", ""))
        return {
            "verification": verification,
            "message": json_res.get("message", ""),
            "transaction": transaction
        }
        
    except requests.RequestException as e:
        print(f"FlexPay Error: {str(e)}")  # Log error
        raise HTTPException(
            status_code=500,
            detail=f"Error checking payment status: {str(e)}"
        )
    except Exception as e:
        print(f"Unexpected Error: {str(e)}")  # Log error
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )
    

@app.post("/email")
async def simple_send(email: EmailSchema) -> JSONResponse:
    # html = """<p>Hi this test mail, thanks for using Fastapi-mail</p> """
    message = MessageSchema(
        subject=email.dict().get("subject"),
        recipients=email.dict().get("email"),
        body=email.dict().get("body"),
        subtype=MessageType.html)

    fm = FastMail(conf)
    await fm.send_message(message)
    return JSONResponse(status_code=200,content={"message": "email has been sent"})




# Initialize Twilio client
account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token =  os.environ.get('TWILIO_AUTH_TOKEN')
twilio_phone = os.environ.get('TWILIO_PHONE_NUMBER')
client = Client(account_sid, auth_token)

@app.post("/sms")
async def send_sms(sms: SMSNotification):
    try:
        message = client.messages.create(
            body=sms.message,
            from_=twilio_phone,
            to=sms.phone
        )
        return {"success": True, "message_sid": message.sid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)