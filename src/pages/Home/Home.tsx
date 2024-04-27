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

require("@solana/wallet-adapter-react-ui/styles.css");
require("./home.css");

const TARGET_BLOCK_TIME = 5000; // Tempo alvo de um bloco em milissegundos

const Home = () => {
  const { publicKey, sendTransaction } = useWallet(); // Obtém a carteira da pessoa conectada
  const { connection } = useConnection();
  const { WALLET_ADDRESS_FOR_DONATION } = useWalletContext();
 
  const [sol, setSol] = useState<number>(0);
  const [bal, setBal] = useState<number>(0);
  const [status, setStatus] = useState<"Transação enviada"|"Transação pendente"|"Transação confirmada"|"Transação falhada"|"">("");

  const fetchBalance = async () => {
    if (publicKey && connection) {
      const DonorsBalance = await connection.getBalance(publicKey);
      setBal(DonorsBalance / LAMPORTS_PER_SOL);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [publicKey, connection]);

  const transferSol = async () => {
    if ( !publicKey ) throw new WalletNotConnectedError();

    let lamportsI = sol * LAMPORTS_PER_SOL;
    console.log(lamportsI)
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

      setStatus("Transação pendente");

      const signature = await sendTransaction(transaction, connection);

      setStatus("Transação enviada");

      console.log("Transferência enviada:", signature);

      const confirmation = await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: signature,
        },
        "confirmed"
      );

      console.log("Status da transação:", confirmation);

      if(confirmation.value.err == null){
        setStatus("Transação confirmada");
        fetchBalance();
      }else{
        setStatus("Transação falhada");
      }
    } catch (error) {
      setStatus("Transação falhada");
      console.error("Falha ao enviar transferência:", error);
    }
  };

  return (
    <div className="container">
      <div className="progress-bar">
        <div></div>
        <p>00.00%</p>
      </div>
      <div className="wallet">
        <WalletMultiButton />
        {publicKey ? (
          <div>
            <p>My Balance: {bal}</p>
            <input
              value={sol}
              type="number"
              onChange={(e: any) => setSol(e.target?.value)}
            ></input>
            <button onClick={transferSol}>Transferir SOL</button>
            {
              status != "" && <p>{status}</p>
            }
          </div>
        ) : (
          <p>Nenhuma carteira conectada</p>
        )}
      </div>
    </div>
  );
};

export default Home;
