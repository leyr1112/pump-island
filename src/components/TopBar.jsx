import React, { useState, useEffect, useMemo } from 'react';
import { ConnectButton, useCurrentWallet } from '@mysten/dapp-kit';
import iconHamburger from '../icons/hamburger.svg';
import iconCross from '../icons/cross-icon.svg';
import iconTg1 from '../icons/tg-1.svg';
import iconX1 from '../icons/x-1.svg';
import logo from '../icons/logo.png';
import ChadHeaderLink from '../components/ChadHeaderLink';
import { Link } from 'react-router-dom';
import { useApp } from '../context';

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
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-[#1d1d1d]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl m-auto w-full lg:h-[70px] flex items-center justify-between px-4">
        {/* Logo e collegamenti principali */}
        <div className="flex items-center">
          <ChadHeaderLink className="w-[50px] h-[50px] mr-4" />
          <div
            className="lg:flex hidden flex-row gap-4"
            style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
          >
            <Link to="/dashboard" className="left-bar-link">
              <span
                className={`text-[20px] ${
                  currentPath === '/' || currentPath === '/dashboard'
                    ? 'text-[#f3f3f3]'
                    : 'text-[#8b8b8b] hover:text-[#f3f3f3]'
                }`}
              >
                Board
              </span>
            </Link>
            <Link to="/create" className="left-bar-link">
              <span
                className={`text-[20px] ${
                  currentPath === '/create'
                    ? 'text-[#f3f3f3]'
                    : 'text-[#8b8b8b] hover:text-[#f3f3f3]'
                }`}
              >
                Create&nbsp;Token
              </span>
            </Link>
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
           <ConnectButton
    style={{
      backgroundColor: '#cd8e60 ',
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
              className={`text-[20px] ${
                currentPath === '/' || currentPath === '/dashboard'
                  ? 'text-[#e2fea5]'
                  : 'text-[#f8ffe8] hover:text-[#e2fea5]'
              }`}
            >
              Board
            </Link>
            <Link
              to="/create"
              className={`text-[20px] ${
                currentPath === '/create'
                  ? 'text-[#e2fea5]'
                  : 'text-[#f8ffe8] hover:text-[#e2fea5]'
              }`}
            >
              Create&nbsp;Token
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TopBar;
