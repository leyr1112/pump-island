import React, { useState } from 'react'
import PropTypes from 'prop-types'
import WebsiteIcon from '../icons/website.png'
import TwitterIcon from '../icons/x-icon.svg'
import TelegramIcon from '../icons/telegram.png'
import { Link } from 'react-router-dom'
import { useGetBoost } from '../hooks/index.ts'
import FireImage from '../icons/boost.gif'

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
        {
          poolCompleted &&
          <div
            className="launchpad-change-tag"
            style={{
              backgroundColor:
                poolCompleted ? '#cd8e60' : 'rgb(255, 74, 138)'
            }}
          >
            COMPLETED
          </div>
        }

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
          <div className="launchpad-header-container flex items-center gap-2">
            <div><p className="launchpad-token-name left-aligned">{tokenName}</p></div>
            {
              boostStatus > 0 && <div className="flex items-center bg-trasparent rounded-full px-4 h-6">
               <div class="flex gap-0.5 items-center text-[11px] text-[#ffd700] font-semibold p-0.5 px-2 border  border-[#f3cc30] bg-[#facc1554] rounded-full">  <p className='text-[#ffd700]'  >{boostStatus}</p><svg class="w-3 h-3" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"></path></svg></div>
              
              </div>
            }
          </div>
          <div className="flex flex-row items-center gap-2 text-[16px]">
            <div className="text-[#cd8e60]">Created by:</div>
            <a href={'/profile?address=' + devAddress} className="text-[#cd8e60]">
              {devAddress.slice(0, 6) + '..' + devAddress.slice(-4)}
            </a>
          </div>

          <div className="launchpad-progress-container">
            <div className="launchpad-progress-text">
              Progress
              <span className="text-[#cd8e60  ] ml-1">
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
          <div className="launchpad-addresses text-[#d3d3d3]">
            <span className="left-aligned">MC</span>
            <span className="right-aligned">LP</span>
          </div>
          <div className="launchpad-addresses text-[#fff]">
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
