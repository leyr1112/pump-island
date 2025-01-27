import '@mysten/dapp-kit/dist/index.css';

import React from "react";
import Dashboard from "./container/Dashboard";
import CreateToken from "./container/CreateToken.tsx";
import NotFound from "./container/NotFound";
import Trade from "./container/Trade";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params';
import { WagmiProvider } from 'wagmi'
import { bsc, mainnet, base, polygon, bscTestnet } from 'wagmi/chains'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import EditProfile from "./container/EditProfile";

import toast, { ToastBar, Toaster } from "react-hot-toast";
import './index.css';
import AboutUs from "./container/AboutUs";
import Faq from "./container/Faq";
import { config } from "./config.jsx";

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppProvider from './context/index.jsx'

// const projectId = '4807d388fe495226b7fc14743af2e1d9'
const projectId = '166c810a1a76fedfcbfb4a4c442c40ed'
const metadata = {
  name: 'My Celo App',
  description: 'My Website description',
  url: 'https://blackpump.fun',
  icons: ['https://avatars.blackpump.fun/']
};

const chains = [
  bsc,
  bscTestnet,
  mainnet,
  base,
  polygon,
  // arbitrum,
  // avalanche,
];

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({
  themeVariables: {
    '--w3m-accent': '#F3CC2F',
    '--w3m-border-radius-master': '1px'
  },
  projectId,
  metadata,
  wagmiConfig
})

const queryClient = new QueryClient();
const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
};


const App = () => {
  return (
    <Router>
      <QueryParamProvider>
        <div>
          <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networks} defaultNetwork="mainnet">
              <WalletProvider>
                <AppProvider>
                  <WagmiProvider config={config}>
                    <Toaster
                      position="top-right"
                      reverseOrder={true}
                      toastOptions={{ duration: 5000 }}
                    >
                      {(t) => (
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => toast.dismiss(t.id)}
                        >
                          <ToastBar onClick={() => alert(1)} toast={t} />
                        </div>
                      )}
                    </Toaster>
                    <Switch>
                      <Route exact path="/">
                        <Dashboard />
                      </Route>
                      {/* <Route exact path="/MyContributions">
                        <MyContributions />
                      </Route> */}
                      <Route exact path="/dashboard">
                        <Dashboard />
                      </Route>
                      <Route exact path="/create">
                        <CreateToken />
                      </Route>
                      <Route exact path="/trade">
                        <Trade />
                      </Route>
                      {/* <Route exact path="/Profile">
                        <Profile />
                      </Route> */}
                      <Route exact path="/EditProfile">
                        <EditProfile />
                      </Route>
                      <Route exact path="/about-us">
                        <AboutUs />
                      </Route>
                      <Route exact path="/FAQ">
                        <Faq />
                      </Route>
                      <Route exact path="/NotFound">
                        <NotFound />
                      </Route>
                    </Switch>
                  </WagmiProvider>
                </AppProvider>
              </WalletProvider>
            </SuiClientProvider>
          </QueryClientProvider>
        </div>
      </QueryParamProvider>
    </Router>
  );
};

export default App;
