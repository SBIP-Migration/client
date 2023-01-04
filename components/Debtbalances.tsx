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
  return (
    <Flex flexDir="column" mt="32px">
      <Heading textAlign="center" mb="8px">
        Debt Positions
      </Heading>
      <Text mb="28px">
        Please delegate all debt positions to the contract to start the transfer
      </Text>
      <Flex flexDir="column" justifyContent="center" alignItems="center">
        {stableDebtBalances?.map((el) => (
          <Flex key={el.symbol} alignItems="center" mb="3">
            <Heading size="sm" mb="3.5">
              {el.symbol} Stable Debt: {el.balanceInTokenDecimals}
            </Heading>
            {/* <Button
                disabled={!!el.allowance.gt(el.balance)}
                onClick={() => onHandleApprove(el)}
              >
                {el.allowance.gt(el.balance) ? 'Approved' : 'Approve'}
              </Button> */}
          </Flex>
        ))}
        {variableDebtBalances?.map((el) => (
          <Flex key={el.symbol} alignItems="center" mb="3">
            <Heading size="sm" mb="3.5">
              {el.symbol} Variable Debt: {el.balanceInTokenDecimals}
            </Heading>
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
