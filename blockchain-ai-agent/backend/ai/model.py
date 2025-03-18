import requests

def fetch_price():
    url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    response = requests.get(url).json()
    return response['ethereum']['usd']

if __name__ == "__main__":
    print("Current ETH Price:", fetch_price())
