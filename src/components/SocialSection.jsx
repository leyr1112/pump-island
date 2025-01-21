import React, { } from "react";
import WebsiteIcon from '../icons/website.png'
import TwitterIcon from '../icons/x-icon.svg'
import TelegramIcon from '../icons/telegram.png'

export const SocialSection = ({ website, telegram, twitter }) => (
  <div
    className="buy-social-section"
    style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}
  >
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