import React, { useState } from 'react'
import PropTypes from 'prop-types'
import WebsiteIcon from '../icons/website.png'
import TwitterIcon from '../icons/x-icon.svg'
import TelegramIcon from '../icons/telegram.png'
import LaunchpadChangeUp from '../icons/launchpad-change-up.svg'
import LaunchpadChangeDown from '../icons/launchpad-change-down.svg'
import { Link } from 'react-router-dom'

const LaunchpadCard = ({
  progress,
  Liquidity,
  tokenName,
  Logo,
  chadAddress,
  depositedAmount,
  devAddress,
  marketCap,
  website,
  twitter,
  telegram,
  raisingPercent
}) => {
  const link = `/buy?token=${chadAddress}`
  const defaultLogo = '/logo.png'
  const [imgLogo, setImgLogo] = useState(Logo)
  if (progress > 100) {
    progress = 100
  }

  const SocialSection = ({ website, telegram, twitter }) => (
    <div className="social-section"    >
      {twitter && (
        <a href={`${twitter}`} target="_blank" rel="noopener noreferrer">
          <img src={TwitterIcon} alt="Twitter" className="social-icon" />
        </a>
      )}
      {telegram && (
        <a href={`${telegram}`} target="_blank" rel="noopener noreferrer">
          <img src={TelegramIcon} alt="Telegram" className="social-icon" />
        </a>
      )}
      {website && (
        <a href={website} target="_blank" rel="noopener noreferrer">
          <img src={WebsiteIcon} alt="Website" className="social-icon" />
        </a>
      )}
    </div>
  )

  return (
    <Link to={link}>
      <div className="launchpad-card overflow-hidden relative h-auto">
        {raisingPercent !== undefined && (
          <div
            className="launchpad-change-tag"
            style={{
              backgroundColor:
                raisingPercent >= 0 ? 'rgb(53, 255, 254)' : 'rgb(255, 74, 138)'
            }}
          >
            {raisingPercent >= 0 ? '+' : ''}
            {raisingPercent}%
            <img src={raisingPercent >= 0 ? LaunchpadChangeUp : LaunchpadChangeDown} alt="" />
          </div>
        )}
        <div className="p-4 sm:p-[20px] relative">
          <div className="flex flex-row justify-between items-center h-10">
            <img
              src={imgLogo}
              width={30}
              height={30}
              className="claim-card-logo"
              onError={() => setImgLogo(defaultLogo)}
              alt="Banner"
            />
            {website || telegram || twitter ? (
              <SocialSection
                website={website}
                telegram={telegram}
                twitter={twitter}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="launchpad-header-container">
            <p className="launchpad-token-name left-aligned">{tokenName}</p>
          </div>
          <div className="flex flex-row items-center gap-2 text-[12px]">
            <div className="text-[#00f3ef]">Created by:</div>
            <a href={'/profile?' + devAddress} className="text-[#00f3ef]">
              {devAddress.slice(0, 2) + '..' + devAddress.slice(-3)}
            </a>
          </div>

          <div className="launchpad-progress-container">
            <div className="launchpad-progress-text">
              Progress
              <span className="text-[#00f3ef] ml-1">
                ({Number(progress).toLocaleString()}%)
              </span>
            </div>
            <div className="launchpad-progress-bar">
              <div
                className="launchpad-progress-bar-filled"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <br />
          <div className="launchpad-addresses text-[#d3d3d3]">
            <span className="left-aligned">Volume</span>
            <span className="center-aligned">MC</span>
            <span className="right-aligned">LP</span>
          </div>
          <div className="launchpad-addresses text-[#fff]">
            <span className="left-aligned">
              <b>${Math.round(depositedAmount).toLocaleString()}</b>
            </span>
            <span className="center-aligned">
              <b>${Math.round(marketCap).toLocaleString()}</b>
            </span>
            <span className="right-aligned">
              <b>${Math.round(Liquidity / 10 ** 18).toLocaleString()}</b>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

LaunchpadCard.propTypes = {
  progress: PropTypes.number.isRequired,
  Liquidity: PropTypes.number.isRequired,
  tokenName: PropTypes.string.isRequired,
  raisingPercent: PropTypes.number.isRequired
}

LaunchpadCard.defaultProps = {
  RugProof: false,
  AllIn: false
}

export default LaunchpadCard
