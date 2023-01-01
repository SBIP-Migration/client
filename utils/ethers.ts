import { WalletState } from '@web3-onboard/core'
import { BigNumber, ethers } from 'ethers'
import { erc20ABI } from 'wagmi'

let provider: ethers.providers.Web3Provider

const getWeb3Provider = (wallet: WalletState) => {
  if (!provider) {
    provider = new ethers.providers.Web3Provider(wallet.provider)
  }
  return provider
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

  await erc20Contract.approve(contractAddress, amount)
}

export { getWeb3Provider, approveToken }
