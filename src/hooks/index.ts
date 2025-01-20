import { useCallback, useEffect, useMemo, useState } from 'react'
import { OBJECTS } from '../config'
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

// Global Hook
export const useGetConfiguration = () => {
    const [config, setConfig] = useState<{}>()

    const getConfiguration = async () => {
        const configuration = await client.getObject({
            id: OBJECTS.Configuration,
            options: { showContent: true }
        })
        const configurationFields = (configuration?.data?.content as any)?.fields
        const threshold = await client.getObject({
            id: OBJECTS.Threshold,
            options: { showContent: true }
        })
        const thresholdFields = (threshold?.data?.content as any)?.fields
        setConfig({ ...configurationFields, ...thresholdFields })
    }

    useEffect(() => {
        getConfiguration()
    }, [])

    const refetch = useCallback(() => { getConfiguration() }, [])
    return { config, refetch }
}

export const useGetSuiBalance = () => {
    const [suiBalance, setSuiBalance] = useState<any>()
    const account = useCurrentAccount()
    const getSuiBalance = async (address) => {
        const result = await client.getBalance({ owner: address })
        const totalBalance = result.totalBalance
        setSuiBalance(totalBalance)
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
        const result = await client.getAllBalances({ owner: address })
        setTokenBalances(result)
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
    const [suiPrice, setSuiPrice] = useState(4.5)
    const getSuiprice = async () => {
        const response = await fetch('https://api.diadata.org/v1/assetQuotation/Sui/0x2::sui::SUI')
        const data = await response.json()
        setSuiPrice(data.Price)
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
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
    const createToken = async (tokenName, tokenSymbol, tokenDescription, tokenLogo, website, telegram, twitter) => {
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
                                creatPool(digest, tokenName, tokenSymbol, tokenDescription, tokenLogo, website, telegram, twitter)
                            }
                        }
                    }
                )
            }
        } catch (e) {
            console.error(e)
        }
    }

    const creatPool = async (digest, tokenName, tokenSymbol, tokenDescription, tokenLogo, website, telegram, twitter) => {
        if (account) {
            const transactionResult = await client.getTransactionBlock({
                digest: digest,
                options: { showObjectChanges: true }
            })
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
                const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(1000000000)])
                tx.moveCall({
                    arguments: [
                        tx.object(OBJECTS.Configuration),
                        tx.object(treasuryCap),
                        coin,
                        tx.pure.u64(1000000000),
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

                signAndExecuteTransaction({ transaction: tx }, {
                    onSuccess: result => {
                        console.log(result)
                    }
                })
            }
        }
    }

    return { createToken }
}

export const useTrade = () => {
    const account = useCurrentAccount()
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
    const buy = async () => {
        if (account?.address) {
            console.log(account?.address)
            const tx = new Transaction()
            const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(100000000)])
            tx.moveCall({
                arguments: [
                    tx.object(OBJECTS.Configuration),
                    tx.object(OBJECTS.Threshold),
                    coin,
                    tx.pure.u64(1000000000000),
                    tx.object('0x6')
                ],
                typeArguments: [`${'0xd9b96ebee3d8c37c3a99b84682abaea48e76823731e353162bb2a945bc25eabe'}::test::TEST`],
                target: `${OBJECTS.Package}::move_pump::buy_v2`
            })

            signAndExecuteTransaction(
                {
                    transaction: tx
                },
                {
                    onSuccess: result => {
                        console.log(result)
                    }
                }
            )

        }

    }

    return { buy }

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
                const threshold = await client.getObject({
                    id: OBJECTS.Threshold,
                    options: { showContent: true }
                })
                const thresholdFields = (threshold?.data?.content as any)?.fields
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
                        progress: realSuiReserves / thresholdFields.threshold * 100,
                        marketCap: virtualTokenReserves / virtualSuiReserves * suiPrice,
                        Liquidity: virtualSuiReserves * suiPrice * 2,
                        poolObjectId,
                        raisingPercent: 0,
                        suiPrice,
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
    const [Liquidity, setLiquidity] = useState('0')
    const [marketCap, setMarketCap] = useState('0')
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
            setLiquidity(pool.Liquidity)
            setMarketCap(pool.marketCap)
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
        Liquidity,
        marketCap
    }
}