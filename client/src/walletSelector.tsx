// src/walletSelector.ts
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

export const initWalletSelector = async () => {
  const selector = await setupWalletSelector({
    network: 'testnet',
    modules: [
      setupNearWallet(),
      setupMyNearWallet(),
    
    ],
  });

  const modal = setupModal(selector, {
    contractId: 'aryaman1211.testnet', 
  });

  return { selector, modal };
};
