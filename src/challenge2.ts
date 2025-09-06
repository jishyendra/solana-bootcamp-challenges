//program to send sol to other public addresses
import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  Connection,
  clusterApiUrl,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import process from "node:process";

const connection = new Connection(clusterApiUrl("devnet"));
const transaction = new Transaction();

const publicAddr = process.env.PUBLIC_KEY;
const publicKey = new PublicKey(publicAddr);

const keypair = getKeypairFromEnvironment("SECRET_KEY");

let recvAddress;
let recvPublickey;

while (true) {
  try {
    recvAddress = prompt("Enter reciever address:");
    if (!recvAddress) throw Error("Please enter a valid public address");
    recvPublickey = new PublicKey(recvAddress);
    if (recvPublickey) await sendSol(recvPublickey);
    else throw Error("Invalid reciever address");
  } catch (_) {
    console.log("Oops, you entered invalid address\n");
  }
}

async function sendSol(toPublickey:PublicKey) {
  const amount = parseFloat(prompt("Enter amount in sol:"));
  if (!amount) throw Error("Invalid amount");
  const sendSolTrx = SystemProgram.transfer({
    fromPubkey: publicKey,
    toPubkey: toPublickey,
    lamports: LAMPORTS_PER_SOL * amount,
  });
  transaction.add(sendSolTrx);
  try {
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);
    console.log("Transaction success.Signature:", signature);
    const balance = await connection.getBalance(publicKey);
    console.log(`Available balance:${balance/LAMPORTS_PER_SOL} SOL\n`);
  } catch (_) {
    console.log("Trasaction failed");
  }
}
