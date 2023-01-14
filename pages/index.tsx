import { useEffect, useState, useCallback, useRef } from 'react'
import Head from 'next/head'
import { useConnectWallet } from '@web3-onboard/react'

import { WrapperTokenType } from '../components/Balances'
import { Flex, Text, Image, VStack } from '@chakra-ui/react'
import { getWeb3Provider } from '../utils/ethers'
import {
  getATokenBalances,
  getStableDebtBalances,
  getTokenAllowance,
  getTokenBalance,
  getVariableDebtBalances,
  updateStableDebtAllowances,
  updateVariableDebtAllowances,
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

// Refresh only 1 token balance at a time
// Update refresh callback function

export default function Home() {
  const [{ wallet }] = useConnectWallet()
  const [currentStep, updateCurrentStep] = useState<StepEnum>(
    StepEnum.CONNECT_WALLET
  )
  const hasWalletBeenConnectedBeforeRef = useRef<boolean>()

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
        console.log(
          'aTokenBalancesPromise.value',
          aTokenBalancesPromise.value.map((t) => t.balance.toString())
        )
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

  const onRefreshTokenBalance = async (token: WrapperTokenType) => {
    const tokenIdx = aTokenBalances.findIndex(
      (t) => t.contractAddress === token.contractAddress
    )

    if (tokenIdx == -1) return

    const prevTokenBalance = aTokenBalances[tokenIdx]

    const newTokenBalance = await getTokenBalance(
      provider,
      walletSigner,
      token.contractAddress
    )
    const newTokenAllowance = await getTokenAllowance(
      provider,
      walletSigner,
      token.contractAddress
    )

    if (newTokenBalance) {
      setATokenBalances((prev) => [
        ...prev.slice(0, tokenIdx),
        {
          ...prevTokenBalance,
          balance: newTokenBalance,
          allowance: newTokenAllowance,
        },
        ...prev.slice(tokenIdx + 1),
      ])
    }
  }

  const refreshDebtAllowances = async () => {
    const newStableDebtBalances = await updateStableDebtAllowances(
      provider,
      walletSigner,
      stableDebtBalances
    )
    const newVariableDebtBalances = await updateVariableDebtAllowances(
      provider,
      walletSigner,
      variableDebtBalances
    )

    setStableDebtBalances(newStableDebtBalances)
    setVariableDebtBalances(newVariableDebtBalances)
  }

  useEffect(() => {
    if (!wallet) return
    setProvider(getWeb3Provider(wallet))
  }, [wallet])

  useEffect(() => {
    ;(async () => {
      if (
        walletSigner?.length &&
        provider != null &&
        // Don't fetch all balances for recipient wallet
        hasWalletBeenConnectedBeforeRef.current === undefined
      ) {
        await getAllBalances(walletSigner)
        hasWalletBeenConnectedBeforeRef.current = true
      }
    })()
  }, [walletSigner, getAllBalances, provider])

  useEffect(() => {
    return () => {
      localStorage.removeItem('recipient')
    }
  }, [])

  return (
    <>
      <div className="bgContainer">
        <div className="bgStart">
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
              <Flex>
                <h1 className="pixel_font" style={{ fontSize: 70 }}>
                  OmniTransfer
                </h1>
                <Flex ml="2" mt="5">
                  <Image
                    className="relative sizing"
                    src={'/omni_mascot.png'}
                    alt="omni mascot"
                  />
                </Flex>
              </Flex>
              <h1
                className="pixel_font"
                style={{ fontSize: 40, textAlign: 'center' }}
              >
                Transfer all Aave related tokens & positions
              </h1>
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
                    onRefreshTokenBalance,
                    aTokenBalances,
                    stableDebtBalances,
                    variableDebtBalances,
                    refreshDebtAllowances,
                  }}
                />
              </VStack>
            </Flex>
          </Flex>
        </div>
      </div>
    </>
  )
}
