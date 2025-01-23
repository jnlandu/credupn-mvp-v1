import requests
import json

# Data to be sent
data = {
    "merchant": "BUKINEURS",
    "type": "1",
    "phone": "243850817627",
    "reference": "MM40159",
    "amount": "1000",
    "currency": "CDF",
    "callbackUrl": "http://abcd.efgh.cd/callback"
}

# URL of the gateway
gateway = "http://backend.flexpay.cd/api/rest/v1/paymentService"

# Headers
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJcL2xvZ2luIiwicm9sZXMiOlsiTUVSQ0hBTlQiXSwiZXhwIjoxNzc5OTcwMTc1LCJzdWIiOiJlNzFiM2I4ZDMyNGFmYTMwOWU0NzY4MGI1ZjE0NDhhNCJ9.cLawA7kXCwBNYADRdwy9BJKwxQJOjUf0nTQ1i2Wipnw",
}

try:
    # Sending POST request
    response = requests.post(gateway, data=json.dumps(data), headers=headers, timeout=300)
    print("Response debugging: ", response)
    print("Response: ", response.text)
    
    if response.status_code == 200:
        json_res = response.json()
        code = json_res.get("code", "")
        print("Code details: ", code)
        if code != "0":
            error_message = "Impossible de traiter la demande, veuillez réessayer"
            print(error_message)
        else:
            message = json_res.get("message", "")
            print("Code details with success demand: ", message)
            order_number = json_res.get("orderNumber", "")
            print(f"Message: {message}, Order Number: {order_number}")
    else:
        print("Une erreur lors du traitement de votre requête")

except requests.exceptions.RequestException as e:
    print(f"Erreur: {str(e)}")
