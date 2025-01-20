import { http, createConfig } from '@wagmi/core'
import { bsc, mainnet, base, polygon, arbitrum, avalanche, bscTestnet } from '@wagmi/core/chains'

const projectId = '4807d388fe495226b7fc14743af2e1d9'


export const config = createConfig({
  // chains: [mainnet, bsc, base, polygon, arbitrum, avalanche, bscTestnet],
  chains: [bsc, polygon],
  // connectors: [injected()], 
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [avalanche.id]: http(),
  },
  projectId: projectId,
})

export const OBJECTS = {
  Configuration: "0xcc765dd591f5ff48b58814f0579e0e8d4d015f3b0259a46faf041142dc65aa16",
  Package: "0x297bc71b964e641382ef6d2819773cecceb778c43c930734225e1b99d9fe2fe7",
  Threshold: "0xd8ab21b030e670104ad7938dbd419d91822f8556779d1aca86f38364ec6bd6e6"
}

export const ScanUrl = {
  Coin: 'https://suivision.xyz/coin/',
  Package: 'https://suivision.xyz/package/',
  TxBlock: 'https://suivision.xyz/txblock/',
  Object: 'https://suivision.xyz/object/'
}