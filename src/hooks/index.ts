import { useCallback, useEffect, useMemo, useState } from 'react'
import { OBJECTS, PumpConfig } from '../config'
import { useApp } from '../context'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import {
    useCurrentAccount,
    useSignAndExecuteTransaction
} from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { intoBase64 } from '../utils/pkg.ts'
import toast from 'react-hot-toast'

const client = new SuiClient({ url: getFullnodeUrl('testnet') })

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
    console.log(state)
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
    const [loading, setLoading] = useState(false)
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
    const createToken = async (tokenName, tokenSymbol, tokenDescription, tokenLogo, website, telegram, twitter, inputAmout) => {
        setLoading(true)
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
                signAndExecuteTransaction(
                    { transaction: tx },
                    {
                        onSuccess: async (result) => {
                            console.log('executed transaction', result)
                            const digest = result.digest
                            if (digest) {
                                toast.success('Successfully created token!')
                                creatPool(digest, tokenName, tokenSymbol, tokenDescription, tokenLogo, website, telegram, twitter, inputAmout)
                            }
                        }
                    }
                )
            }
        } catch (e) {
            console.error(e)
            toast.error('There is some problem to create token!')
        } finally {
            setLoading(false)
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
        if (account) {
            const transactionResult = await waitForTransaction(digest)
            console.log(transactionResult)
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
                            tx.pure.u64((inputAmout * 1000000000 - 1) * 200000),
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
                        toast.success('Successfully pump created!')
                    }
                })
            }
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
    const buy = async (inputTokenType, inputAmout) => {
        setLoading(true)
        try {
            if (account?.address) {
                const tx = new Transaction()
                if (inputTokenType == "SUI") {
                    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(inputAmout * 1000000000)])
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
                        }
                    })
                } else {
                    const [coin] = tx.splitCoins(token, [tx.pure.u64(inputAmout * 1000000)])
                    tx.moveCall({
                        arguments: [
                            tx.object(OBJECTS.Configuration),
                            coin,
                            tx.pure.u64(inputAmout * 1000000),
                            tx.object('0x6')
                        ],
                        typeArguments: [token],
                        target: `${OBJECTS.Package}::move_pump::sell`
                    })
                    signAndExecuteTransaction({ transaction: tx }, {
                        onSuccess: result => {
                            console.log(result)
                        }
                    })
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
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
                        tx.pure.u64(Number(amount) * 1000000000),
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
                        tx.pure.u64(Number(amount) * 1000000)
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

export const useGetEstimateOut = (input, output, token) => {
    const [estimateInput, setEstimateInput] = useState(0)
    const [estimateOutput, setEstimateOutput] = useState(0)

    const getEstimateOut = async (input, output) => {
        try {
            const tx = new Transaction()
            tx.moveCall({
                arguments: [
                    tx.object(OBJECTS.Configuration),
                    tx.pure.u64(input),
                    tx.pure.u64(output)
                ],
                typeArguments: [token],
                target: `${OBJECTS.Package}::move_pump::estimate_amount_out`
            })
            const data = await client.devInspectTransactionBlock({
                sender: '0x0000000000000000000000000000000000000000000000000000000000000006',
                transactionBlock: tx
            })
            const returnValues = data!["results"]![0]!["returnValues"];
            const r0 = Buffer.from(returnValues![0]![0]).toString()
            const r1 = Buffer.from(returnValues![1]![0]).toString()
            console.log(r0, r1)
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        getEstimateOut(input, output)
    }, [input, output])
    return { estimateInput, estimateOutput }
}

// Dashboard page hook
export const useGetPools = () => {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { changeVariable } = useApp()
    const { suiPrice } = useGetSuiPrice()
    useEffect(() => {
        const getPools = async () => {
            setLoading(true)
            try {
                const createdEvents = await client.queryEvents({
                    query: {
                        MoveEventType: `${OBJECTS.Package}::move_pump::CreatedEvent`
                    }
                })
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
                        progress: realSuiReserves / PumpConfig.Threshod * 100,
                        marketCap: tokenPrice * 10000000000,
                        tokenPrice,
                        liquidity: realSuiReserves / 1000000000 * suiPrice,
                        poolObjectId,
                        raisingPercent: undefined,
                        suiPrice,
                        tokenSuiPrice: virtualSuiReserves / virtualTokenReserves / 1000
                    }

                    changeVariable(address, result)

                    return result
                }))
                setData(poolsDataAdd)
            } catch (e) {
                console.error('Error fetching pools', e)
            } finally {
                setLoading(false)
            }
        }
        getPools()
    }, [suiPrice])
    const pools = useMemo(() => data, [data])
    return { pools, loading }
}

export const useGetPool = (token) => {
    const tokenAddress = token
    const { suiPrice } = useGetSuiPrice()
    const { pools } = useGetPools()
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
    useEffect(() => {
        const pool = pools.find((pool) => pool.address == token)
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
        }
    }, [pools, token])
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
        tokenSuiPrice
    }
}