import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Allocation from './pages/Allocation/Allocation';
import { WalletContextProvider } from './contexts/WalletContext';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import { LedgerWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

function App() {
  if (typeof window !== 'undefined' && !window.Buffer) {
    window.Buffer = require('buffer').Buffer;
  }
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