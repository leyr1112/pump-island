import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminWallet, OBJECTS, PumpConfig } from '../config'
import { useApp } from '../context'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import {
    useCurrentAccount,
    useSignAndExecuteTransaction
} from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { intoBase64 } from '../utils/pkg.ts'
import toast from 'react-hot-toast'
import { format9 } from '../utils/format.ts'
import ToastSuccessLink from '../components/ToastSuccessLink.tsx'

const client = new SuiClient({ url: getFullnodeUrl('devnet') })

export const useGetSuiBalance = () => {
    const [suiBalance, setSuiBalance] = useState<any>()
    const account = useCurrentAccount()
    const getSuiBalance = async (address) => {
        try {
            const result = await client.getBalance({ owner: address })
            const totalBalance = result.totalBalance
            setSuiBalance(totalBalance)
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        if (account) {
            getSuiBalance(account.address)
        }
    }, [account])
    const refetch = useCallback(() => {
        if (account) {
            getSuiBalance(account.address)
        }
    }, [account])
    return { suiBalance, refetch }
}

export const useGetTokenBalances = () => {
    const [tokenBalances, setTokenBalances] = useState<any[]>([])
    const account = useCurrentAccount()
    const getTokenBalance = async (address) => {
        try {
            const result = await client.getAllBalances({ owner: address })
            setTokenBalances(result)

        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        if (account) getTokenBalance(account.address)
    }, [account])

    const refetch = useCallback(() => {
        if (account) {
            getTokenBalance(account.address)
        }
    }, [account])

    return { tokenBalances, refetch }
}

export const useGetTokenBalance = (token) => {
    const [tokenBalance, setTokenBalance] = useState(0)
    const [decimal, setDecimal] = useState(6)
    const { state } = useApp()
    useEffect(() => {
        const tokenData = state.tokenBalances.filter((balance) => balance.coinType == token)
        if (tokenData.length > 0) {
            setTokenBalance(tokenData[0].totalBalance)
        }
    }, [state])

    const getCoinData = async (token) => {
        const result: any = await client.getCoinMetadata({ coinType: token })
        setDecimal(result?.decimals)
    }
    useEffect(() => {
        getCoinData(token)
    }, [token])
    return { tokenBalance, tokenDecimal: decimal }
}

export const useGetSuiPrice = () => {
    const [suiPrice, setSuiPrice] = useState(0)
    const getSuiprice = async () => {
        try {
            const response = await fetch('https://api.diadata.org/v1/assetQuotation/Sui/0x2::sui::SUI')
            const data = await response.json()
            setSuiPrice(data.Price)
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        getSuiprice()
    }, [])

    const refetch = useCallback(() => {
        getSuiprice()
    }, [])
    return { suiPrice, refetch }
}

