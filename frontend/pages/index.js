import MainView from "../components/MainView";
import "@solana/wallet-adapter-react-ui/styles.css"; // Import the main styles
// import "@solana/wallet-adapter-react-ui/solana-wallet-adapter.css"; // Import wallet-specific styles (optional)
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() { 
  const {connected}=useWallet();
  return (
    <div className="app">
      {connected?(
        <MainView/>
      ):(
        <div className="loginContainer">
          <div className="loginTitle">Chingari🔥Login </div>
          <div className="loginSubtitle">Manage your account,check notifications,comment on videos,more</div>
            <WalletMultiButton/>
        </div>
      )}

    </div>
  )
}
