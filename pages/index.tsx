import { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { init, useConnectWallet } from '@web3-onboard/react'

import Balances, { WrapperTokenType } from '../components/Balances'
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
  Center,
} from '@chakra-ui/react'
import { getWeb3Provider } from '../utils/ethers'
import {
  getATokenBalances,
  getStableDebtBalances,
  getVariableDebtBalances,
} from '../utils/balances'
import { ethers } from 'ethers'
import StepProgress from '../components/step-progress/stepProgress'
import Dashboard from '../components/Dashboard'

export enum StepEnum {
  CONNECT_WALLET = 1,
  APPROVE_A_TOKENS = 2,
  APPROVE_DEBT_POSITIONS = 3,
  TRANSFER_TOKENS = 4,
  COMPLETE = 5,
}

export default function Home() {
  const [{ wallet }] = useConnectWallet()
  const [currentStep, updateCurrentStep] = useState<StepEnum>(
    StepEnum.CONNECT_WALLET
  )

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

  const onRefreshTokenBalances = async () => {
    await getAllBalances(walletSigner)
  }

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
    <Flex flexDir="column" height="100vh">
      <Head>
        <title>OmniTransfer</title>
        <meta
          name="description"
          content="Migrate your Aave positions to another wallet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex flexDir="column" alignItems="center" height="100%" mt="72px">
        <Heading as="h1" size="lg" textAlign="center" mb="4" maxW="500px">
          OmniTransfer <br /> Transfer all your tokens & positions in one click
        </Heading>

        <VStack height="100%" pt="5">
          {walletSigner && (
            <Text size="md">Address connected: {walletSigner} </Text>
          )}
          <StepProgress
            {...{
              currentStep,
              updateStep: updateCurrentStep,
            }}
          />
          <Dashboard
            {...{
              currentStep,
              nextStep: () => updateCurrentStep(currentStep + 1),
              refreshTokenBalances: onRefreshTokenBalances,
              aTokenBalances,
              stableDebtBalances,
              variableDebtBalances,
            }}
          />
        </VStack>
      </Flex>
    </Flex>
  )
}
