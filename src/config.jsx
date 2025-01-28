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
  Configuration: "0x29fc820afba69b4e4b9b8b6b8ec007d9729d45efb784fc0a84c90034c195fbbd",
  Package: "0x65f259a3e023d195c09bb09851773e744b4888131f7b43bc2345ffa9a92d6d78",
  Threshold: "0x94794552be4a804efc86e7ce65c99acd7ef7213562a75a7d5344370ae37f387c",
  Package_Boost: "0x65f259a3e023d195c09bb09851773e744b4888131f7b43bc2345ffa9a92d6d78",
  Boost_Config: "0x8b27c49eb899467e7ea941242813eabe1e526f66b799f12a195021e315401ce0",
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