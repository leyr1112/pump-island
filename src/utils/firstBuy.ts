import { PumpConfig } from "../config"

export const suiToToken = (suiAmount) => {
    let tokenAmount = PumpConfig.InitialVirtualTokenReserves - (PumpConfig.InitialVirtualTokenReserves * PumpConfig.InitialVirtualSuiReseves / (BigInt(Math.floor(suiAmount * 1000000000 / 1.05) - 1) + PumpConfig.InitialVirtualTokenReserves))
    return tokenAmount
}