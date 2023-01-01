import { BigNumber, ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
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

  useEffect(() => {
    async function getAllBalances(address: string) {
      const aTokenBalances = await getATokenBalances(provider, address)
      setATokenBalances(aTokenBalances)
      // await getStableDebtBalances(address);
      // await getVariableDebtBalances(address);
    }

    ;(async () => {
      if (walletSigner.length && provider != null) {
        await getAllBalances(walletSigner)
      }
    })()
  }, [walletSigner, provider])

  const onHandleApprove = async (token: aTokenType) => {
    await approveToken(
      wallet,
      AAVE_MIGRATION_CONTRACT,
      token.contractAddress,
      // Maximum amount of tokens that can be approved -> 2^256 - 1
      BigNumber.from(ethers.BigNumber.from(2).pow(255))
    )
  }

  return (
    <Flex flexDir="column">
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
    </Flex>
  )
}

export default Balances
