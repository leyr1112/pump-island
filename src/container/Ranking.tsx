import { useState, useEffect } from 'react';
import '../App.css';
import '../styles/MainContainer.css';
import RankingCard from '../components/RankingCard.jsx';
import ClipLoader from 'react-spinners/ClipLoader';
import Footer from '../components/Footer.jsx';
import TopBar from '../components/TopBar.jsx';
import { useGetPools } from '../hooks/index.ts';
import React from 'react';

interface Pool {
  address: string;
  tokenName: string;
  tokenSymbol: string;
  marketCap?: number;
  bondingCurve?: number;
  website?: string;
}

const Ranking = () => {
  const { pools, loading } = useGetPools();
  const [rankedPools, setRankedPools] = useState<Pool[]>([]);

  useEffect(() => {
    console.log("Pools Data:", pools);
    if (pools && Array.isArray(pools) && pools.length > 0) {
      const sortedPools = [...pools]
        .map((pool: any) => {
          console.log("Pool Data:", pool); // 🔍 Debug per vedere i dati reali
          return {
            address: pool.address,
            tokenName: pool.tokenName,
            tokenSymbol: pool.tokenSymbol,
            marketCap: pool.marketCap || 0,
            bondingCurve: pool.bondingCurve ?? pool.progress ?? 0, // Prova a usare progress se bondingCurve non c'è
            website: pool.website || "#",
          };
        })
        .filter(pool => pool.bondingCurve < 100) // Escludi quelli con bondingCurve al 100%
        .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
        .slice(0, 20); // Prendi solo i primi 20
      setRankedPools(sortedPools);
    } else {
      setRankedPools([]);
    }
  }, [pools]);

  return (
    <div>
      <div className="GlobalContainer launches-all-padding">
        <TopBar />
        <div className="max-w-7xl m-auto px-4 md:px-12">
          <div className="py-[32px] w-full h-auto mt-[70px] sm:mt-0">
            <h2 className="text-white text-center text-2xl font-bold mb-6">Ranking Top 20 Tokens</h2>
          </div>
          <div className="ranking-table">
           
            {loading ? (
              <div className="loadingBox">
                <ClipLoader color={'#afccc6'} loading={true} size={50} />
              </div>
            ) : rankedPools.length > 0 ? (
              rankedPools.map((pool, index) => (
                <RankingCard key={pool?.address || index} index={index + 1} pool={pool} />
              ))
            ) : (
              <div className="loadingBox">
                <p className="Text1" style={{ color: 'white' }}>No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Ranking;