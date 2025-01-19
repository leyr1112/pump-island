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

export const OBJECTS = {
  Configuration: "0x5c58b3ae84853f0abd83669a357afcd5f6801522aa7d3b5eed60fdf45c369654",
  Package: "0x85e83633de4c059be9e77bed17ddaa0d5f46db45a53d753f9c25db40c62ef419",
  Threshold: "0x8a9aa380a0793bb7ea5447730e5e0d86a3fcee66a84cec701f47d0af8d4c8469"
}