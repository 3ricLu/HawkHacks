// src/components/WalletButton.tsx
import { useWallet } from '../walletContext'; // Ensure this matches the actual filename

const WalletButton: React.FC = () => {
  const { accountId, signIn, signOut } = useWallet();

  return (
    <div>
      {accountId ? (
        <div>
          <p>Account ID: {accountId}</p>
          <button onClick={signOut} className="bg-red-500 text-blue p-2 rounded mt-4">
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={signIn} className="bg-blue-500 text-blue p-2 rounded mt-4">
          Connect Your Wallet
        </button>
      )}
    </div>
  );
};

export default WalletButton;
