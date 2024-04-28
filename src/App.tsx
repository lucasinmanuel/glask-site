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
  const [endpoint,setEndpoint] = useState("https://api.devnet.solana.com");
  // const [rpcListIndex,setRpcListIndex] = useState(0);

  // // Lista de RPCs Solana
  // const rpcList = [
  //   'https://api.mainnet-beta.solana.com', // Exemplo de RPC Solana principal
  //   'https://api.devnet.solana.com', // Exemplo de RPC Solana de desenvolvimento
  //   // Adicione outros RPCs Solana que deseja usar como alternativas
  // ];

  // // Função para verificar a disponibilidade do RPC
  // async function checkRPCAvailability(rpcUrl:string) {
  //   const web3 = new Connection(rpcUrl);
  //   try {
  //       // Realize uma chamada simples para verificar a disponibilidade
  //       const blockCount = await web3.getLatestBlockhash();
  //       console.log(`RPC ${rpcUrl} está online. Último bloco: ${blockCount}`);
  //       return true;
  //   } catch (error:any) {
  //       console.log(`Erro ao se conectar ao RPC ${rpcUrl}: ${error.message}`);
  //       return false;
  //   }
  // }

  // async function verify() {
  //   const isAvailable = await checkRPCAvailability(rpcList[rpcListIndex]);
  //   if (!isAvailable) {
  //     const nextIndex = rpcListIndex + 1;
  //     if (nextIndex < rpcList.length && await checkRPCAvailability(rpcList[nextIndex])) {
  //       console.log(`Alternando para ${rpcList[nextIndex]}`);
  //       setRpcListIndex(nextIndex);
  //       setEndpoint(rpcList[nextIndex]);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     verify();
  //   }, 10000);
  //   return () => clearInterval(intervalId);
  // }, []);
  
  const network = WalletAdapterNetwork.Devnet; // Devnet é teste. Você pode alterar para 'MainnetBeta' para a rede principal
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
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/allocation" element={<Allocation />} />
                  {/* <Route path="contact" element={<Contact />} />
                  <Route path="*" element={<NoPage />} /> */}
              </Routes>
          </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </BrowserRouter>
    </WalletContextProvider>
  );
}

export default App;