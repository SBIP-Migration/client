import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import truncateEthAddress from 'truncate-eth-address'
import { useConnectWallet } from '@web3-onboard/react'

type Props = {
  senderWallet?: string
  receiverWallet?: string
}

const ConnectedWallets = ({ senderWallet, receiverWallet }: Props) => {
  const [{ wallet }] = useConnectWallet()
  const walletSigner = wallet?.accounts?.[0].address

  if (!walletSigner) return null

  return (
    <Flex
      flexDirection="column"
      backgroundColor="gray.200"
      p="3"
      mb="32px"
      borderRadius="6px"
    >
      {walletSigner && (
        <Text size="md" mb="1.5">
          <b>Address connected:</b> {truncateEthAddress(walletSigner)}{' '}
        </Text>
      )}
      {senderWallet && (
        <Text size="md" mb="1.5">
          <b> Sender wallet:</b> {truncateEthAddress(senderWallet)}{' '}
        </Text>
      )}
      {receiverWallet && (
        <Text size="md">
          <b>Receiver wallet:</b> {truncateEthAddress(receiverWallet)}{' '}
        </Text>
      )}
    </Flex>
  )
}

export default ConnectedWallets
