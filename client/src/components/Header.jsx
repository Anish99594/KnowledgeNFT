import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "../css/Header.css";
import logo from "../assets/knowledgeNFTLogo.png";
import {
  FaHome,
  FaUser,
  FaPlus,
  FaBars,
  FaChartLine,
  FaWallet,
  FaSearch,
} from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="KnowledgeNFT Logo" className="logo" />{" "}
        <h1 className="logo" style={{ marginBottom: "7px" }}>
          KnowledgeNFT
        </h1>
      </div>
      <div className="nav-links" style={{ alignItems: "center" }}>
        <Link to="/" className="nav-item">
          <FaHome /> Home
        </Link>
        <Link to="/create" className="nav-item">
          <FaPlus /> Create NFT
        </Link>
        <Link to="/profile" className="nav-item">
          <FaUser /> Profile
        </Link>
        <div className="dropdown">
          <button className="dropbtn">
            <FaChartLine /> More <span>&#9660;</span>
          </button>
          <div className="dropdown-content">
            <Link to="/marketinsights">Market Insights</Link>
            <Link to="/collectionanalysis">Collection Analysis</Link>
            <Link to="/walletprofiling">Wallet Profiling</Link>
          </div>
        </div>

        <div style={{ marginRight: "40px" }}>
          <ConnectButton />
        </div>
        <div
          className="hamburger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </div>
      </div>
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/">Home</Link>
          <Link to="/create">Create NFT</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/marketinsights">Market Insights</Link>
          <Link to="/collectionanalysis">Collection Analysis</Link>
          <Link to="/walletprofiling">Wallet Profiling</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
