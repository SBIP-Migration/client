import { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { init, useConnectWallet } from '@web3-onboard/react'

import injectedModule from '@web3-onboard/injected-wallets'

import Link from 'next/link'

import Apollo from './api/apollo'
import Balances, { WrapperTokenType } from './components/Balances'
import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { getWeb3Provider } from '../utils/ethers'
import {
  getATokenBalances,
  getStableDebtBalances,
  getVariableDebtBalances,
} from '../utils/balances'
import { ethers } from 'ethers'

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

export default function Home() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const walletSigner = wallet?.accounts?.[0].address

  const [provider, setProvider] = useState<ethers.providers.Provider>()
  const [aTokenBalances, setATokenBalances] = useState<WrapperTokenType[]>([])
  const [stableDebtBalances, setStableDebtBalances] = useState<
    WrapperTokenType[]
  >([])
  const [variableDebtBalances, setVariableDebtBalances] = useState<
    WrapperTokenType[]
  >([])

  const getAllBalances = useCallback(
    async (address: string) => {
      if (!provider) return
      const [
        aTokenBalancesPromise,
        stableDebtBalancesPromise,
        variableDebtBalancesPromise,
      ] = await Promise.allSettled([
        getATokenBalances(provider, address),
        getStableDebtBalances(provider, address),
        getVariableDebtBalances(provider, address),
      ])
      if (aTokenBalancesPromise.status === 'fulfilled') {
        setATokenBalances(aTokenBalancesPromise.value)
      }

      if (stableDebtBalancesPromise.status === 'fulfilled') {
        setStableDebtBalances(stableDebtBalancesPromise.value)
      }

      if (variableDebtBalancesPromise.status === 'fulfilled') {
        setVariableDebtBalances(variableDebtBalancesPromise.value)
      }
    },
    [provider]
  )

  useEffect(() => {
    if (!wallet) return
    setProvider(getWeb3Provider(wallet))
  }, [wallet])

  useEffect(() => {
    ;(async () => {
      if (walletSigner?.length && provider != null) {
        await getAllBalances(walletSigner)
      }
    })()
  }, [walletSigner, getAllBalances, provider])

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
              <Text size="md">Address connected: {walletSigner} </Text>
              <Balances
                refreshTokenBalances={() => getAllBalances(walletSigner)}
                aTokenBalances={aTokenBalances}
              />
            </VStack>
          )}
          <Apollo />
        </Flex>
      </div>
    </Flex>
  )
}
