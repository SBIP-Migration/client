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
  onRefreshTokenBalance: (token: WrapperTokenType) => Promise<void>
  aTokenBalances: WrapperTokenType[]
  stableDebtBalances: WrapperTokenType[]
  variableDebtBalances: WrapperTokenType[]
  refreshDebtAllowances: () => Promise<void>
}

const Dashboard = ({
  currentStep,
  nextStep,
  refreshTokenBalances,
  onRefreshTokenBalance,
  aTokenBalances,
  stableDebtBalances,
  variableDebtBalances,
  refreshDebtAllowances,
}: Props) => {
  const [isSameWallet, setIsSameWallet] = useState<boolean>(true)

  const isButtonEnabled = useMemo(() => {
    if (currentStep === StepEnum.APPROVE_A_TOKENS) {
      return (
        aTokenBalances.length > 0 &&
        aTokenBalances.every((token) => token.allowance.gte(token.balance))
      )
    }

    if (currentStep === StepEnum.APPROVE_DEBT_POSITIONS) {
      const numUndelegatedStableDebt = stableDebtBalances.filter((bal) =>
        bal.balance.gte(bal.allowance)
      ).length
      const numUndelegatedVariableDebt = variableDebtBalances.filter((bal) =>
        bal.balance.gte(bal.allowance)
      ).length

      return numUndelegatedStableDebt > 0 || numUndelegatedVariableDebt > 0
    }

    return false
  }, [aTokenBalances, currentStep, stableDebtBalances, variableDebtBalances])

  return (
    <Flex flexDir="column">
      {{
        [StepEnum.CONNECT_WALLET]: <ConnectWallet nextStep={nextStep} />,
        [StepEnum.APPROVE_A_TOKENS]: (
          <Balances
            refreshTokenBalances={refreshTokenBalances}
            aTokenBalances={aTokenBalances}
            onRefreshTokenBalance={onRefreshTokenBalance}
          />
        ),
        [StepEnum.APPROVE_DEBT_POSITIONS]: (
          <DebtBalances
            stableDebtBalances={stableDebtBalances}
            variableDebtBalances={variableDebtBalances}
            setIsSameWallet={setIsSameWallet}
            refreshDebtAllowances={refreshDebtAllowances}
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
        currentStep != StepEnum.TRANSFER_TOKENS &&
        isSameWallet && (
          <Button
            alignSelf="center"
            backgroundColor="red"
            textColor="white"
            onClick={nextStep}
            mt="5"
            height="10"
            disabled={!isButtonEnabled}
            className="nextbuttonposition"
          >
            Next
          </Button>
        )}
    </Flex>
  )
}

export default Dashboard
