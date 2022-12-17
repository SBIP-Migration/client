import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { init, useConnectWallet } from '@web3-onboard/react'
import { ethers } from 'ethers'

import injectedModule from '@web3-onboard/injected-wallets'

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
const rpcUrl = process.env.RPCURL
console.log("rpcUrl",rpcUrl)
// initialize Onboard
init({
  wallets: [injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl
    }
  ]
})

export default function Home() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  // create an ethers provider
  let ethersProvider

  if (wallet) {
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
  }

  return (
    <div className={styles.container}>
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
      </main>
    </div>
  )
}