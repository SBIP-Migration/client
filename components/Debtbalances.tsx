import {
  Button,
  Center,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  usePrevious,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import { useConnectWallet, useWallets } from '@web3-onboard/react'
import { approveCreditDelegation } from '../utils/ethers'
import { AAVE_MIGRATION_CONTRACT } from '../constants'
import { WrapperTokenType } from './Balances'
import { useCallback, useEffect, useMemo } from 'react'

type Props = {
  stableDebtBalances: WrapperTokenType[]
  variableDebtBalances: WrapperTokenType[]
  approvedCreditDelegationAddresses: string[]
  addApprovedCreditDelegationAddress: (address: string) => void
}

const DebtBalances = ({
  stableDebtBalances,
  variableDebtBalances,
  approvedCreditDelegationAddresses,
  addApprovedCreditDelegationAddress,
}: Props) => {
  // Pop up wallet, while keeping tx state
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [{ wallet }, connect, disconnect] = useConnectWallet()
  const prevWallet = usePrevious(wallet)

  const onDisconnectWallet = useCallback(async () => {
    localStorage.setItem('sender', wallet.accounts?.[0]?.address)
    await disconnect(wallet)
  }, [disconnect, wallet])

  const onConnectRecipientWallet = useCallback(async () => {
    onClose()
    connect()
  }, [connect, onClose])

  useEffect(() => {
    if (!wallet || !wallet.accounts?.[0]?.address) return
    localStorage.setItem('recipient', wallet?.accounts?.[0]?.address)
  }, [wallet])

  const isOldWallet = useMemo(() => {
    return (
      prevWallet == null ||
      prevWallet.accounts.map((a) => a.address.toLowerCase()) ===
        wallet?.accounts?.map((a) => a.address.toLowerCase())
    )
  }, [prevWallet, wallet?.accounts])

  const onHandleApprove = useCallback(
    async (debtTokenBalance: WrapperTokenType) => {
      if (!wallet) return
      const tx = await approveCreditDelegation(
        wallet,
        debtTokenBalance.contractAddress,
        AAVE_MIGRATION_CONTRACT,
        debtTokenBalance.balance
      )
      await tx.wait()
      addApprovedCreditDelegationAddress(debtTokenBalance.contractAddress)
    },
    [addApprovedCreditDelegationAddress, wallet]
  )

  return (
    <Flex flexDir="column" mt="32px">
      <Heading textAlign="center" mb="8px">
        Debt Positions
      </Heading>
      <Text mb="28px" ml='5'>
        Please delegate all debt positions to the contract to start the transfer
      </Text>
      <Center mb="24px">
        <Button onClick={onOpen} alignSelf="center">
          Switch to recipient wallet
        </Button>
      </Center>
      <Flex flexDir="column" justifyContent="center" alignItems="left" ml="0">
        {stableDebtBalances
          ?.filter((debt) => debt?.balance?.gt(0))
          .map((debt) => (
            <>
              <Grid
                key={debt.symbol}
                templateColumns={'100px repeat(4, 1fr)'}
                gap={0}
              >
                <GridItem colStart={1} colEnd={2} h="0">
                  <Text size="sm" mr="16px">
                    <b>{debt.symbol}</b>
                  </Text>
                </GridItem>
                <GridItem colStart={2} colEnd={5} h="12">
                 <b>Stable Debt:</b> {debt.balanceInTokenDecimals}
                </GridItem>
                <GridItem colStart={7} colEnd={8} h="12">
                  {!isOldWallet && (
                    <Button
                      isDisabled={approvedCreditDelegationAddresses
                        .map((addr) => addr.toLowerCase())
                        .includes(debt.contractAddress.toLowerCase())}
                      onClick={() => onHandleApprove(debt)}
                    >
                      {approvedCreditDelegationAddresses
                        .map((addr) => addr.toLowerCase())
                        .includes(debt.contractAddress.toLowerCase())
                        ? 'Approved'
                        : 'Approve'}
                    </Button>
                  )}
                </GridItem>
              </Grid>
            </>
          ))}
        {variableDebtBalances
          ?.filter((debt) => debt?.balance?.gt(0))
          ?.map((debt) => (
            <>
              <Grid
                key={debt.symbol}
                templateColumns={'100px repeat(3, 1fr)'}
                gap={0}
              >
                <GridItem colStart={1} colEnd={2} h="0">
                  <Text size="sm" mr="16px">
                    <b>{debt.symbol}</b>
                  </Text>
                </GridItem>
                <GridItem colStart={2} colEnd={5} h="12">
                  <b>Variable Debt:</b> {debt.balanceInTokenDecimals}
                </GridItem>
                <GridItem colStart={7} colEnd={8} h="12">
                  {!isOldWallet && (
                    <Button
                      isDisabled={approvedCreditDelegationAddresses
                        .map((addr) => addr.toLowerCase())
                        .includes(debt.contractAddress.toLowerCase())}
                      onClick={() => onHandleApprove(debt)}
                    >
                      {approvedCreditDelegationAddresses
                        .map((addr) => addr.toLowerCase())
                        .includes(debt.contractAddress.toLowerCase())
                        ? 'Approved'
                        : 'Approve'}
                    </Button>
                  )}
                </GridItem>
              </Grid>
            </>
          ))}
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
                ? 'Disconnect current wallet (may need to do it manually too with your wallet provider)'
                : 'Connect your new wallet (make sure you have disconnected manually if you are on Metamask)'}
            </Text>
          </ModalBody>
          <ModalFooter>
            {wallet ? (
              <Button colorScheme="blue" onClick={onDisconnectWallet}>
                Disconnect Wallet
              </Button>
            ) : (
              <Button colorScheme="blue" onClick={onConnectRecipientWallet}>
                Connect Recipient Wallet
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default DebtBalances
