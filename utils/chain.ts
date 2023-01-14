import { Chain, goerli } from 'wagmi'

// TODO: Add more chains
function getBlockExplorerBaseUrl(chain: Chain): string {
  if (chain.network === goerli.network) {
    return `https://goerli.etherscan.io`
  }
  return `https://etherscan.io`
}

export { getBlockExplorerBaseUrl }