// Action
export const useCreate = () => {
    const account = useCurrentAccount()
    const [loading, setLoading] = useState<'Creating' | 'Adding' | 'False'>('False')
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
    const createToken = async (tokenName, tokenSymbol, tokenDescription, tokenLogo, website, telegram, twitter, inputAmout) => {
        setLoading('Creating')
        tokenSymbol = tokenSymbol.toUpperCase()
        try {
            if (account?.publicKey) {
                const tx = new Transaction()
                const pkg = intoBase64({
                    symbol: tokenSymbol,
                    name: tokenName,
                    description: tokenDescription,
                    iconUrl: tokenLogo
                })
                const dependencies = [
                    '0x0000000000000000000000000000000000000000000000000000000000000001',
                    '0x0000000000000000000000000000000000000000000000000000000000000002'
                ]
                const [upgradeCap] = tx.publish({
                    modules: [pkg],
                    dependencies
                })
                tx.transferObjects(
                    [upgradeCap],
                    tx.pure(new Uint8Array(account?.publicKey))
                )
                const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(1000000000)])
                tx.transferObjects([coin], tx.pure.address(AdminWallet))
                signAndExecuteTransaction(
                    { transaction: tx },
                    {
                        onSuccess: async (result) => {
                            const digest = result.digest
                            if (digest) {
                                toast.success(ToastSuccessLink({ message: 'Successfully created token!', link: digest }))
                                creatPool(digest, tokenName, tokenSymbol, tokenDescription, tokenLogo, website, telegram, twitter, inputAmout)
                            }
                        },
                        onError: (e) => {
                            toast.error('Token creation failed!')
                            setLoading('False')
                        }
                    }
                )
            }
        } catch (e) {
            console.error(e)
            toast.error('Token creation failed!')
            setLoading('False')
        }
    }

    const waitForTransaction = async (digest, retries = 10, delay = 2000) => {
        let transactionResult;
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                transactionResult = await client.getTransactionBlock({
                    digest: digest,
                    options: { showObjectChanges: true },
                });

                if (transactionResult) {
                    console.log('Transaction found:', transactionResult);
                    return transactionResult;
                }
            } catch (error) {
                console.error('Error fetching transaction:', error);
            }

            console.log(`Retrying in ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        // If all retries fail, throw an error
        throw new Error(`Transaction not found after ${retries} attempts.`);
    };

    const creatPool = async (digest, tokenName, tokenSymbol, tokenDescription, tokenLogo, website, telegram, twitter, inputAmout) => {
        setLoading('Adding')
        try {
            const transactionResult = await waitForTransaction(digest)
            const { objectChanges } = transactionResult
            let treasuryCap, packageId
            objectChanges?.forEach((objectChange: any) => {
                if (objectChange?.objectType?.includes('::coin::TreasuryCap<')) {
                    treasuryCap = objectChange?.objectId
                }
                if (objectChange?.type === 'published') {
                    packageId = objectChange?.packageId
                }
            })
            if (treasuryCap && packageId) {
                const tx = new Transaction()

                if (inputAmout == 0) {
                    tx.moveCall({
                        arguments: [
                            tx.object(OBJECTS.Configuration),
                            tx.object(treasuryCap),
                            tx.object('0x6'),
                            tx.pure.string(tokenName),
                            tx.pure.string(tokenSymbol),
                            tx.pure.string(tokenLogo),
                            tx.pure.string(tokenDescription),
                            tx.pure.string(twitter),
                            tx.pure.string(telegram),
                            tx.pure.string(website),
                        ],
                        typeArguments: [`${packageId}::${tokenSymbol.toLowerCase()}::${tokenSymbol.toUpperCase()}`],
                        target: `${OBJECTS.Package}::move_pump::create`
                    })
                } else {
                    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(inputAmout * 1000000000)])
                    tx.moveCall({
                        arguments: [
                            tx.object(OBJECTS.Configuration),
                            tx.object(treasuryCap),
                            coin,
                            tx.pure.u64(inputAmout * 19860477000000),
                            tx.object('0x6'),
                            tx.pure.string(tokenName),
                            tx.pure.string(tokenSymbol),
                            tx.pure.string(tokenLogo),
                            tx.pure.string(tokenDescription),
                            tx.pure.string(twitter),
                            tx.pure.string(telegram),
                            tx.pure.string(website),
                        ],
                        typeArguments: [`${packageId}::${tokenSymbol.toLowerCase()}::${tokenSymbol.toUpperCase()}`],
                        target: `${OBJECTS.Package}::move_pump::create_and_first_buy`
                    })
                }

                signAndExecuteTransaction({ transaction: tx }, {
                    onSuccess: result => {
                        console.log(result)
                        setLoading('False')
                        toast.success(ToastSuccessLink({ message: 'Successfully pool created!', link: result.digest }))
                    },
                    onError: (e) => {
                        console.error(e)
                        setLoading('False')
                        toast.error('Pool creation faild!')
                    }
                })
            }
        } catch (e) {
            console.error(e)
            setLoading('False')
            toast.error('Pool creation faild!')
        }
    }

    return { loading, createToken }
}

export const useTrade = (token) => {
    const account = useCurrentAccount()
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
    const [estimateOut, setEstimateOut] = useState(0n)
    const [ouput, setOutput] = useState(0)
    const [loading, setLoading] = useState(false)
    const { refetch } = useGetPools()
    const { refetch: refetchTransactions } = useGetTradingTransactions(token)
    const buy = async (inputTokenType, inputAmout) => {
        setLoading(true)
        try {
            if (inputTokenType == "SUI") {
                const tx = new Transaction()
                const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(Math.floor(inputAmout * 1000000000))])
                tx.moveCall({
                    arguments: [
                        tx.object(OBJECTS.Configuration),
                        tx.object(OBJECTS.Threshold),
                        coin,
                        tx.pure.u64(estimateOut),
                        tx.object('0x6')
                    ],
                    typeArguments: [token],
                    target: `${OBJECTS.Package}::move_pump::buy_v2`
                })
                signAndExecuteTransaction({ transaction: tx }, {
                    onSuccess: result => {
                        console.log(result)
                        setLoading(false)
                        toast.success(ToastSuccessLink({ message: 'Successfully bought', link: result.digest }))
                        refetch()
                        refetchTransactions()
                    },
                    onError: (e) => {
                        console.error(e)
                        setLoading(false)
                        toast.error('There is a problem to trade!')
                    }
                })
            } else {
                const tx = new Transaction()
                const coinObjects = await client.getCoins({ owner: (account as any).address, coinType: token })
                if (coinObjects.data.length > 0) {
                    const coinObject1 = tx.object(coinObjects.data[0].coinObjectId)
                    const ohterCoinObjects = (coinObjects as any).data.slice(1).map((item) => {
                        return tx.object(item.coinObjectId)
                    })
                    if (ohterCoinObjects.length > 0) {
                        tx.mergeCoins(coinObject1, ohterCoinObjects)
                    }
                    const [coin] = tx.splitCoins(coinObject1, [tx.pure.u64(Math.floor(inputAmout * 1000000))])
                    tx.moveCall({
                        arguments: [
                            tx.object(OBJECTS.Configuration),
                            coin,
                            tx.pure.u64(estimateOut),
                            tx.object('0x6')
                        ],
                        typeArguments: [token],
                        target: `${OBJECTS.Package}::move_pump::sell`
                    })

                    signAndExecuteTransaction({ transaction: tx }, {
                        onSuccess: result => {
                            console.log(result)
                            setLoading(false)
                            toast.success(ToastSuccessLink({ message: 'Successfully sold!', link: result.digest }))
                            refetch()
                            refetchTransactions()
                        },
                        onError: (e) => {
                            setLoading(false)
                            toast.error('There is a problem to trade!')
                            console.error(e)
                        }
                    })
                } else {
                    console.error('There is a problem to trade!')
                    setLoading(false)
                    toast.error('There is a problem to trade!')
                }
            }
        } catch (e) {
            console.error(e)
            setLoading(false)
            toast.error('There is a problem to trade!')
        }
    }

    const getEstimateOut = async (inputTokenType, amount) => {
        if (Number(amount) == 0 || isNaN(Number(amount))) {
            setEstimateOut(0n)
            setOutput(0)
            return
        }
        setLoading(true)
        try {
            let u64Value = 0n
            const tx = new Transaction()
            if (inputTokenType == 'SUI') {
                tx.moveCall({
                    arguments: [
                        tx.object(OBJECTS.Configuration),
                        tx.pure.u64(Math.floor(Number(amount) * 1000000000)),
                        tx.pure.u64(0)
                    ],
                    typeArguments: [token],
                    target: `${OBJECTS.Package}::move_pump::estimate_amount_out`
                })
                const result = await client.devInspectTransactionBlock({
                    transactionBlock: tx,
                    sender: '0x0000000000000000000000000000000000000000000000000000000000000000'
                })
                const returnValues = result!["results"]![0]!["returnValues"];
                const byteArray2 = returnValues![1][0]
                const buffer2 = Buffer.from(byteArray2);
                u64Value = buffer2.readBigUInt64LE();
                setEstimateOut(u64Value)
                setOutput(Number(u64Value / 1000n) / 1000)

            } else {
                tx.moveCall({
                    arguments: [
                        tx.object(OBJECTS.Configuration),
                        tx.pure.u64(0),
                        tx.pure.u64(Math.floor(Number(amount) * 1000000))
                    ],
                    typeArguments: [token],
                    target: `${OBJECTS.Package}::move_pump::estimate_amount_out`
                })
                const result = await client.devInspectTransactionBlock({
                    transactionBlock: tx,
                    sender: '0x0000000000000000000000000000000000000000000000000000000000000000'
                })
                const returnValues = result!["results"]![0]!["returnValues"];
                const byteArray = returnValues![0][0]
                const buffer = Buffer.from(byteArray);
                u64Value = buffer.readBigUInt64LE();
                setEstimateOut(u64Value)
                setOutput(Number(u64Value / 1000n) / 1000000)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return { buy, getEstimateOut, estimateOut, ouput, loading }
}

// Dashboard page hook
export const useGetPools = () => {
    const [data, setData] = useState<any[]>([])
    const [king, setKing] = useState<any>()
    const [loading, setLoading] = useState(true)
    const { changeVariable } = useApp()
    const { state } = useApp()
    const getPools = async (suiPrice) => {
        setLoading(true)
        try {
            const createdEvents = await client.queryEvents({
                query: {
                    MoveEventType: `${OBJECTS.Package}::move_pump::CreatedEvent`
                }
            })
            let kingData: any
            if (!createdEvents.data) return
            const poolsDataAdd = await Promise.all(createdEvents.data.map(async (createdEvent: any) => {
                const poolObjectId = createdEvent.parsedJson.pool_id
                const devAddress = createdEvent.parsedJson.created_by
                const startTime = createdEvent.timestampMs //ms
                const website = createdEvent.parsedJson.website
                const twitter = createdEvent.parsedJson.twitter
                const description = createdEvent.parsedJson.description
                const telegram = createdEvent.parsedJson.telegram
                const tokenSymbol = createdEvent.parsedJson.symbol
                const tokenName = createdEvent.parsedJson.name
                const logoUrl = createdEvent.parsedJson.uri
                const poolData: any = await client.getObject({ id: poolObjectId, options: { showContent: true } })
                const address = poolData.data.content.type.slice(84, -1)
                const poolDataAdd = poolData.data.content.fields
                const realSuiReserves = poolDataAdd.real_sui_reserves.fields.balance
                const virtualSuiReserves = poolDataAdd.virtual_sui_reserves
                const virtualTokenReserves = poolDataAdd.virtual_token_reserves
                const realTokenReserves = poolDataAdd.real_token_reserves.fields.balance
                const tokenPrice = virtualSuiReserves / virtualTokenReserves * suiPrice / 1000
                const poolCompleted = poolDataAdd.is_completed
                const progress = poolCompleted ? 100 : realSuiReserves / Number(PumpConfig.Threshod) * 100 > 100 ? 100 : realSuiReserves / Number(PumpConfig.Threshod) * 100

                if (progress >= 50 && progress < 100 && !kingData) {
                    kingData = address
                }

                const result = {
                    tokenSymbol,
                    tokenName,
                    logoUrl,
                    address,
                    startTime,
                    devAddress,
                    website,
                    twitter,
                    telegram,
                    description,
                    realSuiReserves,
                    virtualSuiReserves,
                    virtualTokenReserves,
                    realTokenReserves,
                    progress,
                    marketCap: tokenPrice * 10000000000,
                    tokenPrice,
                    liquidity: realSuiReserves / 1000000000 * suiPrice,
                    poolObjectId,
                    raisingPercent: undefined,
                    suiPrice,
                    tokenSuiPrice: virtualSuiReserves / virtualTokenReserves / 1000,
                    poolCompleted
                }

                changeVariable(address, result)

                return result
            }))
            setData(poolsDataAdd)
            setKing(kingData)
        } catch (e) {
            console.error('Error fetching pools', e)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getPools(state.suiPrice)
    }, [state.suiPrice])
    const refetch = useCallback(() => {
        getPools(state.suiPrice)
    }, [state.suiPrice])

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 60000);

        return () => clearInterval(interval);
    }, []);
    return { pools: data, loading, refetch, king }
}

export const useGetPool = (token) => {
    const tokenAddress = token
    const { suiPrice } = useGetSuiPrice()
    const { state } = useApp()
    const [tokenName, setTokenName] = useState('---')
    const [tokenSymbol, setTokenSymbol] = useState('---')
    const [logoUrl, setLogoUrl] = useState('')
    const [website, setWebsite] = useState('')
    const [twitter, setTwitter] = useState('')
    const [telegram, setTelegram] = useState('')
    const [devAddress, setDevAddress] = useState('')
    const [description, setDescription] = useState('')
    const [liquidity, setLiquidity] = useState('0')
    const [marketCap, setMarketCap] = useState('0')
    const [tokenPrice, setTokenPrice] = useState('0')
    const [progress, setProgress] = useState(0)
    const [tokenSuiPrice, setTokenSuiPrice] = useState(0)
    const [poolCompleted, setPoolCompleted] = useState(false)
    const [realSuiReserves, setRealSuiReserves] = useState(0)

    useEffect(() => {
        const getPool = () => {
            const pool = state[token]
            if (pool) {
                setTokenName(pool.tokenName)
                setTokenSymbol(pool.tokenSymbol)
                setLogoUrl(pool.logoUrl)
                setWebsite(pool.website)
                setTwitter(pool.twitter)
                setTelegram(pool.telegram)
                setDevAddress(pool.devAddress)
                setDescription(pool.description)
                setLiquidity(pool.liquidity)
                setMarketCap(pool.marketCap)
                setTokenPrice(pool.tokenPrice)
                setProgress(pool.progress)
                setTokenSuiPrice(pool.tokenSuiPrice)
                setPoolCompleted(pool.poolCompleted)
                setRealSuiReserves(pool.realSuiReserves)
            }
        }
        getPool()
    }, [state])

    const refetch = useCallback(() => {
        const getPool = () => {
            const pool = state[token]
            if (pool) {
                setTokenName(pool.tokenName)
                setTokenSymbol(pool.tokenSymbol)
                setLogoUrl(pool.logoUrl)
                setWebsite(pool.website)
                setTwitter(pool.twitter)
                setTelegram(pool.telegram)
                setDevAddress(pool.devAddress)
                setDescription(pool.description)
                setLiquidity(pool.liquidity)
                setMarketCap(pool.marketCap)
                setTokenPrice(pool.tokenPrice)
                setProgress(pool.progress)
                setTokenSuiPrice(pool.tokenSuiPrice)
                setPoolCompleted(pool.poolCompleted)
                setRealSuiReserves(pool.realSuiReserves)
            }
        }
        getPool()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return {
        tokenName,
        tokenSymbol,
        logoUrl,
        website,
        twitter,
        telegram,
        devAddress,
        description,
        suiPrice,
        tokenAddress,
        liquidity,
        marketCap,
        tokenPrice,
        progress,
        tokenSuiPrice,
        poolCompleted,
        realSuiReserves
    }
}

export const useGetHolders = (token) => {
    const [holders, setHolders] = useState<any[]>([])
    useEffect(() => {
        const getHolders = async () => {
            try {
                const holders = await fetch(`https://internal.suivision.xyz/mainnet/api/coin/holders?coinType=0x62f293070ec1c34f022680a14c181fe1237524cef7c53c334347eaf358dfb6bd::suiru::SUIRU&pageSize=20&pageIndex=1`)
                const data = await holders.json()
                const holdersData = data.result.map((item: any) => {
                    return {
                        address: item.account,
                        value: Math.round(item.balance * 1000) / 1000
                    }
                })
                setHolders(holdersData)
            } catch (e) {
                console.error('Error fetching holders', e)
            }
        }
        getHolders()
    }, [token])
    return { holders }
}

