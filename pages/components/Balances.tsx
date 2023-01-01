import { BigNumber, ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import { useWallets } from '@web3-onboard/react'
import { approveToken, getWeb3Provider } from '../../utils/ethers'
import { AAVE_MIGRATION_CONTRACT } from '../../constants'
import { getATokenBalances } from '../../utils/balances'

type Props = {}

export type aTokenType = {
  symbol: string
  contractAddress: string

  allowance: BigNumber
  balance: BigNumber

  tokenAddress: string
  balanceInTokenDecimals: string
}

const Balances = ({}: Props) => {
  const [aTokenBalances, setATokenBalances] = useState<aTokenType[]>([])
  const [wallet] = useWallets()
  const provider = getWeb3Provider(wallet)
  const walletSigner = wallet.accounts?.[0].address

  const getAllBalances = useCallback(
    async (address: string) => {
      const aTokenBalances = await getATokenBalances(provider, address)
      setATokenBalances(aTokenBalances)
      // await getStableDebtBalances(address);
      // await getVariableDebtBalances(address);
    },
    [provider]
  )

  useEffect(() => {
    ;(async () => {
      if (walletSigner.length && provider != null) {
        await getAllBalances(walletSigner)
      }
    })()
  }, [walletSigner, provider, getAllBalances])

  const onHandleApprove = async (token: aTokenType) => {
    const tx = await approveToken(
      wallet,
      AAVE_MIGRATION_CONTRACT,
      token.contractAddress,
      // Maximum amount of tokens that can be approved -> 2^256 - 1
      BigNumber.from(ethers.BigNumber.from(2).pow(255))
    )
    // Wait until transaction is confirmed, then update "allowance" status
    await tx.wait()
    await getAllBalances(walletSigner)
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
