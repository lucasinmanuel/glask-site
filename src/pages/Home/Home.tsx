import { useEffect, useState } from "react";
import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletNotConnectedError,
} from "@solana/wallet-adapter-base";
import {
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useWalletContext } from "../../contexts/WalletContext";
import exclamationMark from "../../assets/exclamation-mark.png";

require("@solana/wallet-adapter-react-ui/styles.css");
require("./home.css");

const Home = () => {
  const { publicKey, sendTransaction } = useWallet(); // Obtém a carteira da pessoa conectada
  const { connection } = useConnection();
  const { WALLET_ADDRESS_FOR_DONATION } = useWalletContext();

  const [sol, setSol] = useState<number>(0);
  const [bal, setBal] = useState<number>(0);
  const [status, setStatus] = useState<"Transaction sent" | "Pending Transaction" | "Transaction confirmed" | "Transaction failed. It may be necessary to update the website." | "">("");

  const fetchBalance = async () => {
    if (publicKey && connection) {
      const DonorsBalance = await connection.getBalance(publicKey);
      const balance = DonorsBalance / LAMPORTS_PER_SOL;
      setBal(balance);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [publicKey, connection]);

  const transferSol = async () => {

    if (!(sol > 0)) {
      alert("The transfer amount is not valid!")
      return
    }

    if (!publicKey) throw new WalletNotConnectedError();

    let lamportsI = sol * LAMPORTS_PER_SOL;
    
    try {
      const latestBlockHash = await connection.getLatestBlockhash();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
          fromPubkey: publicKey,
          toPubkey: new PublicKey(WALLET_ADDRESS_FOR_DONATION),
          lamports: lamportsI, // Quantidade de lamports a serem transferidos (1 SOL = 1000000000 lamports)
        })
      );

      // Defina o `feePayer` para uma carteira que tenha saldo suficiente para cobrir uma taxa mais alta
      transaction.feePayer = publicKey;

      transaction.recentBlockhash = latestBlockHash.blockhash;

      setStatus("Pending Transaction");

      const signature = await sendTransaction(transaction, connection);

      setStatus("Transaction sent");
      setTimeout(() => fetchBalance(), 5000);

      console.log("Transaction sent:", signature);

      fetch("https://glask-api.onrender.com/api/transaction",{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({signature:signature})
      });
    } catch (error) {
      setStatus("Transaction failed. It may be necessary to update the website.");
      console.error("Failed to send transfer:", error);
    }
  };

  return (
    <div className="container home">
      {/* <div className="progress-bar">
        <div></div>
        <p>00.00%</p>
      </div> */}
      <div className="wallet">
        <WalletMultiButton />
        {publicKey ? (
          <div className="transfer-info">
            <p><b>My Balance:</b> (SOL) {bal}</p>
            <input
              value={sol}
              type="number"
              min={"0"}
              onChange={(e: any) => setSol(e.target?.value)}
            ></input>
            <button onClick={transferSol}>Transfer SOL</button>
            {
              status != "" && <span><b>{status}</b></span>
            }
          </div>
        ) : (
          <p>No Connected Wallet</p>
        )}
        <br />
        <div style={{ color: "red" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src={exclamationMark} alt="exclamation icon" style={{ height: "1em", marginRight: "0.5em" }} />
            <span><b>Minimum Value:</b> 0.1 Sol;</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src={exclamationMark} alt="exclamation icon" style={{ height: "1em", marginRight: "0.5em" }} />
            <span><b>Maximum Value:</b> 10 Sol;</span>
          </div>
          <br />
          All transactions below or above the specified min and max value will be considered as donations to the project, and their corresponding values in $GLASK will not be sent. By making a transaction, you agree to be aware of these terms.
        </div>
      </div>
    </div>
  );
};

export default Home;
