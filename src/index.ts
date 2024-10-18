import { BigNumber, ethers } from "ethers";
import { signAuthorization } from "./models/SignAuthorization.js";
import { transferWithAuthorization } from "./models/TransferWithAuthorization.js";
import "dotenv/config";

/*
 * User does not have any ETH, but has USDC.
 * We want a sponsor to be the one executing the transaction to
 * an address of the user's choosing that we will call recipient.
 */
const userWallet = new ethers.Wallet(
  process.env.USER_PRIVATE_KEY!,
  new ethers.providers.JsonRpcProvider(process.env.RPC_URL!),
);
const sponsorWallet = new ethers.Wallet(
  process.env.SPONSOR_PRIVATE_KEY!,
  new ethers.providers.JsonRpcProvider(process.env.RPC_URL!),
);
const recipientAddress = "0x074C4FFA46a093383F25066DAA383Fa21B9267b6";

function generateRandomNonce(): string {
  const randomBytes = ethers.utils.randomBytes(32); // Generate 32 random bytes
  return ethers.utils.hexlify(randomBytes); // Convert to hex string
}

const transferAmount = "0.1";
const now = new Date();
const deadline = new Date(now.getTime() + 10 * 60 * 1000);
const amount = ethers.utils.parseUnits(transferAmount, 6);
const nonce = generateRandomNonce();
console.log("Nonce: ", nonce);

try {
  // User will create a signature to authorize a transfer
  const signature = await signAuthorization(
    userWallet,
    recipientAddress,
    amount,
    nonce,
    deadline.valueOf(),
  );
  console.log("Signed: ", signature);

  // Sponsor will execute the transaction
  const receipt = await transferWithAuthorization(
    sponsorWallet,
    userWallet.address,
    recipientAddress,
    amount,
    deadline.valueOf(),
    nonce,
    signature
  );
  console.log("Receipt: ", receipt)
} catch (error) {
  console.error(error);
}
