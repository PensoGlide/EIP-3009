# Example of ERC20 Transfer with Authorization (EIP-3009)

## Introduction
This repo is a simple example of the full flow for sponsoring an ERC20 transfer, from the signature of the one whose transfer we want to sponser, to the actual process of the transaction.

This example is hardcoded to work with Ethereum Sepolia.

## Setup
Populate a `.env` file with as `.env.example` states:
```
USER_PRIVATE_KEY = <private key of the user whose transaction we will sponsor>
SPONSOR_PRIVATE_KEY = <private key of the one who will pay for the transaction execution>
RPC_URL= <RPC URL, in this case it is expecting Ethereum Sepolia>
```

To compile TS files:
```
npm run build
```

To execute script:
```
npm run start
```

---

This example has the transfer amount hardcoded, as well as the recipient of the tokens (the tokens will always be sent from the USER).

The nonce is generated randomly using Ethers and the timeframe where this transaction is valid to be executed is set to happen until 10 minutes after the script is executed (this would only matter if you were to comment the actual `transferWithAuthorization` execution).