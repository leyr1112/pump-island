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
  Configuration: "0x58096c6d66c416fb4bf43fc42df5cc8ae44725199a4750c1739fbe37af22b307",
  Package: "0xf749cb5b32a4e5950a943569a9ecfa5a74ab09ebaafa3c2110466dbcc3cd5d38",
  Threshold: "0xc3d79a732d9efa110a38b0f89a450c6559dd61a9f912751ee7d5dee4ca46c9b7",
  Package_Boost: "0xf749cb5b32a4e5950a943569a9ecfa5a74ab09ebaafa3c2110466dbcc3cd5d38",
  Boost_Config: "0xa49dbb6877aa8d68f179a27344d61a81da5e189c02f07ac02f5c30e48e2a27a3",
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
  Threshod: 1800000000000n
}

export const AdminWallet = '0xf3e3d664da7dcb2b074125c66e033eddc2c5509791cca9a0f01bc22ea5dadd78'
export const FeeWallet = '0xf3e3d664da7dcb2b074125c66e033eddc2c5509791cca9a0f01bc22ea5dadd78'

export const POP = '0xbdbfa86e800b120d9648884791bec4d8e982b3a8d4e16afe422c8fe317930618::pop::POP'