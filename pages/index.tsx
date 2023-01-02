import { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { init, useConnectWallet } from '@web3-onboard/react'

import injectedModule from '@web3-onboard/injected-wallets'

import Balances, { WrapperTokenType } from './components/Balances'
import {
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { getWeb3Provider } from '../utils/ethers'
import {
  getATokenBalances,
  getStableDebtBalances,
  getVariableDebtBalances,
} from '../utils/balances'
import { ethers } from 'ethers'
import Step_progess from './stepprogress/step_progress'

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

export default function Home() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const { isOpen, onOpen, onClose } = useDisclosure()

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

  const onDisconnectWallet = () => {
    disconnect(wallet)
  }

  const onConnectRecipientWallet = () => {
    connect()
    onClose()
  }

  useEffect(() => {
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
  }, [])

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
        <Head>
          <title>OmniTransfer</title>
          <meta
            name="description"
            content="Migrate your Aave positions to another wallet"
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
              <Step_progess />
              <Balances
                refreshTokenBalances={() => getAllBalances(walletSigner)}
                aTokenBalances={aTokenBalances}
                stableDebtBalances={stableDebtBalances}
                variableDebtBalances={variableDebtBalances}
              />
            </VStack>
          )}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Switch Wallet</ModalHeader>
              <ModalBody>
                <Text>
                  Disconnect current wallet, and connect the recipient wallet
                </Text>
              </ModalBody>
              <ModalFooter>
                {wallet ? (
                  <Button colorScheme="blue" onClick={onDisconnectWallet}>
                    Disconnect Wallet
                  </Button>
                ) : (
                  <Button colorScheme="blue" onClick={onConnectRecipientWallet}>
                    Connect Recipient Wallet
                  </Button>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </div>
    </Flex>
  )
}
