import { BigNumber, ethers } from 'ethers'
import { erc20ABI } from 'wagmi'
import { AAVE_MIGRATION_CONTRACT } from '../constants'
import { WrapperTokenType } from '../components/Balances'
import { TOKEN_LIST } from '../data/TokenList'

const getStableDebtBalances = async (
  provider: ethers.providers.Provider,
  userAddress: string
) => {
  const stableDebtTokenAddresses: string[] = []
  for (let i = 0; i < TOKEN_LIST.length; i++) {
    stableDebtTokenAddresses.push(TOKEN_LIST[i].stableDebtTokenAddress)
  }

  let stableDebtBalancesList: Array<WrapperTokenType> = []

  for (let i = 0; i < stableDebtTokenAddresses.length; i++) {
    const tokenContract = new ethers.Contract(
      stableDebtTokenAddresses[i],
      [
        ...erc20ABI,
        'function borrowAllowance(address fromUser, address toUser) external view returns (uint256)',
      ],
      provider
    )
    const userTokenBalances = (await tokenContract.functions.balanceOf(
      userAddress
    )) as BigNumber[]

    const tokenBalance = userTokenBalances?.[0]

    const contractTokenAllowance = (await tokenContract.borrowAllowance(
      userAddress,
      AAVE_MIGRATION_CONTRACT
    )) as BigNumber

    stableDebtBalancesList.push({
      symbol: `a${TOKEN_LIST[i].symbol}`,
      // stable debt token address
      contractAddress: TOKEN_LIST[i].stableDebtTokenAddress,
      // underlying token address
      tokenAddress: TOKEN_LIST[i].tokenAddress,
      balance: tokenBalance,
      allowance: contractTokenAllowance,
      balanceInTokenDecimals: ethers.utils.formatUnits(
        tokenBalance.toString(),
        TOKEN_LIST[i].decimals
      ),
    })
  }

  return stableDebtBalancesList
}

const getVariableDebtBalances = async (
  provider: ethers.providers.Provider,
  userAddress: string
) => {
  const variableDebtTokenAddresses: string[] = []

  for (let i = 0; i < TOKEN_LIST.length; i++) {
    variableDebtTokenAddresses.push(TOKEN_LIST[i].variableDebtTokenAddress)
  }

  let variableDebtBalancesList: Array<WrapperTokenType> = []

  for (let i = 0; i < variableDebtTokenAddresses.length; i++) {
    const tokenContract = new ethers.Contract(
      variableDebtTokenAddresses[i],
      [
        ...erc20ABI,
        'function borrowAllowance(address fromUser, address toUser) external view returns (uint256)',
      ],
      provider
    )
    const userTokenBalances = (await tokenContract.functions.balanceOf(
      userAddress
    )) as BigNumber[]

    const tokenBalance = userTokenBalances?.[0]

    const contractTokenAllowance = (await tokenContract.borrowAllowance(
      userAddress,
      AAVE_MIGRATION_CONTRACT
    )) as BigNumber

    variableDebtBalancesList.push({
      symbol: `a${TOKEN_LIST[i].symbol}`,
      // variable debt token address
      contractAddress: TOKEN_LIST[i].variableDebtTokenAddress,
      // underlying token address
      tokenAddress: TOKEN_LIST[i].tokenAddress,
      balance: tokenBalance,
      allowance: contractTokenAllowance,
      balanceInTokenDecimals: ethers.utils.formatUnits(
        tokenBalance.toString(),
        TOKEN_LIST[i].decimals
      ),
    })
  }

  return variableDebtBalancesList
}

const getATokenBalances = async (
  provider: ethers.providers.Provider,
  userAddress: string
) => {
  const aTokenAddresses = []
  for (let i = 0; i < TOKEN_LIST.length; i++) {
    aTokenAddresses.push(TOKEN_LIST[i].aTokenAddress)
  }

  const aTokenBalancesList: Array<WrapperTokenType> = []

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

export { getATokenBalances, getStableDebtBalances, getVariableDebtBalances }
