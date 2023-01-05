import React, { useMemo, useState } from 'react'
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { StepEnum } from '../pages'
import Balances, { WrapperTokenType } from './Balances'
import DebtBalances from './DebtBalances'
import ConnectWallet from './ConnectWallet'

type Props = {
  currentStep: StepEnum
  nextStep: () => void
  refreshTokenBalances: () => Promise<void>
  aTokenBalances: WrapperTokenType[]
  stableDebtBalances: WrapperTokenType[]
  variableDebtBalances: WrapperTokenType[]
}

const Dashboard = ({
  currentStep,
  nextStep,
  refreshTokenBalances,
  aTokenBalances,
  stableDebtBalances,
  variableDebtBalances,
}: Props) => {
  const isButtonEnabled = useMemo(() => {
    if (currentStep === StepEnum.APPROVE_A_TOKENS) {
      return aTokenBalances.every((token) => token.allowance.gte(token.balance))
    }

    // TODO: Add logic for debt positions
    return false
  }, [aTokenBalances, currentStep])

  return (
    <Flex flexDir="column">
      {{
        [StepEnum.CONNECT_WALLET]: <ConnectWallet nextStep={nextStep} />,
        [StepEnum.APPROVE_A_TOKENS]: (
          <Balances
            refreshTokenBalances={refreshTokenBalances}
            aTokenBalances={aTokenBalances}
          />
        ),
        [StepEnum.APPROVE_DEBT_POSITIONS]: (
          <DebtBalances
            refreshTokenBalances={refreshTokenBalances}
            stableDebtBalances={stableDebtBalances}
            variableDebtBalances={variableDebtBalances}
          />
        ),
      }[currentStep] ?? null}
      {currentStep != StepEnum.CONNECT_WALLET && (
        <Button
          alignSelf="center"
          backgroundColor="red"
          textColor="white"
          onClick={nextStep}
          mt="5"
          disabled={!isButtonEnabled}
        >
          Next
        </Button>
      )}
    </Flex>
  )
}

export default Dashboard
