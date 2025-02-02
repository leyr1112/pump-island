import React from 'react';
import { Link } from 'react-router-dom';

const RankingCard = ({ index, pool }) => {
    if (pool.bondingCurve === 100) return null; // Esclude quelli al 100%
    return (
      <div className="ranking-card">
        <span className="ranking-index">{index}</span>
        <div className="ranking-column ranking-name">
          <Link to={`/trade?token=${pool.address}`}>
            {pool.tokenName}
          </Link>
        </div>
        <div className="ranking-column ranking-symbol">{pool.tokenSymbol}</div>
        <div className="ranking-column ranking-marketcap">${pool.marketCap.toLocaleString()}</div>
        <div className="ranking-column ranking-bonding-curve">
          <div className="progress-bar" style={{ width: `${pool.bondingCurve}%` }}>
              {pool.bondingCurve.toFixed(2)}%
          </div>
        </div>
      </div>
    );
  };
export default RankingCard;

/* CSS Integrato */

const styles = `
  .ranking-card {
    display: grid;
    grid-template-columns: 50px 3fr 1fr 1fr 3fr;
    column-gap: 20px;
    align-items: center;
    background: #1d1d1d;
    border-radius: 16px;
    padding: 15px 30px;
    margin-bottom: 12px;
    color: white;
    font-family: 'PingFang SC', sans-serif;
    width: 100%;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  .ranking-index {
    font-weight: bold;
    color: #cd8e60;
    text-align: center;
  }

  .ranking-column {
    text-align: center;
  }

  .ranking-name {
    text-align: left;
  }

  .ranking-name a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
  }

  .ranking-name a:hover {
    color: #cd8e60;
  }

  .ranking-symbol {
    color: #b6c7ff;
    font-weight: bold;
  }

  .ranking-marketcap {
    color: #ffd9b6;
  }

  .ranking-bonding-curve {
    width: 100%;
    background: #333;
    border-radius: 10px;
    overflow: hidden;
   
  }

  .progress-bar {
    height: 20px;
    background: #cd8e60;
    text-align: center;
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .ranking-card {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }
`

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
