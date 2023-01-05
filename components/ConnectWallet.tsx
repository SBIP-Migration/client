import React from 'react'
import { Button, Center, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { useConnectWallet } from '@web3-onboard/react'

type Props = {
  nextStep: () => void
}

const ConnectWallet = ({ nextStep }: Props) => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  const handleClick = async () => {
    await connect()
    nextStep()
  }

  return (
    <Center height="100%" mt="32px">
      <Button
        disabled={connecting}
        backgroundColor="red"
        textColor="white"
        onClick={handleClick}
      >
        Connect Wallet
      </Button>
    </Center>
  )
}

export default ConnectWallet
