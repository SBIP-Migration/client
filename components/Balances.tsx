import { BigNumber, ethers } from 'ethers'
import { Button, Flex, Heading, Text, Grid, GridItem } from '@chakra-ui/react'
import { useWallets } from '@web3-onboard/react'
import { approveToken } from '../utils/ethers'
import { AAVE_MIGRATION_CONTRACT } from '../constants'

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

const Balances = ({ aTokenBalances, refreshTokenBalances }: Props) => {
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

  return (
    <Flex flexDir="column" mt="7">
      <Heading size="md" mb="3.5" textAlign="center">
        Your AAVE balances here:
      </Heading>
      <Text maxW="450px" textAlign="center" mb="32px">
        Please approve all your Aave positions, so that we can transfer your
        holdings to the intended wallet
      </Text>
      <Flex flexDir="column" justifyContent="center" alignItems="left" ml="30">
        {aTokenBalances
          .filter((bal) => bal.balance.gt(0))
          .map((aTokenBalance) => (
            <>
              <Grid
                key={aTokenBalance.symbol}
                templateColumns={'280px repeat(1, 1fr)'}
                gap={0}
              >
                <GridItem colStart={1} colEnd={2} h="0" >
                <Text mr="3">
                  {aTokenBalance.symbol}: {aTokenBalance.balanceInTokenDecimals}{' '}
                </Text>{' '}
                </GridItem>
                <GridItem colStart={4} colEnd={8} h="12"  >
                <Button
                    disabled={
                      !!aTokenBalance.allowance.gt(aTokenBalance.balance)
                    }
                    onClick={() => onHandleApprove(aTokenBalance)}
                  >
                    {aTokenBalance.allowance.gt(aTokenBalance.balance)
                      ? 'Approved'
                      : 'Approve'}
                  </Button>
                </GridItem>
              </Grid>
            </>
          ))}
      </Flex>
    </Flex>
  )
}

export default Balances
