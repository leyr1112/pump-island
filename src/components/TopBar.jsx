import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { animated } from 'react-spring'
import { ConnectButton, useCurrentWallet } from '@mysten/dapp-kit';
import { useApp } from '../context';
import iconHamburger from '../icons/hamburger.svg';
import iconCross from '../icons/cross-icon.svg';
import iconTg1 from '../icons/tg-1.svg';
import iconX1 from '../icons/x-1.svg';
import ChadHeaderLink from '../components/ChadHeaderLink';
import { useGetBoost, useGetTradingTransactions, useGetPools } from '../hooks/index.ts';
import { format9 } from '../utils/format.ts';

const TopBar = () => {
  const [isExpanded, setIsExpanded] = useState(false); // Stato del menu mobile
  const [isScrolled, setIsScrolled] = useState(false); // Stato per il colore della barra superiore
  const { isConnected } = useCurrentWallet();
  const { state } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const defaultLogo = '/logo.png'

  const toggleCard = () => {
    setIsOpen(!isOpen);
  };

  // Calcolo del saldo SUI
  const suiBalance = useMemo(() => {
    return Math.round(state.suiBalance / 1000000) / 1000;
  }, [state]);

  // Gestore per il pulsante hamburger
  const handleHamburgerClick = () => {
    setIsExpanded(!isExpanded);
  };

  // Listener per lo scroll per cambiare il colore della barra superiore
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Listener per ridimensionare la finestra
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleImageError = event => {
    event.target.src = defaultLogo
    event.target.onerror = null
  }

  let currentPath = window.location.pathname;

  const { wholeTransactions } = useGetTradingTransactions()
  const { wholeBoostData } = useGetBoost()
  const boostedCoins = useMemo(() => {
    let boostData = []
    const currentTime = Date.now()
    const filteredDataWithDate = wholeBoostData.filter((item) => (item.parsedJson.end_time * 1000 >= currentTime && item.parsedJson.start_time * 1000 <= currentTime))
    if (filteredDataWithDate.length > 0) {
      filteredDataWithDate.forEach((item) => {
        const oldData = boostData.find(data => data.coinType == item.parsedJson.coin_type)
        if (oldData) {
          oldData.coinType = item.parsedJson.coin_type
          oldData.boostSum = Number(oldData.boostSum) + Number(item.parsedJson.boost)
        } else {
          boostData.push({
            coinType: item.parsedJson.coin_type,
            boostSum: Number(item.parsedJson.boost)
          })
        }
      })
    }
    let coins = []
    if (boostData.length > 0) {
      coins = boostData.sort((a, b) => b.boostSum - a.boostSum).slice(0, 5).map((item) => {
        return `${item.coinType}`
      })
    }
    return coins
  }, [wholeBoostData])

  const history = useMemo(() => {
    return wholeTransactions.filter((item) => boostedCoins.includes(item.parsedJson.token_address)).slice(0, 20)
  }, [boostedCoins, wholeTransactions])

  const { pools } = useGetPools()

  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#1d1d1d]' : 'bg-transparent'}`}>
        <div className={`top-bar ${history.length > 0 ? 'h-[47px]' : ''}`}>
          {history.length > 0 && (
            <div className="carousel-container">
              <div className="carousel-track">
                {history.map(
                  (item, i) => (
                    <animated.div>
                      <div className="carousel-card px-2" key={i}>
                        <p className="top-bar-address">
                          {item.sender.slice(0, 2) + item.sender.slice(-3)}
                        </p>
                        <p className={`text-${item.parsedJson.is_buy ? 'green-500' : 'red-500'} pl-3`}>
                          {item.parsedJson.is_buy ? '+' : '-'}
                        </p>
                        <p className="top-bar-description">
                          {format9(item.parsedJson.sui_amount)} SUI
                        </p>
                        <Link
                          className="top-bar-address flex items-center"
                          to={`/trade?token=0x${item.parsedJson.token_address}`}
                          rel="noreferrer"
                        >
                          <span className="">
                            {item.parsedJson.token_address.slice(84, -1).length > 6 ? `${item.parsedJson.token_address.slice(84, -1).slice(0, 6)}` : item.parsedJson.token_address.slice(84, -1)}
                          </span>
                          <img
                            src={`${pools.find(pool => pool.address == `0x${item.parsedJson.token_address}`)?.logoUrl}` || defaultLogo}
                            width="32"
                            height="32"
                            alt="logo"
                            onError={handleImageError}
                            className="top-bar-token-icon rounded-full"
                          />
                        </Link>
                      </div>
                    </animated.div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
        <div className={`max-w-7xl m-auto w-full h-[70px] flex items-center justify-between px-4 ${history.length > 0 ? 'mt-[47px]' : ''}`}>
          <div className="flex items-center">
            <ChadHeaderLink className="w-[50px] h-[50px] mr-4" />
            <div
              className="lg:flex hidden flex-row gap-4"
              style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
            >
              <Link to="/dashboard" className="left-bar-link">
                <span
                  className={`text-[20px] ${currentPath === '/' || currentPath === '/dashboard'
                    ? 'text-[#cd8f61]'
                    : 'text-[#f6f7f9] hover:text-[#cd8f61]'
                    }`}
                >
                  Board
                </span>
              </Link>
              <Link to="/create" className="left-bar-link">
                <span
                  className={`text-[20px] ${currentPath === '/create'
                    ? 'text-[#cd8f61]'
                    : 'text-[#f6f7f9] hover:text-[#cd8f61]'
                    }`}
                >
                  Create&nbsp;Token
                </span>
              </Link>
              <div className="left-bar-link">
                <span
                  className={`text-[20px] ${currentPath === 'https://www.popisland.it/#/swap?chain=sui'
                    ? 'text-[#cd8f61]'
                    : 'text-[#f6f7f9] hover:text-[#cd8f61]'
                    }`}
                >
                  <a
                    href="https://www.popisland.it/#/swap?chain=sui"
                    target="_blank"
                    rel="noreferrer"

                  >
                    Swap
                  </a>
                </span>
              </div>
              <div className="left-bar-link">
                <span
                  className={`text-[20px] ${currentPath === 'https://www.popisland.it/#/bridge'
                    ? 'text-[#cd8f61]'
                    : 'text-[#f6f7f9] hover:text-[#cd8f61]'
                    }`}
                >
                  <a
                    href="https://www.popisland.it/#/bridge"
                    target="_blank"
                    rel="noreferrer"

                  >
                    Bridge
                  </a>
                </span>

              </div>
              <div className="left-bar-link">
                <span
                  className={`text-[20px] animate-pulse`}
                  style={{ color: isOpen ? '#cd8f61' : '#f3cc30' }}
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleCard();
                    }}
                    className="whitespace-nowrap"
                  >
                    How it works?
                  </a>
                </span>

                {isOpen && (
                  <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                      className="bg-[#1d1d1d] border-2 border-[#cd8e60] rounded-lg shadow-lg p-6 w-96"
                    >
                      <h2 className="text-xl font-bold mb-4 text-white">How it works</h2>
                      <p className="mb-2 text-white">
                        PumpIsland prevents rugs by making sure that all created tokens are safe.
                        Each coin on PumpIsland is a fair-launch with no presale and no team
                        allocation.
                      </p>
                      <ol className="list-decimal pl-5 mb-4 text-white">
                        <li>Pick a coin that you like</li>
                        <li>Buy the coin on the bonding curve</li>
                        <li>Sell at any time to lock in your profits or losses</li>
                        <li>
                          When enough people buy on the bonding curve and 1,800 SUI is raised
                          during the fair-launch
                        </li>
                        <li>The liquidity is then deposited in Cetus Dex</li>
                      </ol>
                      <button
                        onClick={toggleCard}
                        className="bg-[#cd8e60] text-white rounded-full px-4 py-2 mt-4 w-full hover:bg-[#b87450] transition"
                      >
                        OK
                      </button>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Icone social e pulsanti */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-row gap-4">
              <a
                href="https://x.com/popislandsui"
                target="_blank"
                rel="noreferrer"
                className="p-2 text-white"
              >
                <img src={iconX1} className="w-[24px] h-[24px]" alt="X" />
              </a>
              <a
                href="https://t.me/popislandsui"
                target="_blank"
                rel="noreferrer"
                className="p-2"
              >
                <img src={iconTg1} className="w-[24px] h-[24px]" alt="Telegram" />
              </a>
            </div>
            {/* Connect Button visibile sia su desktop che mobile */}
            <div className="flex items-center">
              {isConnected && (
                <div className="text-white items-center mr-4 hidden md:flex">
                  {suiBalance} SUI
                </div>
              )}
              <ConnectButton className='w-full h-12'
                style={{
                  backgroundColor: '#cd8e60',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                }}
              />
            </div>
            {/* Hamburger Menu Button */}
            <button
              className="  rounded-full p-2 flex lg:hidden"
              onClick={handleHamburgerClick}
            >
              <img
                src={isExpanded ? iconCross : iconHamburger}
                className="w-[32px] h-[32px]"
                alt="Menu"
              />
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isExpanded && (
          <div className="absolute top-full left-0 w-full bg-[#1d1d1d] text-white z-40 p-4 shadow-lg lg:hidden">
            <nav className="flex flex-col gap-4">
              <Link
                to="/dashboard"
                className={`text-[20px] ${currentPath === '/' || currentPath === '/dashboard'
                  ? 'text-[#cd8f61]'
                  : 'text-[#f6f7f9] hover:text-[#cd8f61]'
                  }`}
              >
                Board
              </Link>
              <Link
                to="/create"
                className={`text-[20px] ${currentPath === '/create'
                  ? 'text-[#cd8f61]'
                  : 'text-[#f6f7f9] hover:text-[#cd8f61]'
                  }`}
              >
                Create&nbsp;Token
              </Link>
              <span
                className={`text-[20px] ${currentPath === 'https://www.popisland.it/#/swap?chain=sui'
                  ? 'text-[#cd8f61]'
                  : 'text-[#f6f7f9] hover:text-[#cd8f61]'
                  }`}
              >
                <a
                  href="https://www.popisland.it/#/swap?chain=sui"
                  target="_blank"
                  rel="noreferrer"

                >
                  Swap
                </a>
              </span>
              <span
                className={`text-[20px] ${currentPath === 'https://www.popisland.it/#/bridge'
                  ? 'text-[#cd8f61]'
                  : 'text-[#f6f7f9] hover:text-[#cd8f61]'
                  }`}
              >
                <a
                  href="https://www.popisland.it/#/bridge"
                  target="_blank"
                  rel="noreferrer"

                >
                  Bridge
                </a>

              </span>

              <span
                className={`text-[20px] animate-pulse`}
                style={{ color: isOpen ? '#cd8f61' : '#f3cc30' }}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCard();
                  }}
                  className="whitespace-nowrap"
                >
                  How it works?
                </a>
              </span>

              {isOpen && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div
                    className="bg-[#1d1d1d] border-2 border-[#cd8e60] rounded-lg shadow-lg p-6 w-96"
                  >
                    <h2 className="text-xl font-bold mb-4 text-white">How it works</h2>
                    <p className="mb-2 text-white">
                      PumpIsland prevents rugs by making sure that all created tokens are safe.
                      Each coin on PumpIsland is a fair-launch with no presale and no team
                      allocation.
                    </p>
                    <ol className="list-decimal pl-5 mb-4 text-white">
                      <li>Pick a coin that you like</li>
                      <li>Buy the coin on the bonding curve</li>
                      <li>Sell at any time to lock in your profits or losses</li>
                      <li>
                        When enough people buy on the bonding curve and 1,800 SUI is raised
                        during the fair-launch
                      </li>
                      <li>The liquidity is then deposited in Cetus Dex</li>
                    </ol>
                    <button
                      onClick={toggleCard}
                      className="bg-[#cd8e60] text-white rounded-full px-4 py-2 mt-4 w-full hover:bg-[#b87450] transition"
                    >
                      OK
                    </button>
                  </div>

                </div>
              )}



            </nav>
          </div>
        )}
      </div >
    </>
  );
};

export default TopBar;
