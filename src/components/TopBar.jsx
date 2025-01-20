import React, { useState, useEffect, useMemo } from 'react'
import { ConnectButton, useCurrentWallet } from '@mysten/dapp-kit'
import iconHamburger from '../icons/hamburger.svg'
import iconCross from '../icons/cross-icon.svg'
import iconTg1 from '../icons/tg-1.svg'
import iconX1 from '../icons/x-1.svg'
import iconChart1 from '../icons/chart-1.svg'
import logo from '../icons/logo.png'
import ChadHeaderLink from '../components/ChadHeaderLink'
import { Link } from 'react-router-dom'
import { useApp } from '../context'

const TopBar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { isConnected } = useCurrentWallet()
  const { state } = useApp()
  const suiBalance = useMemo(() => {
    return Math.round(state.suiBalance / 1000000) / 1000
  }, [state])
  const handleHamburgerClick = () => {
    setIsExpanded(!isExpanded)
  }

  useEffect(() => {
    // Add event listener for window resize
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsExpanded(false)
      }
    }

    window.addEventListener('resize', handleResize)
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  let currentPath = window.location.pathname

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 px-2 bg-[#0000009e]">
        <div
          className={`my-0 max-w-7xl m-auto w-full bg-[#00000000] rounded-[25px] lg:rounded-full lg:h-[70px] items-center ${isExpanded ? 'pb-2 px-2' : 'px-2'
            }`}
        >
          <div className="flex justify-between">
            <div className="flex flex-row items-center">
              <ChadHeaderLink className="w-[120px] h-[100px]" />
              <div
                className="lg:flex hidden flex-row gap-4"
                style={{ fontFamily: 'Bricolage Grotesque,  sans-serif' }}
              >
                <Link to="/dashboard" className="left-bar-link">
                  <span
                    className={
                      currentPath === '/' || currentPath === '/dashboard'
                        ? 'text-[20px] text-[#f3f3f3]'
                        : 'text-[20px] text-[#8b8b8b] hover:text-[#f3f3f3]'
                    }
                  >
                    Board
                  </span>
                </Link>
                <Link to="/create" className="left-bar-link">
                  <span
                    className={
                      currentPath === '/create'
                        ? 'text-[20px] text-[#f3f3f3]'
                        : 'text-[20px] text-[#8b8b8b] hover:text-[#f3f3f3]'
                    }
                  >
                    Create&nbsp;Token
                  </span>
                </Link>
                {/* <Link
                  to={'/profile/?address=' + address}
                  className="left-bar-link"
                >
                  <span
                    className={
                      currentPath.includes('/profile')
                        ? 'text-[20px] text-[#f3f3f3]'
                        : 'text-[20px] text-[#8b8b8b] hover:text-[#f3f3f3]'
                    }
                  >
                    Profile
                  </span>
                </Link> */}

                {/* <Link to="/about-us" className="left-bar-link">
                  <span
                    className={
                      currentPath === '/about-us'
                        ? 'text-[20px] text-[#f3f3f3]'
                        : 'text-[20px] text-[#8b8b8b] hover:text-[#f3f3f3]'
                    }
                  >
                    About
                  </span>
                </Link> */}
                {/* <Link to="/FAQ" className="left-bar-link">
                  <span
                    className={
                      currentPath === '/FAQ'
                        ? 'text-[20px] text-[#f3f3f3]'
                        : 'text-[20px] text-[#8b8b8b] hover:text-[#f3f3f3]'
                    }
                  >
                    FAQ
                  </span>
                </Link> */}
              </div>
            </div>
            <div className="flex flex-row items-center gap-4">
              <div className="sm:flex hidden flex-row gap-4">
                <a
                  href="https://x.com/BlackPumpofc"
                  target="_blank"
                  className="p-2  text-white"
                >
                  <img src={iconX1} className="w-[24px] h-[24px]" />
                </a>
                <a
                  href="https://t.me/blackpumpchat"
                  target="_blank"
                  className="p-2"
                >
                  <img src={iconTg1} className="w-[24px] h-[24px]" />
                </a>
              </div>
              <div className="navConnectButtonBox">
                {isConnected && <div className='text-white items-center mr-4 hidden md:flex'>{suiBalance} SUI</div>}
                <ConnectButton />
              </div>
              <button
                className="bg-black hover:bg-[#222] rounded-full p-2 flex lg:hidden"
                onClick={handleHamburgerClick}
              >
                <img
                  src={isExpanded ? iconCross : iconHamburger}
                  className="w-[32px] h-[32px]"
                />
              </button>
            </div>
          </div>
          {isExpanded && (
            <div
              className="relative bg-[#212121] rounded-[25px] flex flex-col gap-[10px] px-[32px] pt-[40px] pb-[160px] sm:p-[48px] w-full items-center overflow-hidden"
              style={{ transform: 'none', transformOrigin: '50% 50% 0px' }}
            >
              <div
                className="flex flex-col gap-4"
                style={{ fontFamily: 'Kanit, sans-serif' }}
              >
                <Link to="/dashboard" className="left-bar-link">
                  <span
                    className={
                      currentPath === '/' || currentPath === '/dashboard'
                        ? 'text-[20px] text-[#e2fea5]'
                        : 'text-[20px] text-[#f8ffe8] hover:text-[#e2fea5]'
                    }
                  >
                    Board
                  </span>
                </Link>
                <Link to="/create" className="left-bar-link">
                  <span
                    className={
                      currentPath === '/create'
                        ? 'text-[20px] text-[#e2fea5]'
                        : 'text-[20px] text-[#f8ffe8] hover:text-[#e2fea5]'
                    }
                  >
                    Create&nbsp;Token
                  </span>
                </Link>
                {/* <Link
                  to={'/profile/?address=' + address}
                  className="left-bar-link"
                >
                  <span
                    className={
                      currentPath.includes('/profile')
                        ? 'text-[20px] text-[#e2fea5]'
                        : 'text-[20px] text-[#f8ffe8] hover:text-[#e2fea5]'
                    }
                  >
                    Profile
                  </span>
                </Link>
                <Link to="/about-us" className="left-bar-link">
                  <span
                    className={
                      currentPath === '/about-us'
                        ? 'text-[20px] text-[#e2fea5]'
                        : 'text-[20px] text-[#f8ffe8] hover:text-[#e2fea5]'
                    }
                  >
                    About
                  </span>
                </Link>
                <Link to="/faq" className="left-bar-link">
                  <span
                    className={
                      currentPath === '/faq'
                        ? 'text-[20px] text-[#e2fea5]'
                        : 'text-[20px] text-[#f8ffe8] hover:text-[#e2fea5]'
                    }
                  >
                    Faq
                  </span>
                </Link> */}
              </div>
              <div className="sm:hidden flex flex-row gap-4">
                <Link to="#" target="_blank" className="p-2">
                  <img src={iconX1} className="w-[24px] h-[24px]" />
                </Link>
                <Link to="#" target="_blank" className="p-2">
                  <img src={iconTg1} className="w-[24px] h-[24px]" />
                </Link>
                <Link to="#" target="_blank" className="p-2">
                  <img src={iconChart1} className="w-[24px] h-[24px]" />
                </Link>
              </div>
              <div
                className="h-[240px] sm:h-[350px] absolute right-[-57px] bottom-[-72px] sm:right-[-97px] sm:bottom-[-115px]"
                style={{
                  transform: 'rotate(-34deg)',
                  transformOrigin: '50% 50% 0px',
                  aspectRatio: '1.0713153724247226 / 1'
                }}
              >
                <img src={logo} className="" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default TopBar
