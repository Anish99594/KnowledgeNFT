import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import "../css/walletProfiling.css"; // Updated to match the new CSS file name

ChartJS.register(ArcElement, Tooltip, Legend);

const UserWalletProfile = () => {
  const [walletAnalytics, setWalletAnalytics] = useState(null);
  const [walletScores, setWalletScores] = useState(null);
  const [walletProfile, setWalletProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(
    "0xf0638096047ef0183d0f3232e82205b118e100dd"
  );
  const [selectedChain, setSelectedChain] = useState("ethereum");

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  console.log("Connected Wallet Address:", address);

  const fetchWalletData = async () => {
    setLoading(true);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": "32b87ad2ebb80c7eb7306807539e7566",
      },
    };

    try {
      const [analyticsRes, scoresRes, profileRes] = await Promise.all([
        fetch(
          `https://api.unleashnfts.com/api/v2/nft/wallet/analytics?wallet=${walletAddress}&blockchain=${selectedChain}&time_range=24h&sort_by=volume&sort_order=desc&offset=0&limit=30`,
          options
        ),
        fetch(
          `https://api.unleashnfts.com/api/v2/nft/wallet/scores?wallet=${walletAddress}&blockchain=${selectedChain}&sort_by=portfolio_value&sort_order=desc&time_range=24h&offset=0&limit=30`,
          options
        ),
        fetch(
          `https://api.unleashnfts.com/api/v2/nft/wallet/profile?wallet=${walletAddress}&blockchain=${selectedChain}&offset=0&limit=30`,
          options
        ),
      ]);

      const [analyticsData, scoresData, profileData] = await Promise.all([
        analyticsRes.json(),
        scoresRes.json(),
        profileRes.json(),
      ]);

      setWalletAnalytics(analyticsData.data?.[0] || null);
      setWalletScores(scoresData.data?.[0] || null);
      setWalletProfile(profileData.data?.[0] || null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress && selectedChain) {
      fetchWalletData();
    }
  }, [walletAddress, selectedChain]);

  const handleAddressChange = (e) => {
    setWalletAddress(e.target.value);
  };

  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
  };

  const prepareChartData = () => {
    if (!walletScores) return null;
    return {
      labels: ["Portfolio Value", "Unrealized Profit"],
      datasets: [
        {
          data: [walletScores.portfolio_value, walletScores.unrealized_profit],
          backgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
    };
  };

  if (!isConnected) {
    return (
      <div className="user-wallet-profile">
        <h2>Connect Wallet</h2>
        {connectors.map((connector) => (
          <button key={connector.id} onClick={() => connect({ connector })}>
            Connect with {connector.name}
          </button>
        ))}
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-wallet-profile">
      <h2>Wallet Profile</h2>

      <section className="user-wallet-section">
        <h3>Input Wallet Address & Blockchain</h3>
        <input
          type="text"
          placeholder="Enter Wallet Address"
          value={walletAddress}
          onChange={handleAddressChange}
        />
        <select value={selectedChain} onChange={handleChainChange}>
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
          <option value="bsc">Binance Smart Chain</option>
          <option value="avalanche">Avalanche</option>
          <option value="solana">Solana</option>
        </select>
        <button onClick={fetchWalletData}>Fetch Data</button>
      </section>

      <section className="user-wallet-section">
        <h3>Wallet Analytics</h3>
        {walletAnalytics ? (
          <div>
            <p>
              <strong>Transactions:</strong> {walletAnalytics.transactions}
            </p>
            <p>
              <strong>NFT Bought:</strong> {walletAnalytics.nft_bought}
            </p>
            <p>
              <strong>NFT Sold:</strong> {walletAnalytics.nft_sold}
            </p>
          </div>
        ) : (
          <div>No analytics data found.</div>
        )}
      </section>

      <section className="user-wallet-section">
        <h3>Wallet Scores</h3>
        {walletScores ? (
          <div>
            <p>
              <strong>Portfolio Value:</strong> {walletScores.portfolio_value}
            </p>
            <p>
              <strong>Estimated Portfolio Value:</strong>{" "}
              {walletScores.estimated_portfolio_value}
            </p>
            <p>
              <strong>Realized Profit:</strong> {walletScores.realized_profit}
            </p>
            <p>
              <strong>Unrealized Profit:</strong>{" "}
              {walletScores.unrealized_profit}
            </p>
          </div>
        ) : (
          <div>No scores data found.</div>
        )}
      </section>

      <section className="user-wallet-section">
        <h3>Wallet Profile</h3>
        {walletProfile ? (
          <div>
            <p>
              <strong>Is Whale:</strong> {walletProfile.is_whale ? "Yes" : "No"}
            </p>
            <p>
              <strong>NFT Count:</strong> {walletProfile.nft_count}
            </p>
            <p>
              <strong>Collection Count:</strong>{" "}
              {walletProfile.collection_count}
            </p>
          </div>
        ) : (
          <div>No profile data found.</div>
        )}
      </section>

      <section className="user-wallet-performance">
        <h3>Wallet Performance</h3>
        {walletScores ? (
          <Pie data={prepareChartData()} />
        ) : (
          <div>No data available for visualization.</div>
        )}
      </section>
    </div>
  );
};

export default UserWalletProfile;
