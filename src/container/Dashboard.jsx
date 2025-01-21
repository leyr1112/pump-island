import { useState, useEffect, useCallback } from 'react'
import '../App.css'
import '../styles/MainContainer.css'
import LaunchpadCard from '../components/LaunchpadCard.jsx'
import ClipLoader from 'react-spinners/ClipLoader'
import Footer from '../components/Footer.jsx'
import TopBar from '../components/TopBar.jsx'
import Select from 'react-select'
import { apiUrl } from '../utils/constants.ts'
import { useGetPools } from '../hooks/index.ts'
import { useApp } from '../context/index.jsx'

const App = () => {
  const [search, setSearch] = useState('')
  const { pools, loading } = useGetPools()
  const { state } = useApp()

  const sortOptions = [
    { value: 'Market Cap', label: 'Market Cap' },
    { value: 'Time', label: 'Time' },
    { value: 'Volume', label: 'Volume' },
    { value: 'Last Reply', label: 'Last Reply' }
  ]

  const orderOptions = [
    { value: 'Descending', label: 'Descending' },
    { value: 'Ascending', label: 'Ascending' }
  ]

  const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'Listed', label: 'Listed' },
    { value: 'Live', label: 'Live' }
  ]

  function FilterSelect({ options, defaultValue, onChange }) {
    const handleChange = newValue => {
      onChange(newValue)
    }

    return (
      <Select
        defaultValue={defaultValue}
        isSearchable={false}
        options={options}
        value={options.find(option => option.value === defaultValue.value)}
        onChange={handleChange}
        styles={{
          control: styles => ({
            ...styles,
            color: 'black',
            padding: '4px 0px',
            backgroundColor: '#cd8e60',
            border: '1px solid black',
            boxShadow: 'rgb(0, 0, 0) 1px 1px 0px 0px',
            borderRadius: '25px',
            cursor: 'pointer',
            outline: 'none',
            '&:hover': {
              boxShadow: 'rgb(0, 0, 0) 1px 1px 0px 0px'
            },
            '&:focus': {
              boxShadow: 'rgb(0, 0, 0) 1px 1px 0px 0px'
            },
            '&:active': {
              boxShadow: 'rgb(0, 0, 0) 1px 1px 0px 0px'
            }
          }),
          option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            backgroundColor: isFocused
              ? isSelected
                ? '#1d1d1d'
                : '#1d1d1d'
              : '#cd8e60',
            color: 'white',
            cursor: 'pointer'
          }),
          singleValue: styles => ({
            ...styles,
            color: 'white',
            outline: 'none'
          }),
          indicatorSeparator: styles => ({
            ...styles,
            display: 'none'
          }),
          dropdownIndicator: styles => ({
            ...styles,
            color: 'white'
          }),
          menuList: styles => ({
            ...styles,
            background: '#cd8e60',
            borderRadius: '5px'
          })
        }}
      />
    )
  }

  const [sortedChadLists, setSortedChadLists] = useState([])
  const [filteredChadLists, setFilteredChadLists] = useState([])
  const [sortValue, setSortValue] = useState(sortOptions[0])
  const [orderValue, setOrderValue] = useState(orderOptions[0])
  const [statusValue, setStatusValue] = useState(statusOptions[0])

  const filterChadLists = useCallback(() => {
    const searchFiltered = pools.filter(list => {
      if (!search || search === '') {
        return true
      }

      const searchLower = search.toLowerCase()

      if (list.tokenName.toLowerCase().includes(searchLower)) {
        return true
      }
    })
    let filteredList = []
    switch (statusValue.value) {
      case 'All':
        filteredList = [...searchFiltered]
        break
      case 'Listed':
        filteredList = [...searchFiltered.filter(item => item.progress >= 100)] // TODO: Add filtering logic for "Listed" condition
        break
      case 'Live':
        filteredList = [...searchFiltered.filter(item => item.progress < 100)] // TODO: Add filtering logic for "Live" condition
        break
      default:
        break
    }
    setFilteredChadLists(filteredList)
  }, [statusValue, pools, search])

  const onSearchChanged = event => {
    setSearch(event.target.value)
  }

  const sortChadLists = useCallback(async () => {
    // const latestChatsRes = await fetch(apiUrl + `/api/getLatestChats`, {
    //   method: 'GET'
    // })
    // const latestChats = await latestChatsRes.json()
    const latestChats = []

    let sortedList = []
    const timestampMap = latestChats.length > 0 ? new Map(
      latestChats.map(chat => [chat.ChadAddress, chat.timestamp])
    ) : undefined
    switch (sortValue.value) {
      case 'Market Cap':
        sortedList = [...filteredChadLists].sort((a, b) => {
          if (orderValue.value === 'Ascending') {
            return a.marketCap - b.marketCap
          } else {
            return b.marketCap - a.marketCap
          }
        })
        break
      case 'Time':
        sortedList = [...filteredChadLists].sort((a, b) => {
          if (orderValue.value === 'Ascending') {
            return a.startTime - b.startTime
          } else {
            return b.startTime - a.startTime
          }
        })
        break
      case 'Volume':
        sortedList = [...filteredChadLists].sort((a, b) => {
          if (orderValue.value === 'Ascending') {
            return a.depositedAmount - b.depositedAmount
          } else {
            return b.depositedAmount - a.depositedAmount
          }
        })
        break
      case 'Last Reply':
        sortedList = [...filteredChadLists].sort((a, b) => {
          if (orderValue.value === 'Ascending') {
            const timestampA = timestampMap.get(a.contractAddress) || 0
            const timestampB = timestampMap.get(b.contractAddress) || 0

            return timestampA - timestampB
          } else {
            const timestampA = timestampMap.get(a.contractAddress) || 0
            const timestampB = timestampMap.get(b.contractAddress) || 0

            return timestampB - timestampA
          }
        })
        break
      default:
        break
    }
    setSortedChadLists(sortedList)
  }, [orderValue, sortValue, filteredChadLists])

  useEffect(() => {
    setFilteredChadLists([...pools])
  }, [pools, statusValue])

  useEffect(() => {
    filterChadLists()
  }, [statusValue, filterChadLists])

  useEffect(() => {
    sortChadLists()
  }, [orderValue, sortValue, filteredChadLists, sortChadLists])

  const onSortChange = newValue => {
    setSortValue(newValue)
    sortChadLists()
  }

  const onOrderChange = () => {
    if (orderValue.value === 'Descending') setOrderValue(orderOptions[1])
    else setOrderValue(orderOptions[0])
    sortChadLists()
  }

  const onStatusChange = newValue => {
    setStatusValue(newValue)
    filterChadLists()
  }

  const LaunchpadCardGrid = ({ items }) => {
    return (
      <div
        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {items.map(
          ({
            chainId,
            progress,
            Liquidity,
            tokenName,
            logoUrl,
            bannerUrl,
            address,
            depositedAmount,
            contractAddress,
            dexAddress,
            devAddress,
            dexName,
            marketCap,
            website,
            twitter,
            telegram,
            blockchainLogoUrl,
            raisingPercent
          }) => (
            <LaunchpadCard
              chainId={chainId}
              progress={progress}
              Liquidity={Liquidity}
              tokenName={tokenName}
              Logo={logoUrl}
              Banner={bannerUrl}
              chadAddress={address}
              depositedAmount={depositedAmount}
              contractAddress={contractAddress}
              dexAddress={dexAddress}
              devAddress={devAddress}
              dexName={dexName}
              marketCap={marketCap}
              website={website}
              twitter={twitter}
              telegram={telegram}
              BlockchainLogo={
                <img
                  src={blockchainLogoUrl}
                  className="launchpad-blockchain-logo"
                />
              }
              raisingPercent={raisingPercent}
            />
          )
        )}
      </div>
    )
  }

  return (
    <div>
      <style jsx={true}>{`
        .modal {
          opacity: 0;
          visibility: hidden;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color:#FFFFF;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .show-modal {
          opacity: 1;
          visibility: visible;
        }
      `}</style>
      <div className="GlobalContainer launches-all-padding">
        <div>
          <TopBar />
          <div className="max-w-7xl m-auto pt-36 pb-24 px-4 sm:px-12 sm:py-10">
            <div className="py-[32px] w-full h-auto">
              <div className="flex flex-col lg:flex-row gap-3 lg:gap-2.5 h-full justify-between">
                <div className="border border-[#f6f7f9] rounded-full relative w-full xl:w-[calc(1200px_-_435px)] lg:w-[calc(100vw_-_484px)] h-10 lg:h-full">
                  <svg
                    fill="#f6f7f9"
                    viewBox="0 0 18 18"
                    width="18"
                    className="top-3 left-[14px] absolute"
                  >
                    <g>
                      <path d="M7.75987 15.5197C3.48078 15.5197 0 12.039 0 7.75987C0 3.48078 3.48078 0 7.75987 0C12.039 0 15.5197 3.48078 15.5197 7.75987C15.5197 12.039 12.039 15.5197 7.75987 15.5197ZM7.75987 1.90911C4.53381 1.90911 1.90911 4.53381 1.90911 7.75855C1.90911 10.9833 4.53381 13.608 7.75987 13.608C10.9859 13.608 13.6106 10.9833 13.6106 7.75855C13.6106 4.53381 10.9859 1.91042 7.75987 1.91042V1.90911Z"></path>
                      <path d="M16.8235 17.9987C16.5228 17.9987 16.2221 17.8845 15.9924 17.6547L11.9378 13.6001C11.4783 13.1406 11.4783 12.3974 11.9378 11.9379C12.3974 11.4783 13.1418 11.4783 13.6001 11.9379L17.6546 15.9924C18.1142 16.452 18.1142 17.1951 17.6546 17.6547C17.4249 17.8845 17.1242 17.9987 16.8235 17.9987Z"></path>
                    </g>
                  </svg>
                  <input
                    className="bg-transparent placeholder:text-[#f6f7f9] placeholder:text-sm focus:outline-none py-[12px] pr-8 pl-[44px] border rounded-2xl w-full h-full text-[#f6f7f9]"
                    placeholder="Search Token"
                    onChange={onSearchChanged}
                  />
                </div>
                <div className="flex flex-row gap-2 text-[14px]">
                  <FilterSelect
                    options={sortOptions}
                    defaultValue={sortValue}
                    onChange={onSortChange}
                  />
                  <FilterSelect
                    options={statusOptions}
                    defaultValue={statusValue}
                    onChange={onStatusChange}
                  />
                  <button
                    className="bg-[#cd8e60] rounded-full p-2"
                    onClick={onOrderChange}
                    style={{
                      border: '1px solid black',
                      boxShadow: 'rgb(0, 0, 0) 1px 1px 0px 0px',
                      borderRadius: '25px'
                    }}
                  >
                    {orderValue.label === 'Ascending' ? (
                      <svg
                        fill="#e5e7eb"
                        viewBox="0 0 21 17"
                        width="21"
                        className="fill-primary transition-transform "
                      >
                        <g>
                          <path d="M17.2974 12.6684L19.0757 10.8901C19.5165 10.4493 20.2292 10.4493 20.67 10.8901C21.1109 11.331 21.1109 12.0437 20.67 12.4845L17.0607 16.0925C16.9025 16.2953 16.6807 16.4387 16.4306 16.4982C15.8274 16.651 15.2148 16.2872 15.062 15.6841C15.0228 15.5299 15.0174 15.3703 15.0444 15.2135V1.12783C15.0444 0.505763 15.5488 0 16.1723 0C16.7957 0 17.3001 0.504411 17.3001 1.12783V12.6684H17.2974ZM1.12783 1.45373H10.8942C11.5163 1.45373 12.022 1.95814 12.022 2.58156C12.022 3.20497 11.5176 3.70938 10.8942 3.70938H1.12783C0.504411 3.70803 0 3.20362 0 2.5802C0 1.95679 0.504411 1.45373 1.12783 1.45373ZM1.12783 7.46474H10.8942C11.5163 7.44446 12.0383 7.93264 12.0585 8.5547C12.0788 9.17677 11.5906 9.69876 10.9686 9.71904C10.9442 9.71904 10.9185 9.71904 10.8942 9.71904H1.12783C0.505763 9.71904 0 9.21463 0 8.59122C0 7.9678 0.504411 7.46339 1.12783 7.46339V7.46474ZM1.12783 13.4758H10.8942C11.5163 13.4758 12.022 13.9802 12.022 14.6036C12.022 15.227 11.5176 15.7314 10.8942 15.7314H1.12783C0.505763 15.7314 0 15.227 0 14.6036C0 13.9802 0.504411 13.4758 1.12783 13.4758Z"></path>
                        </g>
                      </svg>
                    ) : (
                      <svg
                        fill="#e5e7eb"
                        viewBox="0 0 21 17"
                        width="21"
                        className="fill-primary transition-transform rotate-180"
                      >
                        <g>
                          <path d="M17.2974 12.6684L19.0757 10.8901C19.5165 10.4493 20.2292 10.4493 20.67 10.8901C21.1109 11.331 21.1109 12.0437 20.67 12.4845L17.0607 16.0925C16.9025 16.2953 16.6807 16.4387 16.4306 16.4982C15.8274 16.651 15.2148 16.2872 15.062 15.6841C15.0228 15.5299 15.0174 15.3703 15.0444 15.2135V1.12783C15.0444 0.505763 15.5488 0 16.1723 0C16.7957 0 17.3001 0.504411 17.3001 1.12783V12.6684H17.2974ZM1.12783 1.45373H10.8942C11.5163 1.45373 12.022 1.95814 12.022 2.58156C12.022 3.20497 11.5176 3.70938 10.8942 3.70938H1.12783C0.504411 3.70803 0 3.20362 0 2.5802C0 1.95679 0.504411 1.45373 1.12783 1.45373ZM1.12783 7.46474H10.8942C11.5163 7.44446 12.0383 7.93264 12.0585 8.5547C12.0788 9.17677 11.5906 9.69876 10.9686 9.71904C10.9442 9.71904 10.9185 9.71904 10.8942 9.71904H1.12783C0.505763 9.71904 0 9.21463 0 8.59122C0 7.9678 0.504411 7.46339 1.12783 7.46339V7.46474ZM1.12783 13.4758H10.8942C11.5163 13.4758 12.022 13.9802 12.022 14.6036C12.022 15.227 11.5176 15.7314 10.8942 15.7314H1.12783C0.505763 15.7314 0 15.227 0 14.6036C0 13.9802 0.504411 13.4758 1.12783 13.4758Z"></path>
                        </g>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            {sortedChadLists.length > 0 ? (
              <>
                <LaunchpadCardGrid items={sortedChadLists} />
                {loading === true ? (
                  <div className="loadingBox">
                    <div className="EmptyLaunchpad">
                      <div className="loadingBox">
                        <p className="Text1" style={{ color: 'white' }}>
                          Loading...
                        </p>
                        <ClipLoader
                          color={'#afccc6'}
                          loading={true}
                          size={50}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <div className="loadingBox">
                <p className="Text1" style={{ color: 'white' }}>
                  No data yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
