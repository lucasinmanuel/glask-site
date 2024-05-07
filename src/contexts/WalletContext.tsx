import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Ranking {
  transactions: {
      wallet: string,
      value: number
  }[],
  totalPages: number,
  balance: number
}

interface WalletContextProps {
    ranking: Ranking|undefined,
    setRanking: (newValue:Ranking|undefined) => void,
    WALLET_ADDRESS_FOR_DONATION: string
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: React.FC<WalletContextProviderProps> = ({ children }) => {
  const [ranking, setRanking] = useState<Ranking|undefined>();
  const [WALLET_ADDRESS_FOR_DONATION,] = useState("9JPUx1twRU63V1DaBJ6npurSRdPsiWmKTsPrJB3uViK");
  return (
    <WalletContext.Provider value={{ 
        ranking, setRanking,
        WALLET_ADDRESS_FOR_DONATION
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = (): WalletContextProps => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletContextProvider');
  }
  return context;
};