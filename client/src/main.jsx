import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "react-hot-toast";
import { defineChain } from "viem";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const queryClient = new QueryClient();

// Define Sepolia explicitly
const SepoliaETHChain = defineChain({
  id: 11155111, // Chain ID for Sepolia
  name: "Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia Ether",
    symbol: "ETH", // Use "ETH" for consistency
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.infura.io/v3/3ae649d328e8405fb461d9cac9b0705b"], // Replace with your Infura project ID
    },
  },
  blockExplorers: {
    default: { name: "Sepolia", url: "https://sepolia.etherscan.io" },
  },
  testnet: true,
});

// Config with Sepolia defined
export const config = getDefaultConfig({
  appName: "BitsCrunchNFTMARKET",
  projectId: "0736cbc3f8c866724cee10fd3a92e452", // Replace with your WalletConnect project ID
  chains: [SepoliaETHChain], // Use the explicitly defined Sepolia chain
  ssr: true, // Enable if using server-side rendering (SSR)
});

// Render the app
createRoot(document.getElementById("root")).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider showRecentTransactions={true}>
        <StrictMode>
          <App />
          <Toaster position="bottom-right" reverseOrder={true} />
        </StrictMode>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
