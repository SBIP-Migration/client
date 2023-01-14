import '../styles/globals.css'
import { ChakraProvider, Container, Heading , Text,Stack } from '@chakra-ui/react'
import theme from '../theme'
import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import Image from 'next/image'

const injected = injectedModule()

init({
  wallets: [injected],
  chains: [
    {
      id: '0x5',
      token: 'ETH',
      label: 'Goerli Testnet',
      rpcUrl: process.env.NEXT_PUBLIC_GOERLI_URL,//'https://eth-goerli.g.alchemy.com/v2/kcOzPHZIPQLSrltPylFU110LX1FTwQ_N', //process.env.NEXT_PUBLIC_GOERLI_URL,
    },
  ],
})

export default function App({ Component, pageProps }) {
  return (
    

    <ChakraProvider {...{ theme }}  >
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
