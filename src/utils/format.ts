export const format6 = (v: any) => {
    return Math.round(Number(v) / 10000) / 1000
}

export const format9 = (v: any) => {
    return Math.round(Number(v) / 1000000) / 1000
}
