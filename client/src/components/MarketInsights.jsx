import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import "../css/MarketInstghts.css";

const MarketInsights = () => {
  const [marketData, setMarketData] = useState(null);
  const [traderData, setTraderData] = useState(null);
  const [washTradeData, setWashTradeData] = useState(null);
  const [holdersData, setHoldersData] = useState(null); // State for holders data

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-api-key": "32b87ad2ebb80c7eb7306807539e7566",
    },
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const [marketRes, tradersRes, washTradeRes, holdersRes] =
          await Promise.all([
            fetch(
              "https://api.unleashnfts.com/api/v2/nft/market-insights/analytics",
              options
            ).then((res) => res.json()),
            fetch(
              "https://api.unleashnfts.com/api/v2/nft/market-insights/traders",
              options
            ).then((res) => res.json()),
            fetch(
              "https://api.unleashnfts.com/api/v2/nft/market-insights/washtrade",
              options
            ).then((res) => res.json()),
            fetch(
              "https://api.unleashnfts.com/api/v2/nft/market-insights/holders?blockchain=ethereum&time_range=24h",
              options
            ).then((res) => res.json()), // New API request for holders data
          ]);

        console.log("Market Response:", marketRes);
        console.log("Traders Response:", tradersRes);
        console.log("Wash Trade Response:", washTradeRes);
        console.log("Holders Response:", holdersRes); // Log the holders data

        // Ensure data is in the expected format before setting state
        setMarketData(marketRes?.data?.[0] || {});
        setTraderData(tradersRes?.data?.[0] || {});
        setWashTradeData(washTradeRes?.data?.[0] || {});
        setHoldersData(holdersRes?.data?.[0] || {}); // Set holders data
      } catch (error) {
        console.error("Error fetching market insights:", error);
      }
    };

    fetchMarketData();
  }, []);

  // Check if marketData is loaded and has the required fields
  if (!marketData?.block_dates || !holdersData?.block_dates) {
    return <div>Loading data...</div>;
  }

  const volumeTrendChart = {
    labels: marketData.block_dates,
    datasets: [
      {
        label: "Volume Trend",
        data: marketData.volume_trend,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const salesTrendChart = {
    labels: marketData.block_dates,
    datasets: [
      {
        label: "Sales Trend",
        data: marketData.sales_trend,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const washTradeChart = {
    labels: washTradeData.block_dates,
    datasets: [
      {
        label: "Wash Trade Volume",
        data: washTradeData.washtrade_volume_trend,
        backgroundColor: "rgba(255, 206, 86, 0.5)",
      },
    ],
  };

  // New chart for holders trend
  const holdersTrendChart = {
    labels: holdersData.block_dates,
    datasets: [
      {
        label: "Holders Trend",
        data: holdersData.holders_trend,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return (
    <div className="market-insights">
      <h2>Market Insights Dashboard</h2>

      <div className="chart-container">
        <h3>Market Volume Trend</h3>
        <Bar data={volumeTrendChart} />
      </div>

      <div className="chart-container">
        <h3>Sales Trend</h3>
        <Bar data={salesTrendChart} />
      </div>

      <div className="chart-container">
        <h3>Wash Trade Volume</h3>
        <Line data={washTradeChart} />
      </div>

      {/* New Chart for Holders Trend */}
      <div className="chart-container">
        <h3>Holders Trend</h3>
        <Line data={holdersTrendChart} />
      </div>

      <div className="insights">
        <h3>Top Market Stats</h3>
        <p>Total Sales: {marketData.sales}</p>
        <p>Total Transactions: {marketData.transactions}</p>
        <p>Current Volume: ${marketData.volume.toLocaleString()}</p>
      </div>

      <div className="trader-stats">
        <h3>Trader Insights</h3>
        <p>Total Traders: {traderData.traders}</p>
        <p>Buyers: {traderData.traders_buyers}</p>
        <p>Sellers: {traderData.traders_sellers}</p>
      </div>

      <div className="washtrade-alert">
        <h3>Wash Trade Alerts</h3>
        <p>Suspicious Sales: {washTradeData.washtrade_suspect_sales}</p>
        <p>
          Wash Trade Volume: ${washTradeData.washtrade_volume.toLocaleString()}
        </p>
      </div>

      {/* New Insights for Holders */}
      <div className="holders-stats">
        <h3>Holders Insights</h3>
        <p>Total Holders: {holdersData.holders}</p>
        <p>Change in Holders: {holdersData.holders_change * 100}%</p>
        <p>Total Whales: {holdersData.holders_whales}</p>
        <p>Change in Whales: {holdersData.holders_whales_change * 100}%</p>
      </div>
    </div>
  );
};

export default MarketInsights;
