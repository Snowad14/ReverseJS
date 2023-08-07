import requests, hashlib, time

# request = requests()

def _verify(self):
    encrypted = request.json['x-kspx-00']
    ts = request.json['x-tx-00']
    data = request.json['data']

    if decrypt(kspx=encrypted, tx=ts) == hashlib.md5(data.encode()).hexdigest():
        tts = int(time.time()) - int(int(ts) / 1000000)
        if tts > 300:
            return {'is_valid': False}
        return {'is_valid': True}

def decrypt(kspx: str, tx= int) -> str:
    # V = data[:4]
    K = kspx[4:36]
    X = kspx[36:]

    A = [int(x + y, 16) for x, y in zip(K[0::2], K[1::2])]  # key
    B = [int(x + y, 16) for x, y in zip(X[0::2], X[1::2])]  # encrypted

    xt = [((int(x) * 2) + 33) for x in str(tx)]
    G = [A ^ B for A, B in zip(B, xt)]
    C = [A ^ B for A, B in zip(G, A)]  # dexor
    D = "".join(hex(_) for _ in C)  # to hex
    D = D.replace("0x", "")  # remove 0x
    return D[::-1]
    
# All except D[::-1] have been leaked thanks to flask debug mode and the python error displayed when kspx or tx parameters are invalid (like contains "z")

# print(decrypt(kspx="tk0172b5e3e587cdc0dcda738586808ca7c0e5c498bffc5b0a4ba605befcd2724692", tx=1691339045082485))
print(decrypt(kspx="tk016da974ebbe6fa5c9b896c0b5e3bf9d8bfad80fb1cbfd735edceaf1dfbd4b66c1", tx=1691417080504159))
