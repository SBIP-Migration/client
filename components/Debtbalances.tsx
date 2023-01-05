import { BigNumber, ethers } from 'ethers'
import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import { useWallets } from '@web3-onboard/react'
import { approveToken } from '../utils/ethers'
import { AAVE_MIGRATION_CONTRACT } from '../constants'
import { WrapperTokenType } from './Balances'

type Props = {
  stableDebtBalances: WrapperTokenType[]
  variableDebtBalances: WrapperTokenType[]
  refreshTokenBalances: () => Promise<void>
}

const DebtBalances = ({
  stableDebtBalances,
  variableDebtBalances,
  refreshTokenBalances,
}: Props) => {
  // Pop up wallet, while keeping tx state

  return (
    <Flex flexDir="column" mt="32px">
      <Heading textAlign="center" mb="8px">
        Debt Positions
      </Heading>
      <Text mb="28px">
        Please delegate all debt positions to the contract to start the transfer
      </Text>
      <Flex flexDir="column" justifyContent="center" alignItems="center">
        {stableDebtBalances?.map((debt) => (
          <Flex key={debt.symbol} alignItems="center" mb="3">
            <Text size="sm" mb="3.5">
              {debt.symbol} Stable Debt: {debt.balanceInTokenDecimals}
            </Text>
            {/* <Button
                disabled={!!el.allowance.gt(el.balance)}
                onClick={() => onHandleApprove(el)}
              >
                {el.allowance.gt(el.balance) ? 'Approved' : 'Approve'}
              </Button> */}
          </Flex>
        ))}
        {variableDebtBalances?.map((debt) => (
          <Flex key={debt.symbol} alignItems="center" mb="3">
            <Text size="sm" mb="3.5">
              {debt.symbol} Variable Debt: {debt.balanceInTokenDecimals}
            </Text>
            {/* <Button
                disabled={!!el.allowance.gt(el.balance)}
                onClick={() => onHandleApprove(el)}
              >
                {el.allowance.gt(el.balance) ? 'Approved' : 'Approve'}
              </Button> */}
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

export default DebtBalances
