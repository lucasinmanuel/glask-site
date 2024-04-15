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
  Keypair,
} from "@solana/web3.js";
import {
  LedgerWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

require("@solana/wallet-adapter-react-ui/styles.css");
require("./home.css");

const TARGET_BLOCK_TIME = 5000; // Tempo alvo de um bloco em milissegundos

const MyComponent = () => {

  
  const { publicKey, sendTransaction } = useWallet(); // Obtém a carteira da pessoa conectada
  const { connection } = useConnection();

  const [sol, setSol] = useState<number>(0);
  const [bal, setBal] = useState<number>(0);
  const [status, setStatus] = useState<"Transação enviada"|"Transação pendente"|"Transação confirmada"|"Transação falhada"|"">("");
  const [networkActivity, setNetworkActivity] = useState<string>("Normal"); // Inicializa a atividade da rede como "Normal"


  const fetchBalance = async () => {
    if (publicKey && connection) {
      const balance = await connection.getBalance(publicKey);
      setBal(balance / LAMPORTS_PER_SOL);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [publicKey, connection]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      monitorNetworkActivity(); // Chama a função monitorNetworkActivity a cada intervalo
    }, 60000); // Atualiza a cada 1 minuto
    return () => clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado
  }, []);

  const monitorNetworkActivity = async () => {
    try {
      const networkInfo = await connection.getEpochInfo(); // Obtem informações sobre a época atual da rede Solana
      const blockTime = await connection.getBlockTime(networkInfo.absoluteSlot); // Calcula o tempo de um bloco

      if(blockTime){
        if (blockTime < TARGET_BLOCK_TIME) {
          setNetworkActivity("High"); // Define a atividade da rede como alta se o tempo médio do bloco for menor que o alvo
        } else {
          setNetworkActivity("Normal"); // Define a atividade da rede como normal caso contrário
        }
      }
    } catch (error) {
      console.error("Erro ao obter informações de rede:", error);
    }
  };

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
            <p>Network Activity: {networkActivity}</p> {/* Exibe a atividade da rede */}
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

function Home() {
  const network = WalletAdapterNetwork.Devnet; // Devnet é teste. Você pode alterar para 'MainnetBeta' para a rede principal
  const endpoint = clusterApiUrl(network, true);

  const wallets = useMemo(
    () => [
      new LedgerWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter({ params: { network } }),
    ],
    [network]
  );
  // https://rough-proportionate-mountain.solana-mainnet.quiknode.pro/f91fe767abcd15798f217e45883093b94d5ac81d/
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