export const useGetTradingTransactions = (token) => {
    const [wholeTransactions, setWholeTransactions] = useState<any[]>([])
    const [transactions, setTransactions] = useState<any[]>([])
    const [ohlcData, setOhlcData] = useState<any[]>([])
    const [volume, setVolume] = useState(0)
    const intervalMs = 300000
    const getTransactions = async () => {
        try {
            const result = await client.queryEvents({
                query: {
                    MoveEventType: `${OBJECTS.Package}::move_pump::TradedEvent`
                }
            })
            if (result.data.length > 0) {
                let volume = 0
                const ohlcData: any[] = []
                let currentBucket: any;
                const txns = result.data.filter((item: any) => `0x${item.parsedJson.token_address}` == token).map((item: any) => {
                    const date = new Date(Number(item.parsedJson.ts)).toJSON()
                    volume = volume + Number(item.parsedJson.sui_amount)
                    const bucketStart = Math.floor(Number(item.parsedJson.ts) / intervalMs) * intervalMs;
                    const price = item.parsedJson.sui_amount / item.parsedJson.token_amount / 1000
                    if (!currentBucket || currentBucket.start !== bucketStart) {
                        if (currentBucket) ohlcData.push(currentBucket);
                        currentBucket = {
                            time: bucketStart,
                            open: price,
                            high: price,
                            low: price,
                            close: price,
                        };
                    } else {
                        currentBucket.high = Math.max(currentBucket.high, price);
                        currentBucket.low = Math.min(currentBucket.low, price);
                        currentBucket.close = price;
                    }

                    return {
                        Maker: item.parsedJson.user,
                        Type: item.parsedJson.is_buy ? 'Buy' : 'Sell',
                        Amount: format9(item.parsedJson.sui_amount),
                        date: `${date.slice(5, 10)} ${(date.slice(11, 16))}`,
                        Tx: item.id.txDigest
                    }
                })
                setTransactions(txns)
                setVolume(volume)
                setOhlcData(ohlcData)
                setWholeTransactions(result.data)
            }
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        getTransactions()
    }, [])

    const refetch = useCallback(() => {
        getTransactions()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return { refetch, transactions, volume, ohlcData, wholeTransactions }
}

export const useGetBoost = (token) => {
    const [wholeBoostData, setWholeBoostData] = useState<any[]>([])
    const [boostStatus, setBoostState] = useState(0)
    const [boosting, setBoosting] = useState(false)
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
    const boost = async (suiAmount, option) => {
        setBoosting(true)
        try {
            const tx = new Transaction()
            const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(suiAmount)])
            tx.moveCall({
                arguments: [
                    tx.object(OBJECTS.Boost_Config),
                    coin,
                    tx.pure.u64(option),
                    tx.object('0x6')
                ],
                typeArguments: [token],
                target: `${OBJECTS.Package_Boost}::boost_payement::pay`
            })
            signAndExecuteTransaction({ transaction: tx }, {
                onSuccess: result => {
                    console.log(result)
                    setBoosting(false)
                    toast.success(ToastSuccessLink({ message: 'Successfully boosted! You have to wait more time to see changed value!', link: result.digest }))
                },
                onError: (e) => {
                    setBoosting(false)
                    toast.error('There is a problem to boost!')
                    console.error(e)
                }
            })
        } catch (e) {
            console.error(e)
            toast.error('There is a problem to boost!')
            setBoosting(false)
        }
    }

    const queryEvent = async (token) => {
        try {
            const createdEvents = await client.queryEvents({
                query: {
                    MoveEventType: `${OBJECTS.Package_Boost}::boost_payement::PaymentEvent`
                }
            })
            if (!createdEvents.data) return
            const currentTime = Date.now()
            const matchedEvents = createdEvents.data.filter((item: any) => `0x${item.parsedJson.coin_type}` == token).filter((item: any) => (item.parsedJson.end_time * 1000 >= currentTime && item.parsedJson.start_time * 1000 <= currentTime))
            const boostSum = matchedEvents.reduce((sum, item: any) => { return sum + Number(item.parsedJson.boost) }, 0)
            setBoostState(boostSum)
            setWholeBoostData(createdEvents.data)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        queryEvent(token)
    }, [token])

    const refetch = useCallback(() => {
        queryEvent(token)
    }, [token])

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return { boosting, boost, boostStatus, refetch, wholeBoostData }
}

