import { BigNumber, ethers } from 'ethers'
import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import { useWallets } from '@web3-onboard/react'
import { approveToken } from '../../utils/ethers'
import { AAVE_MIGRATION_CONTRACT } from '../../constants'

type Props = {
  aTokenBalances: WrapperTokenType[]
  refreshTokenBalances: () => Promise<void>
}

export type WrapperTokenType = {
  symbol: string
  contractAddress: string

  allowance: BigNumber
  balance: BigNumber

  // Underlying token
  tokenAddress: string
  balanceInTokenDecimals: string
}

const Balances = ({ aTokenBalances,  refreshTokenBalances }: Props) => {
  const [wallet] = useWallets()

  const onHandleApprove = async (token: WrapperTokenType) => {
    const tx = await approveToken(
      wallet,
      AAVE_MIGRATION_CONTRACT,
      token.contractAddress,
      // Maximum amount of tokens that can be approved -> 2^256 - 1
      BigNumber.from(ethers.BigNumber.from(2).pow(255))
    )
    // Wait until transaction is confirmed, then update "allowance" status
    await tx.wait()
    await refreshTokenBalances()
  }

  const onHandleNext = async () => {
    // Credit Delegation for debt positions
  }

  return (
    <Flex flexDir="column">
      <Text>
        Please approve all your Aave positions, so that we can transfer your
        holdings to the intended wallet
      </Text>
      <Flex flexDir="column" justifyContent="center" alignItems="center">
        <Heading size="md" mb="3.5">
          Your AAVE balances here:
        </Heading>
        {aTokenBalances.map((el) => (
          <Flex key={el.symbol} alignItems="center" mb="3">
            <Text mr="3">
              {el.symbol}: {el.balanceInTokenDecimals}{' '}
            </Text>
            <Button
              disabled={!!el.allowance.gt(el.balance)}
              onClick={() => onHandleApprove(el)}
            >
              {el.allowance.gt(el.balance) ? 'Approved' : 'Approve'}
            </Button>
          </Flex>
        ))}

        <Button onClick={onHandleNext}>Next</Button>
      </Flex>
    </Flex>
  )
}

export default Balances
