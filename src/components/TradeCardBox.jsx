import React, { useState, useMemo, useEffect } from "react";
import { ConnectButton, useCurrentWallet } from "@mysten/dapp-kit";
import { useApp } from "../context";
import { useTrade } from "../hooks/index.ts";

import ClipLoader from 'react-spinners/ClipLoader'
import SuiIcon from '../icons/sui.png'
import cetusBannerImg from '../icons/cetus-banner.png'
import swapIcon from '../icons/swapIcon.svg'
import { PumpConfig } from "../config.jsx";

const TradeCardBox = ({ token, lpCreated, tokenAddress, tokenLogo, tokenSymbol, realSuiReserves }) => {
  const maxBuyAmount = useMemo(() => {
    return Math.ceil(Number(PumpConfig.Threshod) - realSuiReserves) / 1000000000 + 0.1
  }, [realSuiReserves])
  const { isConnected } = useCurrentWallet()
  const { state } = useApp()
  const { buy, getEstimateOut, ouput, loading } = useTrade(token)

  const { suiBalance: suiBalanceDecimal, tokenBalances } = state
  const suiBalance = useMemo(() => {
    if (!suiBalanceDecimal) return 0
    return Math.round(suiBalanceDecimal / 1000000) / 1000
  }, [suiBalanceDecimal])

  const tokenBalance = useMemo(() => {
    if (tokenBalances) {
      const tokenBalance = tokenBalances.filter((item) => item.coinType == token)
      if (tokenBalance.length > 0) {
        return Math.round(tokenBalance[0].totalBalance / 1000) / 1000
      }
    }
    return 0
  }, [tokenBalances])

  const [inputTokenType, setInputToken] = useState('SUI')
  const chanageCurrency = async () => {
    if (inputTokenType === 'SUI') {
      setInputToken('Token')
      setInputAmount('')
    } else {
      setInputToken('SUI')
      setInputAmount('')
    }
  }

  const [inputAmount, setInputAmount] = useState()
  const [debouncedAmount, setDebouncedAmount] = useState(inputAmount);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(inputAmount);
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputAmount]);

  useEffect(() => {
    getEstimateOut(inputTokenType, debouncedAmount)
  }, [inputTokenType, debouncedAmount])

  const setMaxAmount = async () => {
    if (inputTokenType === 'SUI') {
      setInputAmount(suiBalance > 0.1 ? suiBalance - 0.1 > maxBuyAmount ? maxBuyAmount : suiBalance - 0.1 : 0)
    } else {
      setInputAmount(Math.floor(tokenBalance * 100) / 100)
    }
  }

  const handleTrade = () => {
    buy(inputTokenType, inputAmount)
  }

  return lpCreated ? (
    <a
      href={`https://app.cetus.zone/swap?from=${tokenAddress}&to=0x2::sui::SUI`}
      target="_blank"
    >
      <div className="overflow-hidden rounded-[25px] sm:mx-0 mx-[-15px]">
        <img src={cetusBannerImg} className="cetus-banner" alt="Cetus Banner" />

      </div>
    </a>
  ) : (
    <div className="claim-card p-6">
      <header className="flex justify-between">
        <span className="text-white text-[20px] font-bold">
          Swap
        </span>
      </header>
      <section className="flex flex-col gap-6 mt-4">
        <div className="swap-cards-container ">
          <div className="flex flex-col gap-1 relative">
            <div className="w-full rounded-[16px] bg-[#1A1A1A] px-4 py-6 flex justify-between">
              <div className="flex gap-[16px] items-center">
                <img
                  alt="token icon"
                  fetchpriority="high"
                  width="40"
                  height="40"
                  decoding="async"
                  data-nimg="1"
                  className="flex-shrink-0 w-10 h-10 rounded-full"
                  src={inputTokenType === 'SUI' ? SuiIcon : tokenLogo}
                  onError={event => {
                    event.target.src = '/logo.png'
                    event.target.onerror = null
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-[#919191] text-[12px] font-semibold">
                    From
                  </span>
                  <span className="text-white text-[20px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                    {inputTokenType == 'SUI' ? 'SUI' : tokenSymbol.length > 4 ? `${tokenSymbol.slice(0, 3)}...` : tokenSymbol}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <input
                  type="number"
                  placeholder="0"
                  className="placeholder:text-[#919191] bg-transparent max-w-[180px] focus:outline-none text-white text-[20px] font-bold text-right h-6"
                  value={inputAmount}
                  onChange={e => {
                    if (inputTokenType == "SUI") {
                      if (Number(e.target.value) < Number(18446744073709551615n / 1000000000n)) setInputAmount(e.target.value > maxBuyAmount ? maxBuyAmount : e.target.value)
                    }
                    else {
                      if (Number(e.target.value) < Number(18446744073709551615n / 1000000n)) setInputAmount(e.target.value)
                    }
                  }}
                  required
                />
                <div className="flex gap-2 items-center">
                  <span className="text-[#919191] text-[12px] font-semibold flex gap-1 text-end">
                    Balance: &nbsp;
                    {Number(inputTokenType === 'SUI' ? suiBalance : tokenBalance).toLocaleString()}
                    <div
                      className="cursor-pointer text-[#f3cc2f]"
                      onClick={setMaxAmount}
                    >
                      Max
                    </div>
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full rounded-[16px] bg-[#1A1A1A] px-4 py-6 flex justify-between">
              <div className="flex gap-[16px] items-center">
                <img
                  alt="token icon"
                  fetchpriority="high"
                  className="flex-shrink-0 w-10 h-10 rounded-full"
                  width="40"
                  height="40"
                  src={inputTokenType !== 'SUI' ? SuiIcon : tokenLogo}
                  onError={event => {
                    event.target.src = '/logo.png'
                    event.target.onerror = null
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-[#919191] text-[12px] font-semibold">
                    To
                  </span>
                  <span className="text-white text-[20px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                    {inputTokenType == 'Token' ? 'SUI' : tokenSymbol.length > 4 ? `${tokenSymbol.slice(0, 3)}...` : tokenSymbol}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <input
                  placeholder="0"
                  label=""
                  type="number"
                  value={ouput}
                  className="text-[#919191] text-right text-[20px] font-bold h-6"
                  disabled
                />
                <div className="flex gap-2 items-center">
                  <span className="text-[#919191] text-[12px] font-semibold text-end">
                    Balance: &nbsp;
                    {Number(inputTokenType !== 'SUI' ? suiBalance : tokenBalance).toLocaleString()}{' '}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              onClick={chanageCurrency}
            >
              <img
                alt="swap"
                loading="lazy"
                width="42.5"
                height="40"
                decoding="async"
                data-nimg="1"
                src={swapIcon}
              />
            </button>
          </div>
        </div>
        {!isConnected ? (
          <div>
            <ConnectButton className='w-full h-12' style={{
              backgroundColor: '#cd8e60',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
            }} />
          </div>
        ) : (
          <button
            onClick={handleTrade}
            className="text-[16px] focus:outline-none h-[48px] flex justify-center items-center select-none font-bold text-center w-full bg-[#cd8e60] hover:opacity-90 disabled:bg-[#646464] disabled:text-[#bbb] rounded-[8px] text-white"
            disabled={(Number(inputAmount) > 0 && (inputTokenType === 'SUI' ? suiBalance >= Number(inputAmount) : tokenBalance >= Number(inputAmount)) ? false : true) || loading
            }
          >
            {loading ?
              <ClipLoader
                color={'#222'}
                loading={loading}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
              /> :
              inputTokenType == 'SUI' ? 'Buy' : 'Sell'
            }
          </button>
        )}
      </section>
    </div>
  )
}

export default TradeCardBox