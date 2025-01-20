import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import '../styles/MainContainer.css'
import Footer from '../components/Footer.jsx'
import ClaimCard from '../components/ClaimCard.jsx'
import melegaBannerImg from '../icons/melega-banner.png'
import swapIcon from '../icons/swapIcon.svg'
import TopBar from '../components/TopBar.jsx'
import ClipLoader from 'react-spinners/ClipLoader'
import { useQueryParam, StringParam } from 'use-query-params'
import MyChart from '../components/Chart.jsx'
import { SignMessage } from './SignMessage.jsx'
import CustomRadioButton from '../components/CustomRadioButton.jsx'
import UpdateBox from '../components/profileUpdateBox.tsx'
import { useGetPool, useGetSuiBalance, useGetTokenBalance } from '../hooks/index.ts'
import SuiIcon from '../icons/sui.png'
import { ConnectButton, useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit'
import { format6 } from '../utils/format.ts'

const Trade = () => {
  const defaultLogo = '/logo.png'
  let [token] = useQueryParam('token', StringParam)

  const {
    tokenName,
    tokenSymbol,
    logoUrl: tokenLogo,
    Liquidity: virtualLp,
    website,
    twitter,
    telegram,
    poolObjectId: contractAddress,
    devAddress,
    description,
    suiPrice: ethPrice,
    tokenAddress,
    marketCap
  } = useGetPool(token)

  const lpCreated = false
  const { isConnected } = useCurrentWallet()
  const account = useCurrentAccount()
  const address = account?.address ?? undefined

  const [chatHistory, setChatHistory] = useState([])
  const [tokenHolders, setTokenHolders] = useState([])
  const [holderDatas, setTokenHolderDatas] = useState()
  const [transactions, setTransactions] = useState([])
  const [transactionDatas, setTransactionDatas] = useState([])
  const [tokenPriceDatas, setTokenPriceDatas] = useState([])
  const [volume, setVolume] = useState(0)

  const [chatContent] = useState('')

  const [buyAmount, setAmount] = useState()
  const [maxBuyAmount, setMaxBuyAmount] = useState(0)
  const [tokenOutAmount, setTokenOutAmount] = useState(0)

  const { suiBalance: suiBalanceDecimal } = useGetSuiBalance()
  const suiBalance = useMemo(() => {
    if (!suiBalanceDecimal) return 0
    return Math.round(suiBalanceDecimal / 1000000) / 1000
  }, [suiBalanceDecimal])

  const { tokenBalance: tokenBalanceDecimal, tokenDecimal } = useGetTokenBalance(token)

  const tokenBalance = useMemo(() => {
    if (!suiBalanceDecimal) return 0
    return Math.round(tokenBalanceDecimal / 1000) / 1000
  }, [tokenBalanceDecimal, tokenDecimal])

  const [virtualTokenLp, setVirtualTokenLp] = useState()
  const [tokenPrice, setTokenPrice] = useState(0)
  let [creating, setCreating] = useState(false)

  const [inputTokenType, setInputToken] = useState('SUI')

  const onTokenSwap = async () => { }

  const setMaxAmount = async () => {
    if (inputTokenType === 'SUI') {
      setAmount(suiBalance > 0.1 ? suiBalance - 0.1 : 0)
    } else {
      setAmount(tokenBalance)
    }
  }

  const chanageCurrency = async () => {
    if (inputTokenType === 'SUI') {
      setInputToken('Token')
      setAmount(tokenOutAmount)
    } else {
      setInputToken('SUI')
      setAmount(tokenOutAmount)
    }
  }

  const [selectedOption, setSelectedOption] = useState('Chat')

  const [currentTransactionPage, setCurrentTransactionPage] = useState(1)
  const [transactionTotalPages, setTransactionTotalPages] = useState(0)
  const transactionItemsPerPage = 5
  const [transactionPageNumbers, setTransactionPageNumbers] = useState([])

  const calculateTransactionPageNumbers = (totalPages, currentPage) => {
    let pages = []

    if (totalPages <= 4) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    } else {
      if (currentPage === 1) {
        pages = [1, 2, '...', totalPages - 1, totalPages]
      } else if (currentPage === totalPages) {
        pages = [1, 2, '...', totalPages - 1, totalPages]
      } else {
        if (currentPage + 1 < totalPages) {
          if (currentPage + 1 === totalPages - 1) {
            pages = [currentPage - 1, currentPage, currentPage + 1, totalPages]
          } else {
            pages = [
              currentPage - 1,
              currentPage,
              currentPage + 1,
              '...',
              totalPages
            ]
          }
        } else if (currentPage < totalPages) {
          pages = [currentPage - 1, currentPage, currentPage + 1]
        } else {
          pages = [1, 2, '...', totalPages - 1, totalPages]
        }
      }
    }

    return pages
  }

  const handleTransactionPageChange = newPageNumber => {
    setCurrentTransactionPage(newPageNumber)
    setTransactionPageNumbers(
      calculateTransactionPageNumbers(transactionTotalPages, newPageNumber)
    )
  }

  useEffect(() => {
    const totalPages = Math.ceil(
      transactionDatas.length / transactionItemsPerPage
    )
    setTransactionTotalPages(totalPages)
    setTransactionPageNumbers(
      calculateTransactionPageNumbers(totalPages, currentTransactionPage)
    )
  }, [transactionDatas])

  const poolDate = {
    poolAddress: token,
    description: description,
    website: website,
    twitter: twitter,
    telegram: telegram
  }

  const handleImageError = event => {
    event.target.src = '/logo.png'
    event.target.onerror = null // Prevents infinite loop in case the fallback image also fails to load
  }

  return (
    <div>
      <div className="GlobalContainer">
        <div style={{ zIndex: 1 }}>
          <TopBar />
          <div className="max-w-7xl m-auto pt-36 pb-24 px-4 sm:px-12 sm:py-10">
            <div className="flex flex-col lg:flex-row">
              <section className="w-full sm:p-[16px]">
                <div className="bg-[#090909] rounded-[25px] overflow-hidden">
                  <ClaimCard
                    tokenName={tokenName}
                    Logo={
                      <img
                        src={tokenLogo || defaultLogo}
                        className="claim-eth-logo"
                        onError={handleImageError} // Handle error if the image fails to load
                        alt={`${tokenName} logo`} // Provide an alt attribute for accessibility
                      />
                    }
                    tokenAddress={tokenAddress}
                    contractAddress={contractAddress}
                    dexAddress="https://app.uniswap.org/swap"
                    devAddress={devAddress}
                    tokenSymbol={tokenSymbol}
                    tokenDecimals={tokenDecimal}
                    tokenTotalSupply={1000000000}
                    maxBuyAmount={maxBuyAmount}
                    tokenSupplyUSD={format6(virtualLp)}
                    tokenSupplyLiquidity={virtualTokenLp}
                    tokenPrice={tokenPrice}
                    tokenUnsoldTokens={'Burned 🔥'}
                    tokenCover={``}
                    website={website}
                    telegram={telegram}
                    twitter={twitter}
                    volume={volume}
                    description={description}
                    ethPrice={ethPrice}
                    lpCreated={lpCreated}
                    marketCap={marketCap}
                  />
                  <div className="">
                    {lpCreated ? (
                      <iframe
                        src={`https://dexscreener.com/sui/${tokenAddress}?embed=1&trades=0&info=0&theme=light`}
                        className="chart"
                        title="chart"
                      />
                    ) : (
                      <MyChart data={tokenPriceDatas} ethPrice={ethPrice} />
                    )}
                  </div>

                  <div className="mt-6">
                    <div className="custom-radio-button-wrapper2 px-6">
                      <CustomRadioButton
                        value="Chat"
                        selectedValue={selectedOption}
                        handleSelect={setSelectedOption}
                      />
                      <CustomRadioButton
                        value="Trades"
                        selectedValue={selectedOption}
                        handleSelect={setSelectedOption}
                      />
                    </div>
                    {/* Trades section */}
                    {selectedOption === 'Trades' && (
                      <div className="w-full rounded-xl p-3 sm:p-6">
                        <div>
                          <div className="tradeBox py-2">
                            <p>Maker</p>
                            <p>Type</p>
                            <p>Amount</p>
                            <p>Date</p>
                            <p>Tx</p>
                          </div>

                          <div className="flex flex-col gap-2">
                            {transactionDatas.length === 0 && (
                              <div className="flex bg-[#1a2d1d] py-3 rounded-full justify-center text-white text-sm px-2">
                                No Data
                              </div>
                            )}
                            {transactionDatas.length > 0 &&
                              transactionDatas
                                .slice(
                                  (currentTransactionPage - 1) *
                                  transactionItemsPerPage,
                                  currentTransactionPage *
                                  transactionItemsPerPage
                                )
                                .map(({ Maker, Type, Amount, Date, Tx }) => (
                                  <>
                                    <div className="flex bg-[#1a2d1d] py-3 rounded-full justify-between px-2 sm:px-4 items-center">
                                      <div>
                                        <a
                                          className="holderContent"
                                          href={'sui' + 'address/' + Maker}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          <p className="tokenLists text-[#f3cc2f]">
                                            {Maker.slice(0, 5) +
                                              '...' +
                                              Maker.slice(-3)}
                                          </p>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#f3cc2f"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide-icon lucide lucide-external-link h-4 w-4"
                                          >
                                            <path d="M15 3h6v6"></path>
                                            <path d="M10 14 21 3"></path>
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                          </svg>
                                          &nbsp;
                                        </a>
                                      </div>
                                      <div>
                                        <p
                                          className={
                                            Type === 'Buy'
                                              ? 'tokenLists tokenBuy text-green-500'
                                              : 'tokenLists tokenSell text-red-500'
                                          }
                                        >
                                          {Type}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="tokenLists">{Amount}</p>
                                      </div>
                                      <div>
                                        <p className="tokenLists">{Date}</p>
                                      </div>
                                      <div>
                                        <a
                                          className="holderContent"
                                          href={'tx/' + Tx}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          <p className="tokenLists text-[#f3cc2f]">
                                            {Tx.slice(0, 5) +
                                              '...' +
                                              Tx.slice(-3)}
                                          </p>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#f3cc2f"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide-icon lucide lucide-external-link h-4 w-4"
                                          >
                                            <path d="M15 3h6v6"></path>
                                            <path d="M10 14 21 3"></path>
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                          </svg>
                                          &nbsp;
                                        </a>
                                      </div>
                                    </div>
                                  </>
                                ))}
                            <div
                              className="flex justify-end my-4"
                              style={{ textAlign: 'right' }}
                            >
                              {/* Render the "First Page" button */}
                              <button
                                className="px-2 py-1 mx-1 bg-primary text-white rounded-lg border border-[#f3cc2f]"
                                onClick={() => handleTransactionPageChange(1)}
                              >
                                &lt;&lt;
                              </button>
                              {/* Render the "Previous Page" button */}
                              <button
                                className="px-2 py-1 mx-1 bg-primary text-white rounded-lg border border-[#f3cc2f]"
                                onClick={() =>
                                  handleTransactionPageChange(
                                    Math.max(currentTransactionPage - 1, 1)
                                  )
                                }
                              >
                                &lt;
                              </button>
                              {transactionPageNumbers.map(
                                (pageNumber, index) => {
                                  if (typeof pageNumber === 'number') {
                                    return (
                                      <button
                                        key={pageNumber}
                                        className={`px-2 py-1 mx-1 ${currentTransactionPage === pageNumber
                                          ? 'bg-[#297836] text-white'
                                          : 'bg-[#1a2d1d] text-[#aaa]'
                                          } rounded-lg border border-[#f3cc2f]`}
                                        onClick={() =>
                                          handleTransactionPageChange(
                                            pageNumber
                                          )
                                        }
                                      >
                                        {pageNumber}
                                      </button>
                                    )
                                  } else {
                                    return (
                                      <span
                                        key={pageNumber}
                                        className="px-2 py-1 mx-1 bg-transparent text-secondary rounded-lg border border-primary"
                                      >
                                        ...
                                      </span>
                                    )
                                  }
                                }
                              )}
                              {/* Render the "Next Page" button */}
                              <button
                                className="px-2 py-1 mx-1 bg-primary text-white rounded-lg border border-[#f3cc2f]"
                                onClick={() =>
                                  handleTransactionPageChange(
                                    Math.min(
                                      currentTransactionPage + 1,
                                      transactionTotalPages
                                    )
                                  )
                                }
                              >
                                &gt;
                              </button>
                              {/* Render the "Last Page" button */}
                              <button
                                className="px-2 py-1 mx-1 bg-primary text-white rounded-lg border border-[#f3cc2f]"
                                onClick={() =>
                                  handleTransactionPageChange(
                                    transactionTotalPages
                                  )
                                }
                              >
                                &gt;&gt;
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Chat section */}
                    {selectedOption === 'Chat' && (
                      <section className="InputSection_Description p-6">
                        {chatHistory.length > 0 ? (
                          <div>
                            <div className="flex flex-col gap-1">
                              {chatHistory.map(
                                ({ Sender, Content, Date, avatar }) => (
                                  <>
                                    <div className="chatBox px-2">
                                      <div>
                                        <div className="chat-eth-logo-container relative">
                                          <img
                                            src={avatar}
                                            className="chat-profile-avatar"
                                            onError={event => {
                                              event.target.src =
                                                '/img/moonboy67.png'
                                              event.onerror = null
                                            }}
                                          />
                                          &nbsp; &nbsp;
                                          <div>
                                            <div className="top-trending">
                                              <Link
                                                className="chatContent"
                                                to={
                                                  '/profile/?address=' + Sender
                                                }
                                                rel="noreferrer"
                                              >
                                                <p>
                                                  {Sender.slice(0, 5) +
                                                    '...' +
                                                    Sender.slice(-3)}
                                                </p>
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="24"
                                                  height="24"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="white"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="lucide-icon lucide lucide-external-link h-4 w-4"
                                                >
                                                  <path d="M15 3h6v6"></path>
                                                  <path d="M10 14 21 3"></path>
                                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                </svg>
                                                &nbsp;
                                              </Link>
                                              &nbsp;
                                              <div>
                                                <p className="chatLists">
                                                  {Date}
                                                </p>
                                              </div>
                                            </div>
                                            <div>
                                              <p className="chatLists">
                                                {Content}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )
                              )}
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="ButtonBox mt-4">
                          <SignMessage
                            token={token}
                            sender={address}
                            content={chatContent}
                            timestamp={(Date.now() / 1000).toFixed(0)} 
                          />
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </section>

              <section className="ClaimLeftColumn px-[16px]">
                {lpCreated ? (
                  <a
                    href={`https://pancakeswap.finance/swap?chain=sui&outputCurrency=${tokenAddress}`}
                    target="_blank"
                  >
                    <div className="overflow-hidden rounded-[25px] sm:mx-0 mx-[-15px]">
                      <img src={melegaBannerImg} className="" />
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
                            <div className="flex gap-[16px]">
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
                                  event.target.src = '/logo.png' // Fallback image
                                  event.target.onerror = null // Prevents infinite loop if fallback image fails
                                }}
                              />
                              <div className="flex flex-col">
                                <span className="text-[#919191] text-[12px] font-semibold">
                                  From
                                </span>
                                <span className="text-white text-[20px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                                  {inputTokenType === 'SUI' ? 'SUI' : tokenSymbol.length > 8 ? `$tokenSymbol.slice(0, 8)}...` : tokenSymbol}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col justify-between items-end">
                              <input
                                type="number"
                                placeholder="0"
                                className="placeholder:text-[#919191] bg-transparent max-w-[180px] focus:outline-none text-white text-[20px] font-bold text-right h-6"
                                value={buyAmount}
                                onChange={e => setAmount(e.target.value)}
                                required
                              />
                              <div className="flex gap-2 items-center">
                                <span className="text-[#919191] text-[12px] font-semibold flex gap-1">
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
                            <div className="flex gap-[16px]">
                              <img
                                alt="token icon"
                                fetchpriority="high"
                                className="flex-shrink-0 w-10 h-10 rounded-full"
                                width="40"
                                height="40"
                                src={inputTokenType !== 'SUI' ? SuiIcon : tokenLogo}
                                onError={event => {
                                  event.target.src = '/logo.png' // Fallback image
                                  event.target.onerror = null // Prevents infinite loop if fallback image fails
                                }}
                              />
                              <div className="flex flex-col">
                                <span className="text-[#919191] text-[12px] font-semibold">
                                  To
                                </span>
                                <span className="text-white text-[20px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                                  {inputTokenType == 'Token' ? 'SUI' : tokenSymbol.length > 8 ? `$tokenSymbol.slice(0, 8)}...` : tokenSymbol}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <input
                                placeholder="0"
                                label=""
                                type="number"
                                value={tokenOutAmount}
                                className="text-white text-right text-[20px] font-bold h-6"
                                disabled
                              />
                              <div className="flex gap-2 items-center">
                                <span className="text-[#919191] text-[12px] font-semibold">
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
                          <ConnectButton className='w-full' style={{
      backgroundColor: '#cd8e60 ',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
    }}/>
                        </div>
                      ) : (
                        <button
                          onClick={onTokenSwap}
                          className="text-[16px] focus:outline-none h-[48px] flex justify-center items-center select-none font-bold text-center w-full bg-[#f0f0f0] hover:opacity-90 disabled:bg-[#646464] disabled:text-[#bbb] rounded-[24px] text-[#222]"
                          disabled={
                            Number(buyAmount) > 0 &&
                              (inputTokenType === 'SUI'
                                ? suiBalance >= Number(buyAmount)
                                : tokenBalance >= Number(buyAmount))
                              ? false
                              : true
                          }
                        >
                          {creating === false ? (
                            'Swap Tokens'
                          ) : (
                            <ClipLoader
                              color={'#222'}
                              loading={creating}
                              size={30}
                              aria-label="Loading Spinner"
                              data-testid="loader"
                            />
                          )}
                        </button>
                      )}
                    </section>
                  </div>
                )}
                <br />
                {(address === devAddress) & isConnected && (
                  <div className="claim-card p-6">
                    <div className="token-info-item">
                      <span className="token-info-label mx-auto">
                        <h3
                          className="text-white font-bold text-[24px]"
                          style={{ marginTop: '0px' }}
                        >
                          Update{' '}
                          <span className="text-[#00f3ef]">Information</span>
                        </h3>
                      </span>
                    </div>
                    <UpdateBox
                      onCreate={() => setCreating(false)}
                      data={poolDate} // Callback for child component
                    />
                  </div>
                )}
                <br />
                <div className="claim-card p-6">
                  <div className="token-info-item">
                    <span className="token-info-label mx-auto">
                      <h3
                        className="text-white font-bold text-[24px]"
                        style={{ marginTop: '0px' }}
                      >
                        Earn <span className="text-[#cd8e60]">0.5%</span> of
                        each trade
                      </h3>
                    </span>
                  </div>
                </div>
                <br />
                <div className="claim-card p-6">
                  <div className="token-info-item py-2">
                    <span className="token-info-label aligned-left text-[20px] font-extrabold">
                      Holders Distribution
                    </span>
                  </div>
                  {tokenHolders.slice(-10).map(({ address, value }) => (
                    <>
                      <div className="holderBox py-1">
                        <a
                          className="holderContent"
                          href={'address/' + address}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <p
                            style={{
                              textAlign: 'center',
                              margin: '0px'
                            }}
                            className="tokenLists text-[#a5ada6]"
                          >
                            {address.toString().slice(0, 5) +
                              '...' +
                              address.toString().slice(-3)}
                          </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#a5ada6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide-icon lucide lucide-external-link h-4 w-4"
                          >
                            <path d="M15 3h6v6"></path>
                            <path d="M10 14 21 3"></path>
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          </svg>
                          &nbsp;
                        </a>
                        <p
                          style={{
                            textAlign: 'center',
                            margin: '0px'
                          }}
                          className="tokenLists font-bold"
                        >
                          {value.toFixed(2)} %
                        </p>
                      </div>
                    </>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Trade
