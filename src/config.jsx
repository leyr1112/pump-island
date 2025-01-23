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
  Configuration: "0x84552ea48128a8e341890ad4c7d498039d8fc21e3320ff5acf4884265a5881e0",
  Package: "0x9b4602a313e9be4feaed9b5a8075c5b5f4c6dce9c0c6b37c5787562bf51cc483",
  Threshold: "0xaac1ced0598914100f5c2b116cd04176b6b8421c519679d9dcf85b47e0f06ac8",
  Package_Boost: "0x06d766b608377c5fe22781821a2b67f421d76b0347509a3af2ac54f2997bea09",
  Boost_Config: "0xb85f9d96f3ac14c1ba93b82e65d4cda25e8733d4f68cd112321c100bace59941",
}

export const ScanUrl = {
  Coin: 'https://suivision.xyz/coin/',
  Package: 'https://suivision.xyz/package/',
  TxBlock: 'https://suivision.xyz/txblock/',
  Object: 'https://suivision.xyz/object/'
}

export const PumpConfig = {
  InitialVirtualTokenReserves: 10000000000000000n,
  RemainTokenReserves: 2000000000000000,
  Threshod: 4000000000
}