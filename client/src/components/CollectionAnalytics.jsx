import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../css/collectionAnalysis.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CollectionAnalytics = () => {
  const [contractAddress, setContractAddress] = useState(
    "0x524cab2ec69124574082676e6f654a18df49a048"
  );
  const [blockchain, setBlockchain] = useState("ethereum");
  const [collectionData, setCollectionData] = useState(null);
  const [holdersData, setHoldersData] = useState(null);
  const [whalesData, setWhalesData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (contractAddress) {
      fetchData();
    }
  }, [contractAddress]);

  const fetchData = async () => {
    try {
      const analyticsResponse = await axios.get(
        `https://api.unleashnfts.com/api/v2/nft/collection/analytics?blockchain=${blockchain}&contract_address=${contractAddress}&offset=0&limit=30&sort_by=sales&time_range=24h&sort_order=desc`,
        {
          headers: {
            accept: "application/json",
            "x-api-key": "32b87ad2ebb80c7eb7306807539e7566",
          },
        }
      );
      setCollectionData(analyticsResponse.data);

      const holdersResponse = await axios.get(
        `https://api.unleashnfts.com/api/v2/nft/collection/holders?blockchain=${blockchain}&contract_address=${contractAddress}&time_range=24h&offset=0&limit=30&sort_by=holders&sort_order=desc`,
        {
          headers: {
            accept: "application/json",
            "x-api-key": "32b87ad2ebb80c7eb7306807539e7566",
          },
        }
      );
      setHoldersData(holdersResponse.data);

      const whalesResponse = await axios.get(
        `https://api.unleashnfts.com/api/v2/nft/collection/whales?blockchain=${blockchain}&contract_address=${contractAddress}&time_range=24h&offset=0&limit=30&sort_by=nft_count&sort_order=desc`,
        {
          headers: {
            accept: "application/json",
            "x-api-key": "32b87ad2ebb80c7eb7306807539e7566",
          },
        }
      );
      setWhalesData(whalesResponse.data);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    }
  };

  const prepareChartData = (data) => {
    if (!data || !data.data || data.data.length === 0) return {};
    const collection = data.data[0];
    return {
      labels: collection.block_dates,
      datasets: [
        {
          label: "Sales Trend",
          data: collection.sales_trend,
          borderColor: "rgba(75,192,192,1)",
          fill: false,
        },
      ],
    };
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="collection-analytics">
      <h1>Collection Analytics</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter Contract Address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
        <select
          value={blockchain}
          onChange={(e) => setBlockchain(e.target.value)}
        >
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
          <option value="binance-smart-chain">Binance Smart Chain</option>
          <option value="avalanche">Avalanche</option>
          <option value="solana">Solana</option>
        </select>
        <button onClick={fetchData}>Fetch Data</button>
      </div>

      {collectionData && collectionData.data.length > 0 ? (
        <div className="analytics-summary">
          <div>
            <h2>Total Sales: ${collectionData.data[0].volume.toFixed(2)}</h2>
            <h3>Assets: {collectionData.data[0].assets}</h3>
            <h3>Transactions: {collectionData.data[0].transactions}</h3>
          </div>

          <div className="charts">
            <Line data={prepareChartData(collectionData)} />
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}

      {holdersData && holdersData.data.length > 0 && (
        <div className="holders-summary">
          <h2>Top Holders</h2>
          <ul>
            <li>
              <h4>Total Holders: {holdersData.data[0].holders}</h4>
              <p>Holder Change: {holdersData.data[0].holders_change}</p>
            </li>
          </ul>
        </div>
      )}

      {whalesData && whalesData.data.length > 0 && (
        <div className="whales-summary">
          <h2>Whale Activity</h2>
          <ul>
            <li>
              <h4>Whales Buying NFTs: {whalesData.data[0].buy_whales}</h4>
              <p>Buy Count: {whalesData.data[0].buy_count}</p>
              <p>Buy Volume: ${whalesData.data[0].buy_volume.toFixed(2)}</p>
            </li>
            <li>
              <h4>Whales Selling NFTs: {whalesData.data[0].sell_whales}</h4>
              <p>Sell Count: {whalesData.data[0].sell_count}</p>
              <p>Sell Volume: ${whalesData.data[0].sell_volume.toFixed(2)}</p>
            </li>
            <li>
              <h4>
                Total NFT Count Held by Whales: {whalesData.data[0].nft_count}
              </h4>
            </li>
            <li>
              <h4>
                Total Sale Volume: $
                {whalesData.data[0].total_sale_volume.toFixed(2)}
              </h4>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CollectionAnalytics;
