import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { useGetConfiguration, useGetSuiBalance, useGetSuiPrice, useGetPools } from '../hooks/index.ts'

const INIT_STATE = {
    suiBalance: '0.000'
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

    const { config, refetch: refetchConfig } = useGetConfiguration()

    useEffect(() => {
        const interval = setInterval(() => {
            refetchConfig();
        }, 60000);

        return () => clearInterval(interval);
    }, [refetchConfig]);

    useEffect(() => {
        if (config) {
            changeVariable('config', config)
        }
    }, [config]);

    const { suiPrice, refetch: refetchSuiprice } = useGetSuiPrice()

    useEffect(() => {
        const interval = setInterval(() => {
            refetchSuiprice();
        }, 10000);

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
        }, 10000);

        return () => clearInterval(interval);
    }, [refetchSuiBalance]);

    useEffect(() => {
        if (suiBalance) {
            changeVariable('suiBalance', suiBalance)
        }
    }, [suiBalance]);

    return (
        <AppContext.Provider value={{ state, changeVariable }}>
            {children}
        </AppContext.Provider>
    )
}
