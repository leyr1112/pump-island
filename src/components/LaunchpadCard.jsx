import React, { useState } from 'react'
import PropTypes from 'prop-types'
import WebsiteIcon from '../icons/website.png'
import TwitterIcon from '../icons/x-icon.svg'
import TelegramIcon from '../icons/telegram.png'
import { Link } from 'react-router-dom'
import { useGetBoost } from '../hooks/index.ts'
import boostr from '../icons/boost.gif'

const LaunchpadCard = ({
  progress,
  liquidity,
  tokenName,
  Logo,
  tokenAddress,
  devAddress,
  marketCap,
  website,
  twitter,
  telegram,
  poolCompleted
}) => {
  const { boostStatus } = useGetBoost(tokenAddress)
  const link = `/trade?token=${tokenAddress}`
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
        {poolCompleted && (
          <div
            className="launchpad-change-tag text-white font-bold text-center px-4 py-2 rounded-full shadow-lg animate-pulse"
            style={{
              background: 'linear-gradient(90deg, #1e3a8a, #ffd700)',
              boxShadow: '0 0 15px #1e3a8a, 0 0 25px #ffd700',
              animation: 'pulse-border 2s infinite',
            }}
          >
            COMPLETED
          </div>
        )}

        <div className="p-5 sm:p-[20px] relative">
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
          <div className="launchpad-header-container flex items-center gap-2">
            <div>
              <p className="launchpad-token-name left-aligned">{tokenName}</p>
            </div>
            {boostStatus > 0 && progress < 100 && (
              <div className="flex items-center bg-transparent rounded-full px-4 h-6">
                <div
                  className="flex gap-1 items-center text-[11px] font-semibold p-1 px-2 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #1e3a8a, #ffd700)',
                  }}
                >
                  <p
                    className="text-[16px] md:text-[18px] font-bold animate-pulse"
                    style={{
                      color: '#ffffff',
                      textShadow: '0 0 5px #ffffff, 0 0 10px #ffffff',
                      WebkitTextStroke: '0.5px #000000',
                    }}
                  >
                    {boostStatus}
                  </p>
                  <img
                    src={boostr}
                    alt="Boost Icon"
                    className="w-[20px] h-[20px] md:w-[30px] md:h-[30px] animate-bounce"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="launchpad-progress-container">
            <div className="launchpad-progress-text">
              Progress
              <span className="text-[#cd8e60] ml-1">
                ({Number(progress).toLocaleString()}%)
              </span>
            </div>
            <div className="launchpad-progress-bar overflow-hidden">
              <div
                className="launchpad-progress-bar-filled"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <br />

          {/* Addresses Section */}
          <div className="launchpad-addresses text-[#d3d3d3] flex justify-between items-center">
            <span className="left-aligned">MC</span>
            {progress === 100 && boostStatus > 0 && (
              <div
                className="flex gap-1 items-center text-[11px] font-semibold p-1 px-2 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #1e3a8a, #ffd700)',
                }}
              >
                <p
                  className="text-[16px] md:text-[18px] font-bold animate-pulse"
                  style={{
                    color: '#ffffff',
                    textShadow: '0 0 5px #ffffff, 0 0 10px #ffffff',
                    WebkitTextStroke: '0.5px #000000',
                  }}
                >
                  {boostStatus}
                </p>
                <img
                  src={boostr}
                  alt="Boost Icon"
                  className="w-[20px] h-[20px] md:w-[30px] md:h-[30px] animate-bounce"
                />
              </div>
            )}
            <span className="right-aligned">LP</span>
          </div>

          <div className="launchpad-addresses text-[#fff] flex justify-between items-center">
            <span className="left-aligned">
              <b>${Math.round(marketCap).toLocaleString()}</b>
            </span>
            <span className="right-aligned">
              <b>${(Math.round(liquidity * 1000) / 1000).toLocaleString()}</b>
            </span>
          </div>
        </div>
      </div>

    </Link>
  )
}

LaunchpadCard.propTypes = {
  progress: PropTypes.number.isRequired,
  liquidity: PropTypes.number.isRequired,
  tokenName: PropTypes.string.isRequired,
}

LaunchpadCard.defaultProps = {
  RugProof: false,
  AllIn: false
}

export default LaunchpadCard
