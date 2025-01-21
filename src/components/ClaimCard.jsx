import React from 'react'
import PropTypes from 'prop-types'
import { SocialSection } from './SocialSection'
import { Link } from 'react-alice-carousel'
import { ScanUrl } from '../config'

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
  return (
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
                Contract: <a href={`${ScanUrl.Coin}${tokenAddress}`} target='_blank' className="text-[#cd8e60]">{tokenAddress.slice(0, 8)}...{tokenAddress.slice(-3)}</ a>
              </span>
            </div>
          </div>
          <SocialSection
            website={website}
            telegram={telegram}
            twitter={twitter}
          />
        </div>

        <div className=" font-light text-white text-[16px]">{description}</div>

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
          <div className="fields flex justify-between flex-col md:flex-row">
            <div className="flex gap-1 flex-row md:flex-col place-content-between items-center">
              <span className="font-semibold text-[#999999] text-[12px]">Price</span>
              <span className="font-bold text-white text-[20px]">
                ${new Intl.NumberFormat().format(tokenSuiPrice)}
              </span>
            </div>
            <div className="flex gap-1 flex-row md:flex-col place-content-between items-center">
              <span className="font-semibold text-[#999999] text-[12px]">MC</span>
              <span className="font-bold text-white text-[20px]">
                ${new Intl.NumberFormat().format(marketCap)}
              </span>
            </div>
            <div className="flex gap-1 flex-row md:flex-col place-content-between items-center">
              <span className="font-semibold text-[#999999] text-[12px]">VL</span>
              <span className="font-bold text-white text-[20px]">
                ${liquidity.toLocaleString()}
              </span>
            </div>
            <div className="flex gap-1 flex-row md:flex-col place-content-between items-center">
              <span className="font-semibold text-[#999999] text-[12px]">Volume</span>
              <span className="font-bold text-white text-[20px]">
                ${(volume / 10 ** 18).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
