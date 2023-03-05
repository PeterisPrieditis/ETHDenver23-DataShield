# %%
# %%
import requests
import requests_cache
import pandas as pd
requests_cache.install_cache("./tmp/requests_cache.sqlite",allowable_methods=('GET', 'POST'))

# %%
df = pd.read_csv("./tmp/NFT MEV EXPORT.csv")

for token in df["mev_trades"]:
    r = requests.get(f"https://tx.eth.samczsun.com/api/v1/trace/ethereum/0x{token}")
    r = requests.post("http://localhost:3000?tx=0x" + token.lower(), json=r.json())
    with open(f"./tmp/tx/{token}.json", "w") as f:
        f.write(r.text)
          
# %%
import glob
import json
for file in glob.glob("./tmp/tx/*.json"):
    with open(file, "r") as f:
        data = f.read()
        try:
            print(json.loads(data))
        except:
            pass
