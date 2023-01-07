import React, { useCallback, useMemo, useState } from 'react'
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import { StepEnum } from '../pages'
import Balances, { WrapperTokenType } from './Balances'
import DebtBalances from './Debtbalances'
import ConnectWallet from './ConnectWallet'
import ExecuteTransfer from './ExecuteTransfer'

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
  const [
    approvedCreditDelegationAddresses,
    setApprovedCreditDelegationAddresses,
  ] = useState<string[]>([])

  const isButtonEnabled = useMemo(() => {
    if (currentStep === StepEnum.APPROVE_A_TOKENS) {
      return (
        aTokenBalances.length > 0 &&
        aTokenBalances.every((token) => token.allowance.gte(token.balance))
      )
    }

    if (currentStep === StepEnum.APPROVE_DEBT_POSITIONS) {
      const numStableDebt = stableDebtBalances.filter((bal) =>
        bal.balance.gt(0)
      ).length
      const numVariableDebt = variableDebtBalances.filter((bal) =>
        bal.balance.gt(0)
      ).length

      return (
        numStableDebt + numVariableDebt >=
        approvedCreditDelegationAddresses.length
      )
    }

    // TODO: Add logic for debt positions
    return false
  }, [
    aTokenBalances,
    approvedCreditDelegationAddresses.length,
    currentStep,
    stableDebtBalances,
    variableDebtBalances,
  ])

  const addApprovedCreditDelegationAddress = useCallback(
    (contractAddress: string) => {
      setApprovedCreditDelegationAddresses((addresses) => [
        ...addresses,
        contractAddress,
      ])
    },
    []
  )

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
            stableDebtBalances={stableDebtBalances}
            variableDebtBalances={variableDebtBalances}
            addApprovedCreditDelegationAddress={
              addApprovedCreditDelegationAddress
            }
            approvedCreditDelegationAddresses={
              approvedCreditDelegationAddresses
            }
          />
        ),
        [StepEnum.TRANSFER_TOKENS]: (
          <ExecuteTransfer
            stableDebtBalances={stableDebtBalances}
            variableDebtBalances={variableDebtBalances}
            aTokenBalances={aTokenBalances}
          />
        ),
      }[currentStep] ?? null}
      {currentStep != StepEnum.CONNECT_WALLET &&
        currentStep != StepEnum.TRANSFER_TOKENS && (
          <Button
            alignSelf="center"
            backgroundColor="red"
            textColor="white"
            onClick={nextStep}
            mt="5"
            disabled={!isButtonEnabled}
            mb='120'
          >
            Next
          </Button>
        )}
    </Flex>
  )
}

export default Dashboard
