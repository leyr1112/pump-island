import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { useGetSuiBalance, useGetSuiPrice, useGetTokenBalances } from '../hooks/index.ts'

const INIT_STATE = {
    suiBalance: 0,
    tokenBalances: []
}

const AppContext = createContext()

export const useApp = () => useContext(AppContext)

const reducer = (state, { type, payload }) => {
    return {
        ...state,
        [type]: payload
    }
}

export default function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, INIT_STATE)
    const changeVariable = (key, value) => {
        dispatch({
            type: key,
            payload: value
        })
    }

    const { suiPrice, refetch: refetchSuiprice } = useGetSuiPrice()

    useEffect(() => {
        const interval = setInterval(() => {
            refetchSuiprice();
        }, 60000);

        return () => clearInterval(interval);
    }, [refetchSuiprice]);

    useEffect(() => {
        if (suiPrice) {
            changeVariable('suiPrice', suiPrice)
        }
    }, [suiPrice]);


    const { suiBalance, refetch: refetchSuiBalance } = useGetSuiBalance()
    useEffect(() => {
        const interval = setInterval(() => {
            refetchSuiBalance();
        }, 5000);

        return () => clearInterval(interval);
    }, [refetchSuiBalance]);

    useEffect(() => {
        if (suiBalance) {
            changeVariable('suiBalance', suiBalance)
        }
    }, [suiBalance]);

    const { tokenBalances, refetch: refetchtokenBalances } = useGetTokenBalances()
    useEffect(() => {
        const interval = setInterval(() => {
            refetchtokenBalances();
        }, 5000);

        return () => clearInterval(interval);
    }, [refetchtokenBalances]);

    useEffect(() => {
        if (tokenBalances) {
            changeVariable('tokenBalances', tokenBalances)
        }
    }, [tokenBalances]);

    return (
        <AppContext.Provider value={{ state, changeVariable }}>
            {children}
        </AppContext.Provider>
    )
}
