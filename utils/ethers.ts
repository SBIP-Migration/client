import { WalletState } from '@web3-onboard/core'
import { ethers } from 'ethers'

const getWeb3Provider = (wallet: WalletState) => {
  return new ethers.providers.Web3Provider(wallet.provider)
}

export { getWeb3Provider }
