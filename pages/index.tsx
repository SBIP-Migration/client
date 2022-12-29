import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { init, useConnectWallet } from '@web3-onboard/react'
import { ethers } from 'ethers'

import injectedModule from '@web3-onboard/injected-wallets'

import Positions from './positions'
import Link from "next/link";

import Apollo from './api/apollo'
import Getbalances from './components/getbalances'
const injected = injectedModule()

const buttonStyles = {
  borderRadius: '6px',
  background: '#111827',
  border: 'none',
  fontSize: '18px',
  fontWeight: '600',
  cursor: 'pointer',
  color: 'white',
  padding: '14px 12px',
  marginTop: '40px',
  fontFamily: 'inherit'
}

// Only one RPC endpoint required per chain
const rpcAPIKey = '<INFURA_KEY>' || '<ALCHEMY_KEY>'
const rpcUrl = process.env.NEXT_PUBLIC_GOERLI_URL
console.log("rpcUrl",rpcUrl)
// initialize Onboard
init({
  wallets: [injected],
  chains: [
    {
      id: '0x5',//'0x1',0x5 ****
      token: 'ETH',
      label: 'Goerli Testnet',
      rpcUrl
    }
  ]
})



export default function Home() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [provider, setProvider] = useState()

  // create an ethers provider
  let ethersProvider

  if (wallet) {
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
    setProvider(ethersProvider)
    
    console.log("ethersProvider",ethersProvider)
    // console.log("wallet",wallet)
  }

  return (
    <div className={styles.container}>
      <Link href="/gotoapp">
        <button className="btn btn-danger border-0 history-btn px-4 py-3 ms-auto">
          Go To App
        </button>
      </Link>
      <Head>
        <title>Web3-Onboard Demo</title>
        <meta
          name="description"
          content="Example of how to integrate Web3-Onboard with Next.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to this demo of
          <a href="https://onboard.blocknative.com">
            {' '}
            Web3-Onboard
          </a>
          !
        </h1>
        <button
          style={buttonStyles}
          disabled={connecting}
          onClick={() => (wallet ? disconnect(wallet) : connect())}
        >
          {connecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect'}
        </button>
        {wallet &&
                <div >
                  Im here
                  {wallet.accounts[0].address}
                  <Positions addr={wallet.accounts[0].address}/>
                </div>
            }
        get balances here
        <Getbalances provider={provider}/>
            
            <Apollo/>
      </main>
    </div>
  )
}