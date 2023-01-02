import { BigNumber, ethers } from 'ethers'
import { erc20ABI } from 'wagmi'
import { AAVE_MIGRATION_CONTRACT } from '../constants'
import { aTokenType } from '../pages/components/Balances'
import { TOKEN_LIST } from '../pages/Tokenlist'

const getATokenBalances = async (
  provider: ethers.providers.Provider,
  userAddress: string
) => {
  const aTokenAddresses = []
  for (let i = 0; i < TOKEN_LIST.length; i++) {
    aTokenAddresses.push(TOKEN_LIST[i].aTokenAddress)
  }

  const aTokenBalancesList: Array<aTokenType> = []

  for (let i = 0; i < aTokenAddresses.length; i++) {
    const tokenContract = new ethers.Contract(
      aTokenAddresses[i],
      erc20ABI,
      provider
    )
    const userTokenBalance = (await tokenContract.balanceOf(
      userAddress
    )) as BigNumber
    const contractTokenAllowance = (await tokenContract.allowance(
      userAddress,
      AAVE_MIGRATION_CONTRACT
    )) as BigNumber

    aTokenBalancesList.push({
      symbol: `a${TOKEN_LIST[i].symbol}`,
      contractAddress: TOKEN_LIST[i].aTokenAddress,
      // underlying token address
      tokenAddress: TOKEN_LIST[i].tokenAddress,
      balance: userTokenBalance,
      allowance: contractTokenAllowance,
      balanceInTokenDecimals: ethers.utils.formatUnits(
        userTokenBalance.toString(),
        TOKEN_LIST[i].decimals
      ),
    })
  }

  return aTokenBalancesList
}

export { getATokenBalances }
