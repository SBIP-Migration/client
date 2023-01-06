import { WalletState } from '@web3-onboard/core'
import { BigNumber, ethers } from 'ethers'
import { erc20ABI } from 'wagmi'
import flashLoanABI from '../abi/flashLoan.json'
import { AAVE_MIGRATION_CONTRACT } from '../constants'

export type DebtTokenPosition = {
  stableDebtAmount: string
  variableDebtAmount: string
  tokenAddress: string
}

export type aTokenPosition = {
  tokenAddress: string
  amount: string
  aTokenAddress: string
}

let provider: ethers.providers.Web3Provider

const getWeb3Provider = (wallet: WalletState) => {
  if (!provider) {
    provider = new ethers.providers.Web3Provider(wallet.provider)
  }
  return provider
}

const approveCreditDelegation = async (
  wallet: WalletState,
  debtTokenAddress: string,
  contractAddress: string,
  amount: BigNumber
) => {
  const provider = getWeb3Provider(wallet)
  const signer = provider.getSigner()

  const debtTokenABI = [
    'function approveDelegation(address delegatee, uint256 amount) external',
  ]

  if (!signer) {
    throw new Error('No signer')
  }

  const debtTokenContract = new ethers.Contract(
    debtTokenAddress,
    debtTokenABI,
    signer
  )

  return debtTokenContract.functions.approveDelegation(contractAddress, amount)
}

const approveToken = async (
  wallet: WalletState,
  contractAddress: string,
  tokenAddress: string,
  amount: BigNumber
) => {
  const provider = getWeb3Provider(wallet)
  const signer = provider.getSigner()

  if (!signer) {
    throw new Error('No signer')
  }

  const erc20Contract = new ethers.Contract(tokenAddress, erc20ABI, signer)

  return erc20Contract.functions.approve(contractAddress, amount)
}

const executeMigration = async (
  wallet: WalletState,
  recipientAddress: string,
  debtTokenPositions: DebtTokenPosition[],
  aTokenPositions: aTokenPosition[]
) => {
  const provider = getWeb3Provider(wallet)
  const signer = provider.getSigner()

  if (!signer) {
    throw new Error('No signer')
  }

  const flashLoanContract = new ethers.Contract(
    AAVE_MIGRATION_CONTRACT,
    flashLoanABI,
    signer
  )

  return flashLoanContract.migrateAavePositions(
    recipientAddress,
    debtTokenPositions,
    aTokenPositions,
    {
      gasLimit: BigNumber.from(1_500_000),
    }
  )
}

export {
  getWeb3Provider,
  approveToken,
  approveCreditDelegation,
  executeMigration,
}
