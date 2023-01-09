import { BigNumber, ethers } from 'ethers'
import { Button, Flex, Heading, Text, Grid, GridItem } from '@chakra-ui/react'
import { useWallets } from '@web3-onboard/react'
import { approveToken, revokeToken } from '../utils/ethers'
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
      BigNumber.from(2).pow(256).sub(1)
    )
    // Wait until transaction is confirmed, then update "allowance" status
    await tx.wait()
    await refreshTokenBalances()
  }

  const onHandleRevoke = async (token: WrapperTokenType) => {
    const tx = await revokeToken(
      wallet,
      AAVE_MIGRATION_CONTRACT,
      token.contractAddress,
      // Maximum amount of tokens that can be approved -> 2^256 - 1
      //BigNumber.from(2).pow(256).sub(1)
    )
    // Wait until transaction is confirmed, then update "allowance" status
    await tx.wait()
    await refreshTokenBalances()
  }

  return (
    <Flex flexDir="column" mt="7">
      <Heading  className='pixel_font'size="md" mb="3.5" textAlign="center"   style={{ fontSize: 25 }}>
        Your AAVE balances here:
      </Heading>
      <Text maxW="450px" textAlign="center" mb="32px" backgroundColor='white' opacity='0.9' borderRadius='10px'  ml='5'>
        Please approve all your Aave positions, so that we can transfer your
        holdings to the intended wallet
      </Text>
      <Flex flexDir="column" justifyContent="center" alignItems="left" ml="30">
      <Grid
                
                templateColumns={'150px repeat(0, 1fr)'}
                gap={0}
                gridTemplateRows={'50px repeat(1, 1fr)'}
                border="1px"
                borderRadius="10px"
                padding="20px"
                backgroundColor='white'
                opacity='0.9'
              >
        {aTokenBalances
          .filter((bal) => bal.balance.gt(0))
          .map((aTokenBalance) => (
            <>
                
                <GridItem key={aTokenBalance.symbol} colStart={1} colEnd={2} h="0" >
                <Text mr="3">
                  <b>{aTokenBalance.symbol}: </b>
                </Text>{' '}
                </GridItem>
                <GridItem colStart={2} colEnd={3} h="0" >
                {parseFloat(aTokenBalance.balanceInTokenDecimals).toFixed(5)}{' '}
                </GridItem>
                <GridItem colStart={4} colEnd={5} h="12" >
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
                  {/* <Button
                    // disabled={
                    //   !!aTokenBalance.allowance.gt(aTokenBalance.balance)
                    // }
                    onClick={() => onHandleRevoke(aTokenBalance)}
  
                  >
                    {'Revoke'}
                  </Button> */}
                </GridItem>

            </>
          ))}
                        </Grid>
      </Flex>
    </Flex>
  )
}

export default Balances
