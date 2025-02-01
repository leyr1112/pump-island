import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { SocialSection } from './SocialSection'
import { Link } from 'react-alice-carousel'
import { POP, ScanUrl } from '../config'
import sui from '../icons/sui.png'
import { useGetBoost, useGetTokenBalance } from '../hooks/index.ts'
import {
  ConnectButton,
  useCurrentAccount,
  useCurrentWallet
} from '@mysten/dapp-kit'
import { useApp } from '../context/index.jsx'
import toast from 'react-hot-toast'
import boostr from '../icons/boost.gif'

const ClaimCard = ({
  tokenName,
  Logo,
  tokenSymbol,
  website,
  telegram,
  twitter,
  volume,
  description,
  progress,
  marketCap,
  liquidity,
  tokenSuiPrice,
  tokenAddress
}) => {
  const { isConnected } = useCurrentWallet()
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const { boost, boostStatus, boostWithPop } = useGetBoost(tokenAddress)
  const { state } = useApp()
  const { tokenBalance: popBalance } = useGetTokenBalance(POP)
  const maxSuiBalance = state.suiBalance > 100000000 ? state.suiBalance - 100000000 : 0

  const [isPop, setPop] = useState(false)

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="flex flex-col relative rounded-[25px] bg-[#090909] z-2 !rounded-b-none p-6 gap-[16px]">
          <div className="flex justify-between gap-4 flex-col md:flex-row">
            <div className="flex gap-4 items-center">
              {Logo}
              <div className="flex flex-col gap-0">
                <span className="text-white font-bold text-[28px]">
                  {tokenName} ({tokenSymbol})
                </span>
                <span className="font-semibold text-[#919191] text-[18px]">
                  Contract:{' '}
                  <a
                    href={`${ScanUrl.Coin}${tokenAddress}`}
                    target="_blank"
                    className="text-[#cd8e60]"
                  >
                    {tokenAddress.slice(0, 8)}...{tokenAddress.slice(-3)}
                  </a>
                </span>
              </div>
            </div>
            <SocialSection
              website={website}
              telegram={telegram}
              twitter={twitter}
            />
          </div>

          <div className=" font-light text-white text-[16px]">
            {description}
          </div>

          <div className="launchpad-progress-container bg-[#1d1d1d] p-4 rounded-[16px] flex flex-col gap-6  " >
            <div className="h-6">
              <p
                className="hover:text-[#cd8e60] flex justify-center items-center  "
                style={{
                  color: '#cd8e60', // Testo oro
                  transition: 'color 0.3s ease', // Transizione colore al hover
                }}

              >Bonding Curve </p>
              <div className="relative w-full h-full bg-[#00f3ef17] rounded-[16px]">
                <div
                  className=" items-center overflow-hidden rounded-[16px] launchpad-progress-bar-filled h-full mt-[6px]"
                  style={{ width: `${progress}%` }}
                ></div>
                <span className="select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[16px]">
                  {progress.toFixed(3)}%
                </span>
              </div>
            </div>
            <div className="flex justify-center items-center mt-[20px]">
              <button
                className="text-[16px] focus:outline-none h-[36px] flex justify-center items-center select-none font-bold text-center px-6 bg-transparent border rounded-[8px] transition"
                style={{
                  color: '#ffd700', // Testo oro
                  border: '2px solid transparent', // Bordi trasparenti inizialmente
                  borderImage: 'linear-gradient(90deg, #1e3a8a, #ffd700) 1', // Gradiente blu e oro
                  background: 'linear-gradient(#1d1d1d, #1d1d1d) padding-box, linear-gradient(90deg, #1e3a8a, #ffd700) border-box', // Effetto sfondo blu e oro
                }}
                onClick={handleClick}
              >

                <p
                  className="hover:text-[#1e3a8a]"
                  style={{
                    color: '#ffd700', // Testo oro
                    transition: 'color 0.3s ease', // Transizione colore al hover
                  }}
                >
                  BOOST
                </p>
              </button>

            </div>

            <div className="h-6">
              <p
                className="hover:text-[#1e3a8a] flex justify-center items-center "
                style={{
                  color: '#ffd700', // Testo oro
                  transition: 'color 0.3s ease', // Transizione colore al hover
                }}

              >Tsuinami Wave </p>
              <div className="relative w-full h-full bg-[#00f3ef17] rounded-[16px]">
                <div
                  className=" items-center overflow-hidden rounded-[16px] launchpad-progress-bar-wave-filled h-full mt-[6px]"
                  style={{ width: `${Math.floor((progress * 2 > 100 ? 100 : progress * 2) * 1000) / 1000}%` }}
                ></div>

                <span className="select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[16px]">

                  {Math.floor((progress * 2 > 100 ? 100 : progress * 2) * 1000) / 1000}%
                </span>
              </div>
            </div>
            <div className="fields flex justify-between flex-col md:flex-row mt-3">
              <div className="flex gap-1 flex-row md:flex-col place-content-between items-center">
                <span className="font-semibold text-[#999999] text-[12px]">
                  Price
                </span>
                <span className="font-bold text-white text-[20px]">
                  {tokenSuiPrice.toFixed(9)} SUI
                </span>
              </div>
              <div className="flex gap-1 flex-row md:flex-col place-content-between items-center">
                <span className="font-semibold text-[#999999] text-[12px]">
                  MC
                </span>
                <span className="font-bold text-white text-[20px]">
                  ${marketCap.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-1 flex-row md:flex-col place-content-between items-center">
                <span className="font-semibold text-[#999999] text-[12px]">
                  VL
                </span>
                <span className="font-bold text-white text-[20px]">
                  ${liquidity.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-1 flex-row md:flex-col place-content-between items-center">
                <span className="font-semibold text-[#999999] text-[12px]">
                  Volume
                </span>
                <span className="font-bold text-white text-[20px]">
                  ${(volume * state.suiPrice / 10 ** 9).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="rounded-lg shadow-lg p-4 sm:p-6 w-[95%] max-w-2xl mx-4 max-h-screen overflow-y-auto"
            style={{
              border: '4px solid transparent',
              borderImage: 'linear-gradient(90deg, #1e3a8a, #ffd700) 1',
              background: 'linear-gradient(#1d1d1d, #1d1d1d) padding-box, linear-gradient(90deg, #1e3a8a, #ffd700) border-box',
            }}
          >
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#ffd700] text-center">
              Give {tokenName} a Boost
            </h2>
            <p className="mb-2 text-white text-center text-sm sm:text-base">
              Showcase your support, boost Trending Score and unlock the Golden Ticker!
            </p>
            <div className='flex justify-center mb-2 gap-2'>
              <div className={`${!isPop ? 'text-black' : 'text-[#ffd700]'} ${isPop ? 'bg-transparent' : 'bg-[#ffd700]'} border border-[#1e3a8a] rounded-lg px-4 py-2 cursor-pointer`} onClick={() => { setPop(false) }}>
                SUI
              </div>
              <div className={`${isPop ? 'text-black' : 'text-[#ffd700]'} ${!isPop ? 'bg-transparent' : 'bg-[#ffd700]'} border border-[#1e3a8a] rounded-lg px-4 py-2 cursor-pointer`} onClick={() => { setPop(true) }}>
                POP
              </div>
            </div>
            <p className="mb-4 text-[#ffd700] text-center font-semibold text-sm sm:text-base">
              Choose a boost pack
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center">
              {!isConnected ? (
                <>
                  <div></div>
                  <div className="flex items-center justify-center h-full">
                    <ConnectButton />
                  </div>
                  <div></div>
                </>
              ) : (
                <>
                  {[ // Boost Pack Configuration
                    { multiplier: '10x', price: 1.79, boostValue: 1799000000, boostPopValue: 179900000 },
                    { multiplier: '30x', price: 4.49, boostValue: 4490000000, boostPopValue: 449000000 },
                    { multiplier: '50x', price: 7.19, boostValue: 7190000000, boostPopValue: 719000000 },
                    { multiplier: '100x', price: 13.49, boostValue: 13490000000, boostPopValue: 1349000000 },
                    { multiplier: '500x', price: 64.79, boostValue: 64790000000, boostPopValue: 6479000000 },
                  ].map((pack, index) => (
                    <button
                      key={index}
                      className="bg-transparent text-[#ffd700] border border-[#1e3a8a] rounded-lg px-3 py-4 hover:bg-[#1e3a8a33] transition w-full"
                      onClick={() => {
                        if (!isPop) {
                          if (maxSuiBalance < pack.boostValue) {
                            toast.error('Insufficient sui balance!');
                            return;
                          }
                          boost(pack.boostValue, index);
                        } else {
                          if (popBalance < pack.boostPopValue) {
                            toast.error('Insufficient pop balance!');
                            return;
                          }
                          boostWithPop(pack.boostValue, index);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <img
                          src={boostr}
                          alt="Boost Icon"
                          className="w-[50px] sm:w-[70px] h-[50px] sm:h-[70px]"
                        />
                        <span className="text-[#ffd700] text-base sm:text-lg font-bold">
                          {pack.multiplier}
                        </span>
                      </div>
                      <span className="text-white text-xs sm:text-sm">24 hours</span>
                      <br />
                      <span className="text-white flex items-center justify-center text-sm sm:text-base font-bold">
                        {!isPop ? pack.price : pack.boostPopValue / 1000000}{' '}
                        {!isPop ? <img
                          src={sui}
                          className="w-[12px] sm:w-[15px] h-[12px] sm:h-[15px] ml-1"
                          alt="SUI Icon"
                        /> : <img
                          src="https://api.movepump.com/uploads/immagine_3_67b7728860.png"
                          className="w-[12px] sm:w-[15px] h-[12px] sm:h-[15px] ml-1"
                          alt="POP Icon"
                        />}
                      </span>
                    </button>
                  ))}
                </>
              )}
            </div>

            <div className="flex flex-col text-center w-full mt-6">
              <p className="text-[#ffd700] font-bold mb-2 text-sm sm:text-base">
                Golden Ticker unlocks at 500 boosts
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-transparent text-[#ffd700] border border-[#1e3a8a] rounded-lg px-4 py-2">
                  <span className="text-sm sm:text-lg font-bold">Boosts active</span>
                  <br />
                  <span className="text-sm sm:text-lg text-white">{boostStatus}</span>
                </div>
                <div className="bg-transparent text-[#ffd700] border border-[#1e3a8a] rounded-lg px-4 py-2">
                  <span className="text-sm sm:text-lg font-bold">Boosts needed</span>
                  <br />
                  <span className="text-sm sm:text-lg text-white">{500 - boostStatus}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleClick}
                className="bg-[#ffd700] text-[#1e3a8a] font-bold rounded-lg px-6 py-2 hover:bg-[#ffd700] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>



      )}
    </>
  )
}

ClaimCard.propTypes = {
  tokenName: PropTypes.string.isRequired,
  Logo: PropTypes.element.isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  tokenSupplyLiquidity: PropTypes.number,
  tokenPrice: PropTypes.number,
  website: PropTypes.string,
  telegram: PropTypes.string,
  twitter: PropTypes.string,
  volume: PropTypes.number,
  description: PropTypes.string,
  ethPriceL: PropTypes.string,
  lpCreated: PropTypes.bool
}

export default ClaimCard
