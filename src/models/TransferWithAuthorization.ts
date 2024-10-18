import { ethers, BigNumber,  } from "ethers";
import { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";

export async function transferWithAuthorization(
  sponsorWallet: ethers.Wallet,
  from: string,
  to: string,
  amount: BigNumber,
  deadline: number,
  nonce: string,
  signature: string
): Promise<TransactionReceipt | undefined>  {
  const usdcContract = new ethers.Contract(
    "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    [
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "value", type: "uint256" },
          { internalType: "uint256", name: "validAfter", type: "uint256" },
          { internalType: "uint256", name: "validBefore", type: "uint256" },
          { internalType: "bytes32", name: "nonce", type: "bytes32" },
          { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "transferWithAuthorization",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    sponsorWallet,
  );

//   const nonceHex = ethers.utils.hexZeroPad(
//     BigNumber.from(nonce).toHexString(),
//     32,
//   );
  try {
    const tx: TransactionResponse = await usdcContract.transferWithAuthorization(
      from, // Token holder (sender)
      to, // Recipient (user's address)
      amount, // Amount of tokens to transfer
      0, // When the authorization starts being valid
      deadline.valueOf(), // When the authorization expires
      nonce, // Unique nonce
      signature,
    );

    console.log("Transaction sent! Waiting for confirmation...");
    const receipt: TransactionReceipt = await tx.wait();
    console.log("Transaction confirmed! Receipt:", receipt);

    return receipt;
  } catch (error) {
    console.error("Transfer with authorization:", error);
  }
}
