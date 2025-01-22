import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import '../styles/MainContainer.css'
import Footer from '../components/Footer.jsx'
import ClaimCard from '../components/ClaimCard.jsx'
import TopBar from '../components/TopBar.jsx'
import { useQueryParam, StringParam } from 'use-query-params'
import MyChart from '../components/Chart.jsx'
import { SignMessage } from './SignMessage.jsx'
import CustomRadioButton from '../components/CustomRadioButton.jsx'
import UpdateBox from '../components/profileUpdateBox.tsx'
import { useGetPool } from '../hooks/index.ts'
import { useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit'
import TradeCardBox from '../components/TradeCardBox.jsx'

const Trade = () => {
  let [token] = useQueryParam('token', StringParam)

  const {
    tokenName,
    tokenSymbol,
    logoUrl: tokenLogo,
    liquidity,
    website,
    twitter,
    telegram,
    devAddress,
    description,
    suiPrice: ethPrice,
    tokenAddress,
    marketCap,
    logoUrl,
    progress,
    tokenSuiPrice,
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
    telegram: telegram,
    logoUrl: logoUrl
  }

  const handleImageError = event => {
    event.target.src = '/logo.png'
    event.target.onerror = null // Prevents infinite loop in case the fallback image also fails to load
  }

  return (
    <div>
      <div className="GlobalContainer launches-all-padding">
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
                        src={tokenLogo || '/logo.png'}
                        className="claim-eth-logo"
                        onError={handleImageError}
                        alt={`${tokenName} logo`}
                      />
                      
                    }
                    tokenSymbol={tokenSymbol}
                    website={website}
                    telegram={telegram}
                    twitter={twitter}
                    volume={volume}
                    description={description}
                    marketCap={marketCap}
                    progress={progress}
                    liquidity={liquidity}
                    tokenSuiPrice={tokenSuiPrice}
                    tokenAddress={tokenAddress}
                  />
                <div className="block lg:hidden">
                <TradeCardBox
                  token={token}
                  lpCreated={lpCreated}
                  tokenAddress={tokenAddress}
                  tokenLogo={tokenLogo}
                  tokenSymbol={tokenSymbol}
                />
                 </div>
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
                    {selectedOption === 'Trades' && (
                      <div className="w-full rounded-xl p-3 sm:p-6">
                        <div>
                          <div className="tradeBox py-2">
                            <p>Maker</p>
                            <p>Type</p>
                            <p>Amount</p>
                            <p>date</p>
                            <p>Tx</p>
                          </div>

                          <div className="flex flex-col gap-2">
                            {transactionDatas.length === 0 && (
                              <div className="flex bg-[#1d1d1d] py-3 rounded-full justify-center text-white text-sm px-2">
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
                                .map(({ Maker, Type, Amount, date, Tx }) => (
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
                                        <p className="tokenLists">{date}</p>
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
                                className="px-2 py-1 mx-1 bg-primary text-white rounded-lg border border-[#cd8e60]"
                                onClick={() => handleTransactionPageChange(1)}
                              >
                                &lt;&lt;
                              </button>
                              {/* Render the "Previous Page" button */}
                              <button
                                className="px-2 py-1 mx-1 bg-primary text-white rounded-lg border border-[#cd8e60]"
                                onClick={() =>
                                  handleTransactionPageChange(
                                    Math.max(currentTransactionPage - 1, 1)
                                  )
                                }
                              >
                                &lt;
                              </button>
                              {transactionPageNumbers.map(
                                (pageNumber) => {
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
                                className="px-2 py-1 mx-1 bg-primary text-white rounded-lg border border-[#cd8e60]"
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
                                className="px-2 py-1 mx-1 bg-primary text-white rounded-lg border border-[#cd8e60]"
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
                    {selectedOption === 'Chat' && (
                      <section className="InputSection_Description p-6">
                        {chatHistory.length > 0 ? (
                          <div>
                            <div className="flex flex-col gap-1">
                              {chatHistory.map(
                                ({ sender, content, date, avatar }) => (
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
                                                  '/profile/?address=' + sender
                                                }
                                                rel="noreferrer"
                                              >
                                                <p>
                                                  {sender.slice(0, 5) +
                                                    '...' +
                                                    sender.slice(-3)}
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
                                                  {date}
                                                </p>
                                              </div>
                                            </div>
                                            <div>
                                              <p className="chatLists">
                                                {content}
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
              <div className="hidden lg:block">
              <TradeCardBox
                token={token}
                lpCreated={lpCreated}
                tokenAddress={tokenAddress}
                tokenLogo={tokenLogo}
                tokenSymbol={tokenSymbol}
              />
            </div>


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
                          <span className="text-[#cd8e60]">Information</span>
                        </h3>
                      </span>
                    </div>
                    <UpdateBox data={poolDate} />
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
                        Earn <span className="text-[#cd8e60]">0.5%</span> of each trade
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
