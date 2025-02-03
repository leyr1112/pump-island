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
  Configuration: "0x3030ad89f6063124b4a2e4febb59088ed73fe61ac71da5ebb68a67bf5cd142a0",
  Package: "0x7f80040a1b057974e88794fc4562a63a6d0939f063681794c6de51681f104131",
  Threshold: "0x8dd7b36b34c63edf706bae5e5a6323241d9a38eeb0fa2b776bd137f81e482514",
  Package_Boost: "0x7f80040a1b057974e88794fc4562a63a6d0939f063681794c6de51681f104131",
  Boost_Config: "0x97d76f03eb09f43ec7a66428cd63e8eb8cb973e6697b6522c2a493f6e79a6cf2",
}

export const ScanUrl = {
  Coin: 'https://suivision.xyz/coin/',
  Package: 'https://suivision.xyz/package/',
  TxBlock: 'https://suivision.xyz/txblock/',
  Object: 'https://suivision.xyz/object/',
  Address: `https://suivision.xyz/address/`,
}

export const PumpConfig = {
  InitialVirtualTokenReserves: 10000000000000000n,
  InitialVirtualSuiReseves: 500000000000n,
  RemainTokenReserves: 2000000000000000n,
  Threshod: 1800000000n
}

export const AdminWallet = '0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b'
export const FeeWallet = '0xa3385a039f3dda78a198bb559404ebacd4327e496215cb2410582b54d1f2d99a'

export const POP = '0xa5acaa0f77c701fc014550491ea2f126b06124750f3237de18aa3b5dc66be87d::pop::POP'