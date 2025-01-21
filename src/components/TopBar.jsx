import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton, useCurrentWallet } from '@mysten/dapp-kit';
import { useApp } from '../context';
import iconHamburger from '../icons/hamburger.svg';
import iconCross from '../icons/cross-icon.svg';
import iconTg1 from '../icons/tg-1.svg';
import iconX1 from '../icons/x-1.svg';
import ChadHeaderLink from '../components/ChadHeaderLink';

const TopBar = () => {
  const [isExpanded, setIsExpanded] = useState(false); // Stato del menu mobile
  const [isScrolled, setIsScrolled] = useState(false); // Stato per il colore della barra superiore
  const { isConnected } = useCurrentWallet();
  const { state } = useApp();

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

  let currentPath = window.location.pathname;

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#1d1d1d]' : 'bg-transparent'}`}>
      <div className="max-w-7xl m-auto w-full h-[70px] flex items-center justify-between px-4">
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
            className="bg-black hover:bg-[#222] rounded-full p-2 flex lg:hidden"
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
          </nav>
        </div>
      )}
    </div>
  );
};

export default TopBar;
