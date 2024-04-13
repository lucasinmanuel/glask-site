import { useEffect, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  clusterApiUrl,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

require("@solana/wallet-adapter-react-ui/styles.css");
require("./home.css");

const MyComponent = () => {
  const { publicKey, sendTransaction } = useWallet(); // Obtém a carteira da pessoa conectada
  const { connection } = useConnection();

  const [sol, setSol] = useState<number>(0);
  const [bal, setBal] = useState<number>(0);

  useEffect(() => {
    if (publicKey) {
      connection
        .getBalance(publicKey)
        .then((bal) => setBal(bal / LAMPORTS_PER_SOL));
    }
  }, [publicKey]);


  const transferSol = async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    let lamportsI = sol * LAMPORTS_PER_SOL;

    try {
      const latestBlockHash = await connection.getLatestBlockhash();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(
            "FXL9PtuDZ8X71K451ziF2YWb68wAdXGiubgCKzaeWMBH"
          ),
          lamports: lamportsI, // Quantidade de lamports a serem transferidos (1 SOL = 1000000000 lamports)
        })
      );

      const signature = await sendTransaction(transaction, connection);

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
    } catch (error) {
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
            <p>my balance: {bal}</p>
            <input
              value={sol}
              type="number"
              onChange={(e: any) => setSol(e.target?.value)}
            ></input>
            <button onClick={transferSol}>Transferir SOL</button>
          </div>
        ) : (
          <p>Nenhuma carteira conectada</p>
        )}
      </div>
    </div>
  );
};

function Home() {
  const network = WalletAdapterNetwork.Mainnet; // Devnet é teste. Você pode alterar para 'MainnetBeta' para a rede principal
  const endpoint = clusterApiUrl(network, true);

  const wallets = useMemo(
    () => [
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter({ network }),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter({ params: { network } }),
    ],
    [network]
  );

  return (
    <main>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={true}>
          <WalletModalProvider>
            <MyComponent />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </main>
  );
}

export default Home;
