import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Allocation from './pages/Allocation/Allocation';
import { WalletContextProvider } from './contexts/WalletContext';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';
import { LedgerWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

function App() {
  if (typeof window !== 'undefined' && !window.Buffer) {
    window.Buffer = require('buffer').Buffer;
  }
  // Lista de RPCs Solana
  const rpcList = [
    'https://api.tatum.io/v3/blockchain/node/solana-mainnet', 
    'https://solana-mainnet.core.chainstack.com/fab7093c15e5a0452c35c7b0edb3f745',
    'https://solana-mainnet.core.chainstack.com/cc0a5e66f397941f860cfc0fe31be9be', 
    // Adicione outros RPCs Solana que deseja usar como alternativas
  ];

  const [rpcListIndex,setRpcListIndex] = useState(0);
  const [endpoint,setEndpoint] = useState(rpcList[rpcListIndex]);

  // Função para verificar a disponibilidade do RPC
  async function checkRPCAvailability(rpcUrl:string) {
    const web3 = new Connection(rpcUrl);
    try {
        // Realize uma chamada simples para verificar a disponibilidade
        const blockCount = await web3.getLatestBlockhash();
        console.log(`RPC ${rpcUrl} está online. Último bloco: ${blockCount}`);
        return true;
    } catch (error:any) {
        console.log(`Erro ao se conectar ao RPC ${rpcUrl}: ${error.message}`);
        return false;
    }
  }

  async function verify() {
    const isAvailable = await checkRPCAvailability(rpcList[rpcListIndex]);
    if (!isAvailable) {
      const nextIndex = rpcListIndex + 1;
      for(let i = nextIndex + 1;i < rpcList.length;i++){
        if (await checkRPCAvailability(rpcList[i])) {
          console.log(`Alternando para ${rpcList[i]}`);
          setRpcListIndex(i);
          setEndpoint(rpcList[i]);
          break;
        }
      }
    }
  }

  useEffect(() => {
    verify();
  }, []);
  
  const network = WalletAdapterNetwork.Mainnet; // Devnet é teste. Você pode alterar para 'MainnetBeta' para a rede principal
  const wallets = useMemo(
    () => [
      new LedgerWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter({ params: { network } }),
    ],
    [network]
  );

  return (
    <WalletContextProvider>
      <BrowserRouter>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect={true}>
            <WalletModalProvider>
              <Header />
              <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/allocation" element={<Allocation />} />
                    {/* <Route path="contact" element={<Contact />} />
                    <Route path="*" element={<NoPage />} /> */}
                </Routes>
              </main>
          </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </BrowserRouter>
    </WalletContextProvider>
  );
}

export default App;