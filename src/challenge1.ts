import { Connection, PublicKey} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const address = new PublicKey(process.env.PUBLIC_ADDRESS);

if(!address){
  throw Error("Invalid public address");
  process.exit(0);
}

console.log(address);

const balance = await connection.getBalance(address);
console.log("Balance: ", balance);
