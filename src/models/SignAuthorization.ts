import { BigNumber, ethers } from "ethers";

export async function signAuthorization(
  signer: ethers.providers.JsonRpcSigner | ethers.Wallet,
  recipient: string,
  amount: BigNumber,
  nonce: string,
  deadline: number,
): Promise<string> {
  const signerAddress = await signer.getAddress();

  // Check if nonce has already been used
  const usdcContract = new ethers.Contract(
    "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    [
      {
        inputs: [
          { internalType: "address", name: "authorizer", type: "address" },
          { internalType: "bytes32", name: "nonce", type: "bytes32" },
        ],
        name: "authorizationState",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    signer,
  );
  const alreadyAuthorized = await usdcContract.authorizationState(
    signerAddress,
    nonce,
  );
  console.log('Answer to signed: ', alreadyAuthorized)
  if (alreadyAuthorized) {
    throw new Error("Signing authorization: Nonce has already been used");
  }

  // Constructing signature
  const domain = {
    name: "USDC",
    version: "2",
    chainId: 11155111, // Sepolia Chain ID
    verifyingContract: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  };

  const types = {
    TransferWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
    ],
  };

  const message = {
    from: signerAddress,
    to: recipient,
    value: amount,
    validAfter: 0, // Can be set to a future timestamp
    validBefore: deadline, // A timestamp for validity expiry
    nonce: nonce,
  };
  console.log("Message:", message)

  const signature = await signer._signTypedData(domain, types, message);

  return signature;
}
