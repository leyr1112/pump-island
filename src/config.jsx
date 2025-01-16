import { http, createConfig } from '@wagmi/core'
import {bsc, mainnet, base, polygon, arbitrum, avalanche, bscTestnet } from '@wagmi/core/chains'

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