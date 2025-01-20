import React, { useState } from 'react';
import textLogo from '../assets/logo_popisland.png';
import Cookies from 'universal-cookie';

const Footer = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const cookies = new Cookies();
  // Modal Section
  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen)
    cookies.set("show-how-it-works", "true")
  }

  const closeModal = e => {
    if (e.target.id === 'modal') {
      setModalIsOpen(false)
      cookies.set("show-how-it-works", "true")
    }
  }

  const modalContent = (
    <div
      id="modal"
      onClick={closeModal}
      className={`modal fixed inset-0 flex justify-center items-center z-50 ${
        modalIsOpen ? 'show-modal' : 'hidden'
      }`}
    >
      {/* Sfondo scuro traslucido */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={closeModal}
      ></div>
  
      {/* Contenuto del modal */}
      <div
        className="relative bg-[#f3f3f3] rounded-[25px] w-full max-w-[680px] p-[24px] max-h-[80vh] mt-16 overflow-auto"
      >
        <h1 className="text-center text-xl pb-2 font-extrabold">TERMS</h1>
        <p className="text-[#222] mb-4">&bull; Terms of Use</p>
        <p className="text-[#222] font-bold">Introduction</p>
        <p className="text-[#222] text-[14px] mb-4">
          Welcome to Blackpump.fun (hereinafter referred to as "the Platform").
          Before using the services provided by the Platform, please read and
          understand the following Terms of Use and Disclaimer (hereinafter
          referred to as "Terms"). By accessing and using this Platform, you
          confirm that you have read, understood, and agree to be bound by these
          Terms.
        </p>
  
        {/* Sections */}
        <p className="text-[#222] font-bold pt-2">1. Platform Services</p>
        <p className="text-[#222] text-[14px] mb-4">
          The Platform offers services related to the creation and trading of
          cryptocurrencies, including but not limited to token creation,
          transaction execution, and information querying.
        </p>
  
        <p className="text-[#222] font-bold pt-2">2. Eligibility</p>
        <p className="text-[#222] text-[14px] mb-4">
          Users of the Platform must be individuals who are at least 18 years of
          age or entities legally established. By using the Platform, you declare
          and warrant that you meet the above criteria.
        </p>
  
        <p className="text-[#222] font-bold pt-2">3. User Conduct</p>
        <p className="text-[#222] text-[14px] mb-4">
          All activities conducted by users on this Platform must comply with
          applicable laws, regulations, and rules. Any illegal use of the
          Platform, including but not limited to money laundering, fraud,
          infringement of others' intellectual property, or posting illegal
          information, is prohibited.
        </p>
  
        <p className="text-[#222] font-bold pt-2">4. Intellectual Property</p>
        <p className="text-[#222] text-[14px] mb-4">
          All content on this Platform, including texts, images, software,
          trademarks, and copyrights, are the property of platform or its
          licensors. Without the express written consent of the Platform, no one
          may copy, modify, or commercially use the above content.
        </p>
  
        <p className="text-[#222] font-bold pt-2">5. Limitation of Liability</p>
        <p className="text-[#222] text-[14px] mb-4">
          Platform and its affiliates shall not be liable for any indirect,
          incidental, special, or consequential damages, including but not
          limited to loss of profits or data. Users agree to indemnify and hold
          harmless Platform and its affiliates from any claims, damages, losses,
          or expenses arising from their violation of these terms and conditions
          or their violation of any law or the rights of any third party.
        </p>
  
        <p className="text-[#222] font-bold pt-2">6. Amendments to the Terms</p>
        <p className="text-[#222] text-[14px] mb-4">
          The Platform reserves the right to modify these Terms at any time. Any
          changes to the Terms will be posted on the Platform and will become
          effective on the date of posting. Continued use of the Platform's
          services will be deemed acceptance of the amended Terms.
        </p>
  
        <p className="text-[#222] font-bold pt-2">7. Contact Information</p>
        <p className="text-[#222] text-[14px] mb-4">
          If you have any questions about these Terms or the services of the
          Platform, please contact us at [contact email].
        </p>
  
        <p className="text-[#222] font-bold pt-2">Conclusion</p>
        <p className="text-[#222] text-[14px] mb-4">
          Thank you for choosing [Platform Name]. We hope these Terms clearly
          define our rights and obligations to ensure the healthy and sustained
          development of the Platform. If you continue to use this Platform, it
          signifies your acceptance of all the above Terms. Should there be any
          discrepancies between the translated version and the original version,
          the English version shall prevail.
        </p>
  
        <p className="text-[#222] mb-4">&bull; Terms of Use</p>
        <p className="text-[#222] text-[14px] mb-4">
          Digital assets are highly speculative and involve significant risk of
          loss. The value of meme coins is extremely volatile, and anyone who
          wishes to trade in any meme coin should be prepared for the possibility
          of losing their entire investment. BLACKPUMP.FUN makes no
          representations or warranties regarding the success or profitability of
          any meme coin developed on the platform. BLACKPUMP.FUN is a public,
          decentralized, and permissionless platform. Participation by any
          project should not be seen as an endorsement or recommendation by
          BLACKPUMP.FUN. Users should assess their financial situation, risk
          tolerance, and do their own research before trading in any meme coins
          on the platform. BLACKPUMP.FUN will not be held liable for any losses,
          damages, or issues that may arise from trading in any meme coins
          developed on the platform.
        </p>
  
        <div className="text-center mt-4">
          <button
            onClick={toggleModal}
            className="rounded-full bg-[#cd8e60] px-4 py-3 text-white"
          >
            I'm ready to pump
          </button>
        </div>
      </div>
    </div>
  );
  
  

  return (
    <section className=" p-12   border-t-zinc-800" >
      <style jsx>{`
        .modal {
          opacity: 0;
          visibility: hidden;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .show-modal {
          opacity: 1;
          overflow-y: scroll;
          visibility: visible;
        }
      `}</style>
      {modalContent}
      <div className='max-w-7xl m-auto bg-[#1d1d1d] rounded-lg p-6'>
  <div className="flex justify-center items-center">
    <img src={textLogo} className='mb-4 w-[450px] h-auto' alt="Logo" />
  </div>
  <p>
    <span className="text-[12px] text-white">
      Disclaimer: Digital assets are highly speculative and involve significant risk of loss. The value of meme coins is extremely volatile, and anyone who wishes to trade in any meme coin should be prepared for the possibility of losing their entire investment. BlackPump.fun makes no representations or warranties regarding the success or profitability of any meme coin developed on the platform. BlackPump.fun is a public, decentralized, and permissionless platform. Participation by any project should not be seen as an endorsement or recommendation by BlackPump.fun. Users should assess their financial situation, risk tolerance, and do their own research before trading in any meme coins on the platform. BlackPump.fun will not be held liable for any losses, damages, or issues that may arise from trading in any meme coins developed on the platform. More information about (DYOR) can be found via Binance Academy and
      <a onClick={toggleModal} className="text-[#cd8e60] cursor-pointer">{"\t"} Terms of Use.</a>
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