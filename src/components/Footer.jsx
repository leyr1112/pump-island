import React from 'react';
import textLogo from '../assets/logo_popisland.png';

const Footer = () => {
  return (
    <section className="p-12 border-t-zinc-800" >
      <div className='max-w-7xl m-auto bg-[#1d1d1d] rounded-lg p-6'>
        <div className="flex justify-center items-center">
          <img src={textLogo} className='mb-4 w-[450px] h-auto' alt="Logo" />
        </div>
        <p>
          <span className="text-[12px] text-white">
          Disclaimer: Digital assets are highly speculative and involve significant risk of loss. The value of meme coins is extremely volatile, and anyone who wishes to trade in any meme coin should be prepared for the possibility of losing their entire investment. PumpIsland, a platform developed by PopIsland, makes no representations or warranties regarding the success or profitability of any meme coin developed on the platform. PumpIsland is a public, decentralized, and permissionless platform. Participation by any project should not be seen as an endorsement or recommendation by PumpIsland or PopIsland. Users should carefully assess their financial situation, risk tolerance, and conduct thorough research (DYOR) before trading in any meme coins on the platform. PopIsland and PumpIsland will not be held liable for any losses, damages, or issues that may arise from trading in any meme coins developed on the platform. For more information on (DYOR), visit Binance Academy and our Terms of Use.
          </span>
        </p>
        <p className='mt-5'>
          <span className="chadfun text-white">
            (C) 2025 PumpIsland | All rights reserved
          </span>
        </p>
      </div>
    </section>
  );
};

export default Footer;