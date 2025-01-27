import { http, createConfig } from '@wagmi/core'
import { bsc, mainnet, base, polygon, arbitrum, avalanche, bscTestnet } from '@wagmi/core/chains'

const projectId = '4807d388fe495226b7fc14743af2e1d9'

export const config = createConfig({
  chains: [bsc, polygon],
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
  Configuration: "0x4f4ad9255c2bc69e7cff8f2989ffdb1315613f6894d0783961f7810a08d0d057",
  Package: "0x242818b79ffc1e055147116b98d628c0c547daee1529590193cc4e5f6914fb11",
  Threshold: "0xaac1ced0598914100f5c2b116cd04176b6b8421c519679d9dcf85b47e0f06ac8",
  Package_Boost: "0x242818b79ffc1e055147116b98d628c0c547daee1529590193cc4e5f6914fb11",
  Boost_Config: "0x230a466fae4a10ec12c85438f32cf876356a34385c111ee76eceb35850ffeade",
}

export const ScanUrl = {
  Coin: 'https://suivision.xyz/coin/',
  Package: 'https://suivision.xyz/package/',
  TxBlock: 'https://suivision.xyz/txblock/',
  Object: 'https://suivision.xyz/object/'
}

export const PumpConfig = {
  InitialVirtualTokenReserves: 10000000000000000n,
  InitialVirtualSuiReseves: 500000000000n,
  RemainTokenReserves: 2000000000000000n,
  Threshod: 5000000000n
}

export const AdminWallet = '0x612f41e25df69666f8f88d2ca277de8e26f59611e03cdb7e9c1b5d8d0a7a27b3'
export const FeeWallet = '0x612f41e25df69666f8f88d2ca277de8e26f59611e03cdb7e9c1b5d8d0a7a27b3'