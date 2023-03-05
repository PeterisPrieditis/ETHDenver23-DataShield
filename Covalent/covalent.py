import requests 
import pandas as pd
import json

df = pd.read_csv("trades_filtered.csv")
results = []
for sender in df["sender"].value_counts().index:
  print(sender)
  url = f"https://api.covalenthq.com/v1/eth-mainnet/address/0x{sender}/balances_v2/?&key=ckey_30f184d78ef5a4sd286a0cdb8ee9"
  r = requests.get(url,
    headers={
        "Accept": "*/*",
        "Accept-Encoding": "gzip",
        "Accept-Language": "en-GB,en;q=0.9",
        "Connection": "keep-alive",
        "Host": "api.covalenthq.com",
        "Origin": "https://www.covalenthq.com",
        "Referer": "https://www.covalenthq.com/",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Safari/605.1.15"
    },
    cookies={},
    auth=(),
  )
  data = r.json()
  results.append({"sender":sender,
                  "value": pd.DataFrame(
                      data["data"]["items"])["quote"].sum()})