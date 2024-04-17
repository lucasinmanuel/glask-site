import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextProps {
    ranking: any,
    setRanking: any
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: React.FC<WalletContextProviderProps> = ({ children }) => {
  const [ranking, setRanking] = useState<any>([]);
  return (
    <WalletContext.Provider value={{ 
        ranking, setRanking
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