import React, { useCallback, useEffect } from 'react'
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useConnectWallet } from '@web3-onboard/react'
import { DebtTokenPosition, executeMigration } from '../utils/ethers'
import { WrapperTokenType } from './Balances'
import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers'
import { getBlockExplorerBaseUrl } from '../utils/chain'
import { goerli } from 'wagmi'

type Props = {
  variableDebtBalances: WrapperTokenType[]
  stableDebtBalances: WrapperTokenType[]
  aTokenBalances: WrapperTokenType[]
}

const ExecuteTransfer = ({
  variableDebtBalances,
  stableDebtBalances,
  aTokenBalances,
}: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [{ wallet }, connect, disconnect] = useConnectWallet()
  const [txHash, setTxHash] = React.useState<string>()

  useEffect(() => {
    // Switch wallet on original "sender"
    onOpen()
  }, [onOpen])

  const onDisconnectWallet = useCallback(async () => {
    disconnect(wallet)
  }, [disconnect, wallet])

  const onConnectRecipientWallet = useCallback(async () => {
    connect()
    onClose()
    const sender = localStorage.getItem('sender')

    // Save for later
    if (
      wallet &&
      (!sender || sender !== wallet.accounts?.[0]?.address.toLowerCase())
    ) {
      // Throw modal error
      console.error(
        'Wrong wallet connected, please connect the original sender wallet'
      )
    }
  }, [connect, onClose, wallet])

  const onButtonClick = useCallback(async () => {
    const recipient = localStorage.getItem('recipient')
    if (!recipient) {
      // Throw modal error
      return
    }

    const debtTokenBalances: DebtTokenPosition[] = generateDebtTokenPositions(
      variableDebtBalances,
      stableDebtBalances
    )

    const aTokenPositions = aTokenBalances.map((aToken) => ({
      tokenAddress: aToken.tokenAddress,
      amount: aToken.balance.toString(),
      aTokenAddress: aToken.contractAddress,
    }))

    const tx: ContractTransaction = await executeMigration(
      wallet,
      recipient,
      debtTokenBalances,
      aTokenPositions
    )

    const txReceipt: ContractReceipt = await tx.wait()
    setTxHash(txReceipt.transactionHash)
  }, [aTokenBalances, stableDebtBalances, variableDebtBalances, wallet])

  return (
    <>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Center flexDir="column">
          <Heading as="h2" size="lg" mb={4}>
            Execute Transfer
          </Heading>
          {txHash && (
            <Text
              mb={6}
              backgroundColor="white"
              p="1.5"
              maxW="550px"
              borderRadius="8px"
              textAlign="center"
              fontWeight="semibold"
            >
              You have successfully transferred your assets to the new wallet.
              <br />
              Check out the{' '}
              <Link
                href={`${getBlockExplorerBaseUrl(goerli)}/tx/${txHash}`}
                color="blue"
                target="_blank"
              >
                transaction here
              </Link>
            </Text>
          )}
          <Button
            onClick={onButtonClick}
            alignSelf="center"
            backgroundColor="red"
            textColor="white"
            disabled={txHash !== undefined}
          >
            Migrate positions to Aave
          </Button>
        </Center>
      </Flex>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Switch Wallet</ModalHeader>
          <ModalBody>
            <Text textAlign="center">
              {wallet
                ? 'Disconnect current (recipient) wallet (may need to do it manually too with your wallet provider)'
                : 'Connect your previous (sender) wallet (make sure you have disconnected manually if you are on Metamask)'}
            </Text>
          </ModalBody>
          <ModalFooter>
            {wallet ? (
              <Button colorScheme="blue" onClick={onDisconnectWallet}>
                Disconnect Wallet
              </Button>
            ) : (
              <Button colorScheme="blue" onClick={onConnectRecipientWallet}>
                Connect Sender Wallet
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const generateDebtTokenPositions = (
  variableDebtBalances: WrapperTokenType[],
  stableDebtBalances: WrapperTokenType[]
) => {
  let tokenAddressToVariableDebtAmount: { [key: string]: BigNumber } = {}

  variableDebtBalances.forEach((varDebt) => {
    tokenAddressToVariableDebtAmount[varDebt.tokenAddress] = varDebt.balance
  })

  const debtTokenBalances: DebtTokenPosition[] = []

  stableDebtBalances.forEach((stableDebt) => {
    debtTokenBalances.push({
      variableDebtAmount: (
        tokenAddressToVariableDebtAmount[stableDebt.tokenAddress] ??
        BigNumber.from(0)
      ).toString(),
      stableDebtAmount: stableDebt.balance.toString(),
      tokenAddress: stableDebt.tokenAddress,
    })
  })

  return debtTokenBalances
}

export default ExecuteTransfer
