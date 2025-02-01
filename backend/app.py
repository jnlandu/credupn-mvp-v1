from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn
import requests
import json

# Initialize FastAPI app
app = FastAPI()

origins = [
    # "https://mlops-project-3repcia0n-jeremies-projects-257f201c.vercel.app", 
    # "https://mlops-project-taupe.vercel.app/",# for production
    "http://localhost:3000", # for local development
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"]
)


# Define payment request model
class PaymentRequest(BaseModel):
    Numero: str
    Montant: float
    currency: Optional[str] = "CDF"
    description: Optional[str] = None

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Payment API is running"}

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
    headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJcL2xvZ2luIiwicm9sZXMiOlsiTUVSQ0hBTlQiXSwiZXhwIjoxNzc5OTcwMTc1LCJzdWIiOiJlNzFiM2I4ZDMyNGFmYTMwOWU0NzY4MGI1ZjE0NDhhNCJ9.cLawA7kXCwBNYADRdwy9BJKwxQJOjUf0nTQ1i2Wipnw",
}
    
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
            # print("Debugg order Number 2", order_number)

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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)