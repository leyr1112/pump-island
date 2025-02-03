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
  Configuration: "0xeb2871d773358a9ac8ca774c060a856b41d763cd8bfdd09534cae5bdeaf99db0",
  Package: "0x76fc233683cfa8780c829e2725eaf50371c13d9a79f98305cd43a55e9908fc7d",
  Threshold: "0x487104794b6192db0845b70127c61dc344170ab61562fee915aee590b39a67f5",
  Package_Boost: "0x76fc233683cfa8780c829e2725eaf50371c13d9a79f98305cd43a55e9908fc7d",
  Boost_Config: "0xcbff93c91fb03b995ffc72bb4b7164145f1c80a971cc90f8f2927ee0df883ef0",
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
  Threshod: 2000000000n
}

export const AdminWallet = '0x6a87033a7c2b0a3054fd767fbb82d6348e1e8cbdd685faa90d17e45a6c1fd7aa'
export const FeeWallet = '0x6a87033a7c2b0a3054fd767fbb82d6348e1e8cbdd685faa90d17e45a6c1fd7aa'

export const POP = '0xbdbfa86e800b120d9648884791bec4d8e982b3a8d4e16afe422c8fe317930618::pop::POP'