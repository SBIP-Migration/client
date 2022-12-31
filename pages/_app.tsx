import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'

export default function App({ Component, pageProps }) {
  return <ChakraProvider {...{ theme }}> 
      <Component {...pageProps} />
    </ChakraProvider>
}