export const useGetMessages = (token) => {
    const [messages, setMessages] = useState<any[]>([])
    const [signing, setSigning] = useState(false)
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
    const [update, setUpdate] = useState(0)
    const sign = async (message) => {
        setSigning(true)
        try {
            const tx = new Transaction()
            const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(10000000)])
            tx.moveCall({
                arguments: [
                    tx.object(OBJECTS.Boost_Config),
                    coin,
                    tx.pure.string(message),
                    tx.pure.string(''),
                    tx.object('0x6')
                ],
                typeArguments: [token],
                target: `${OBJECTS.Package_Boost}::boost_payement::send_message_v3`
            })
            signAndExecuteTransaction({ transaction: tx }, {
                onSuccess: result => {
                    console.log(result)
                    setSigning(false)
                    setUpdate(prev => prev + 1)
                    toast.success(ToastSuccessLink({ message: 'Successfully sent message!', link: result.digest }))
                },
                onError: (e) => {
                    setSigning(false)
                    toast.error('There is a problem to sign!')
                    console.error(e)
                }
            })
        } catch (e) {
            console.error(e)
            toast.error('There is a problem to sign!')
            setSigning(false)
        }
    }

    useEffect(() => {
        const queryEvent = async () => {
            try {
                const createdEvents = await client.queryEvents({
                    query: {
                        MoveEventType: `${OBJECTS.Package_Boost}::boost_payement::MessageEventV3`
                    }
                })
                if (!createdEvents.data) return
                const matchedEvents = createdEvents.data.filter((item: any) => `0x${item.parsedJson.coin_type}` == token)
                if (matchedEvents.length > 0) {
                    const messageData = matchedEvents.map((item: any) => {
                        const date = new Date(item.parsedJson.start_time * 1000).toJSON()
                        return {
                            sender: item.parsedJson.user,
                            content: item.parsedJson.message,
                            date: `${date.slice(5, 10)} ${(date.slice(12, 16))}`,
                            avatar: item.parsedJson.image_url
                        }
                    })
                    setMessages(messageData)
                }
            } catch (e) {
                console.error(e)
            }
        }
        queryEvent()
    }, [token, update])

    return { signing, signMessage: sign, messages }
}