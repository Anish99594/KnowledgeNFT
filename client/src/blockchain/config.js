import { arbitrum, mainnet, sepolia , scrollSepolia} from 'wagmi/chains'

const projectId = "0736cbc3f8c866724cee10fd3a92e452";
// 2. Create wagmiConfig
const metadata = {
    name: 'BitsCrunchNFTMARKET',
    description: 'BitsCrunch APP',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}
import { defineChain } from "viem"
import { defaultWagmiConfig } from '@web3modal/wagmi/react';



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
});


const chains = [mainnet, arbitrum, SepoliaETHChain, sepolia, scrollSepolia]
export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
})