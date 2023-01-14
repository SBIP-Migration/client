import { Chain } from 'wagmi'

// TODO: Add more chains
function getBlockExplorerBaseUrl(chain: Chain): string {
  return `https://goerli.etherscan.io`
}

export { getBlockExplorerBaseUrl }
