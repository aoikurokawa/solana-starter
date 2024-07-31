import { Commitment, Connection, Keypair, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("944WMpmB3n86tvttvKRZkPr9N4DUoD7qccPM7dxR3Nbr");

// Recipient address
const to = new PublicKey("DyEKpfGg6sBL2Dg6rnHcsdAHJdCoe7Ur5VWzDzdHkQY6");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`fromAta is: ${fromAta.address.toBase58()}`);

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);
        console.log(`toAta is: ${toAta.address.toBase58()}`);

        // Transfer the new token to the "toTokenAccount" we just created
        const sig = await transfer(connection, keypair, fromAta.address, toAta.address, keypair, 50);
        console.log(`Signature: ${sig}`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
