// src/WalletContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initWalletSelector } from './walletSelector';

interface WalletContextType {
  selector: any;
  modal: any;
  accountId: string | null;
  signIn: () => void;
  signOut: () => void;
}

interface WalletProviderProps {
  children: ReactNode;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [selector, setSelector] = useState<any>(null);
  const [modal, setModal] = useState<any>(null);
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    const initializeWallet = async () => {
      const { selector, modal } = await initWalletSelector();
      setSelector(selector);
      setModal(modal);

      if (selector.isSignedIn()) {
        const wallet = await selector.wallet();
        const accounts = await wallet.getAccounts();
        setAccountId(accounts[0]?.accountId);
      }
    };

    initializeWallet();
  }, []);

  const signIn = () => {
    if (modal) {
      modal.show();
    }
  };

  const signOut = async () => {
    if (selector) {
      const wallet = await selector.wallet();
      await wallet.signOut();
      setAccountId(null);
    }
  };

  return (
    <WalletContext.Provider value={{ selector, modal, accountId, signIn, signOut }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
