import { useEffect, useState, createContext, useContext } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { init, useConnectWallet, useAppState } from '@web3-onboard/react'
import { ethers, getDefaultProvider } from 'ethers'

import injectedModule from '@web3-onboard/injected-wallets'

import Link from 'next/link'

import Apollo from './api/apollo'
import Balances from './components/Balances'
import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'

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
  fontFamily: 'inherit',
}

const rpcUrl = process.env.NEXT_PUBLIC_GOERLI_URL

// initialize Onboard
init({
  wallets: [injected],
  chains: [
    {
      id: '0x5',
      token: 'ETH',
      label: 'Goerli Testnet',
      rpcUrl,
    },
  ],
})

//export default
export default function Home() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const walletAddress = wallet?.accounts?.[0].address

  return (
    <Flex flexDir="column">
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

        <Flex
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
          mt="72px"
        >
          <Heading as="h1" size="lg" textAlign="center">
            OmniTransfer - Transfer all your tokens & positions in one click
          </Heading>
          {!wallet && (
            <Button
              style={buttonStyles}
              disabled={connecting}
              onClick={() => (wallet ? disconnect(wallet) : connect())}
            >
              {connecting ? 'Connecting' : 'Connect'}
            </Button>
          )}
          {wallet && (
            <VStack>
              <Text size="md">Address connected: {walletAddress} </Text>
              <Balances />
            </VStack>
          )}
          <Apollo />
        </Flex>
      </div>
    </Flex>
  )
}
