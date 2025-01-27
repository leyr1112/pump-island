import { PumpConfig } from "../config"

const remainTokenAmount = PumpConfig.InitialVirtualTokenReserves - PumpConfig.RemainTokenReserves

export const suiToToken = (suiAmount) => {
    let tokenAmount = remainTokenAmount - (remainTokenAmount * PumpConfig.InitialVirtualSuiReseves / (BigInt(Math.ceil(suiAmount * 1000000000 / 1.05) - 1) + PumpConfig.InitialVirtualSuiReseves))
    return tokenAmount < 0 ? 0 : tokenAmount
}