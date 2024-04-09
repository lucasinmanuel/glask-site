import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ConnectionProvider, WalletContext, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection, Keypair, PublicKey, Transaction, SystemProgram, VersionedTransaction, TransactionMessage  } from '@solana/web3.js';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';

require('@solana/wallet-adapter-react-ui/styles.css');

const MyComponent = ({endpoint}:{endpoint:string}) => {
  const { wallet } = useContext(WalletContext); // Obtém a carteira da pessoa conectada
  const connection = new Connection(endpoint);

  const transferSol = async () => {
    let minRent = await connection.getMinimumBalanceForRentExemption(0);

    let blockhash = await connection
    .getLatestBlockhash()
    .then(res => res.blockhash);

    if (!wallet) {
      console.error('Wallet not connected');
      return;
    }

    const fromPublicKey = wallet.adapter.publicKey as PublicKey;
    const toPublicKey = Keypair.generate().publicKey; // Gerando uma nova carteira para transferência de exemplo

    try {
      const instructions = [
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports: minRent, // Quantidade de lamports a serem transferidos (1 SOL = 1000000000 lamports)
        })
      ]
      const messageV0 = new TransactionMessage({
        payerKey: fromPublicKey,
        recentBlockhash: blockhash,
        instructions
      }).compileToV0Message();
      const transaction = new VersionedTransaction(messageV0);
      const signature = await connection.sendTransaction(transaction);
      console.log('Transferência enviada:', signature);
    } catch (error) {
      console.error('Falha ao enviar transferência:', error);
    }
  };

  return (
      <div>
          <WalletMultiButton />
          {wallet ? (
              <div>
                  <p>Carteira conectada: {wallet?.adapter.publicKey?.toBase58()}</p>
                  <button onClick={transferSol}>Transferir SOL</button>
              </div>
          ) : (
              <p>Nenhuma carteira conectada</p>
          )}
      </div>
  );
};

function Home() {
  const network = WalletAdapterNetwork.Devnet; // Devnet é teste. Você pode alterar para 'MainnetBeta' para a rede principal
  const endpoint = clusterApiUrl(network);
  
  const wallets = useMemo(
    () => [
      new UnsafeBurnerWalletAdapter()
    ],
    [network]
);
  return (
    <main>
      <div className="container">
            <div className="progress-bar">
                <div></div>
                <p>00.00%</p>
            </div>
        </div>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect={true}>
            <WalletModalProvider>
              {/* <div className="App">
                <header className="App-header">
                  <h1>Solana Wallet Example</h1>
                </header>
                {selectedWallet ? (
                  <div>
                    <p>Carteira conectada: {wallet?.adapter.publicKey?.toBase58()}</p>
                    <button onClick={() => setSelectedWallet(null)}>Desconectar</button>
                    <button onClick={transferSol}>Transferir SOL</button>
                  </div>
                ) : (
                  <button onClick={() => setSelectedWallet(true)}>Conectar Wallet</button>
                )}
              </div> */}
              <MyComponent endpoint={endpoint}  />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
    </main>
  );
}

export default Home;