import { BigNumber, ethers } from 'ethers'
import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import { useWallets } from '@web3-onboard/react'
import { approveToken } from '../../utils/ethers'
import { AAVE_MIGRATION_CONTRACT } from '../../constants'
import { WrapperTokenType } from './Balances'

type Props = {
  stableDebtBalances: WrapperTokenType[]
  variableDebtBalances: WrapperTokenType[]
  refreshTokenBalances: () => Promise<void>
}
  
  const DebtBalances = ({stableDebtBalances, variableDebtBalances, refreshTokenBalances }: Props) => {
    const [wallet] = useWallets()
    console.log("wallet",wallet)
    console.log("variableDebtBalances",variableDebtBalances)
    console.log("stableDebtBalances",stableDebtBalances)
    const onHandleNext = async () => {
      // Credit Delegation for debt positions
    }
  
    return (
      <Flex flexDir="column">
        <Flex flexDir="column" justifyContent="center" alignItems="center">

          {stableDebtBalances?.map((el) => (
  
            <Flex key={el.symbol} alignItems="center" mb="3">
              <Heading size="md" mb="3.5">
                Your Debt(stable interest rate) balances here:
              </Heading>
              <Text mr="3">
                {el.symbol}: {el.balanceInTokenDecimals}{' '}
              </Text>
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
              <Heading size="md" mb="3.5">
                Your Debt(variable interest rate) balances here:
              </Heading>
              <Text mr="3">
                {el.symbol}: {el.balanceInTokenDecimals}{' '}
              </Text>
              {/* <Button
                disabled={!!el.allowance.gt(el.balance)}
                onClick={() => onHandleApprove(el)}
              >
                {el.allowance.gt(el.balance) ? 'Approved' : 'Approve'}
              </Button> */}
            </Flex>
          ))}
          <Button onClick={onHandleNext}>Next</Button>
        </Flex>
      </Flex>
    )
  }
  
  export default DebtBalances
  