import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { SocialSection } from './SocialSection'
import { Link } from 'react-alice-carousel'
import { ScanUrl } from '../config'
import FireImage from '../icons/fire.png'
import { useGetBoost } from '../hooks/index.ts'
import { ConnectButton, useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit'

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

  const { boosting, boost, boostStatus } = useGetBoost(tokenAddress)

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

          <div className="launchpad-progress-container bg-[#1d1d1d] p-4 rounded-[16px] flex flex-col gap-6">
            <div className="h-6">
              <div className="relative w-full h-full bg-[#00f3ef17] rounded-[16px]">
                <div
                  className=" items-center overflow-hidden rounded-[16px] launchpad-progress-bar-filled h-full"
                  style={{ width: `${progress}%` }}
                ></div>
                <span className="select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[16px]">
                  {progress.toFixed(3)}%
                </span>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                className="text-[16px] focus:outline-none h-[36px] flex justify-center items-center select-none font-bold text-center px-6 bg-[#cd8e60] hover:opacity-90 disabled:bg-[#646464] disabled:text-[#bbb] rounded-[8px] text-white"
                onClick={handleClick}
              >
                <img src={FireImage} alt="boost icon" className="w-6 h-6" />
                Boost
              </button>
            </div>
            <div className="fields flex justify-between flex-col md:flex-row">
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
                  ${(volume / 10 ** 18).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#1d1d1d] border-2 border-[#cd8e60] rounded-lg shadow-lg p-6 w-100 mx-1">
            <h2 className="text-xl font-bold mb-4 text-white">
              Give MICKEY a Boost
            </h2>
            <p className="mb-2 text-white">
              Showcase your support, boost Trending Score and unlock the Golden
              Ticker!
            </p>
            <p className="mb-2 text-[#cd8e60]">Choose a boost pack</p>
            <div className="flex flex-row gap-1">
              {
                !isConnected ? <ConnectButton /> : (
                  <>
                    <button className="bg-[#cd8e60] text-white rounded-[8px] px-4 py-2 mt-4 w-full hover:bg-[#b87450] transition justify-items-center" onClick={() => { boost(1990000000, 0) }}>
                      <img src={FireImage} alt='boost icon' className='w-24' />
                      <span className='text-[20px]'>10x</span><br />
                      <span>24 hours</span><br />
                      <span>1.99 SUI</span>
                    </button>
                    <button className="bg-[#cd8e60] text-white rounded-[8px] px-4 py-2 mt-4 w-full hover:bg-[#b87450] transition justify-items-center"  onClick={() => { boost(4990000000, 0) }}>
                      <img src={FireImage} alt='boost icon' className='w-24' />
                      <span className='text-[20px]'>30x</span><br />
                      <span>24 hours</span><br />
                      <span>4.99 SUI</span>
                    </button>
                    <button className="bg-[#cd8e60] text-white rounded-[8px] px-4 py-2 mt-4 w-full hover:bg-[#b87450] transition justify-items-center"  onClick={() => { boost(7990000000, 0) }}>
                      <img src={FireImage} alt='boost icon' className='w-24' />
                      <span className='text-[20px]'>50x</span><br />
                      <span>24 hours</span><br />
                      <span>7.99 SUI</span>
                    </button>
                    <button className="bg-[#cd8e60] text-white rounded-[8px] px-4 py-2 mt-4 w-full hover:bg-[#b87450] transition justify-items-center"  onClick={() => { boost(14990000000, 0) }}>
                      <img src={FireImage} alt='boost icon' className='w-24' />
                      <span className='text-[20px]'>100x</span><br />
                      <span>24 hours</span><br />
                      <span>14.99 SUI</span>
                    </button>
                    <button className="bg-[#cd8e60] text-white rounded-[8px] px-4 py-2 mt-4 w-full hover:bg-[#b87450] transition justify-items-center"  onClick={() => { boost(71990000000, 0) }}>
                      <img src={FireImage} alt='boost icon' className='w-24' />
                      <span className='text-[20px]'>500x</span><br />
                      <span>24 hours</span><br />
                      <span>71.99 SUI</span>
                    </button>
                  </>
                )
              }
            </div>
            <div className='flex flex-col text-center w-full mt-4'>
              <div>
                <p className="mb-2 text-[#cd8e60]">Golden Ticker unlocks at 500 boosts</p>
              </div>
              <div className='flex gap-1'>
                <div className="bg-[#cd8e60] text-white rounded-[8px] px-4 py-2 mt-4 w-full transition justify-items-center">
                  <span className='text-[20px]'>Boosts active</span><br />
                  <span>{boostStatus}</span>
                </div>
                <div className="bg-[#cd8e60] text-white rounded-[8px] px-4 py-2 mt-4 w-full transition justify-items-center">
                  <span className='text-[20px]'>Boosts needed</span><br />
                  <span>{500 - boostStatus}</span>
                </div>
              </div>

            </div>
            <div className='flex justify-center'>
              <button
                onClick={handleClick}
                className="bg-[#cd8e60] text-white rounded-[8px] px-4 py-2 mt-4 hover:bg-[#b87450] transition"
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
