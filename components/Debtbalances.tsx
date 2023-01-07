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
} from '@chakra-ui/react'
import { useConnectWallet, useWallets } from '@web3-onboard/react'
import { approveCreditDelegation } from '../utils/ethers'
import { AAVE_MIGRATION_CONTRACT } from '../constants'
import { WrapperTokenType } from './Balances'
import { useCallback, useEffect, useMemo, useState } from 'react'

type Props = {
  stableDebtBalances: WrapperTokenType[]
  variableDebtBalances: WrapperTokenType[]
  approvedCreditDelegationAddresses: string[]
  addApprovedCreditDelegationAddress: (address: string) => void
  setIsSameWallet: (isSameWallet: boolean) => void
}

const DebtBalances = ({
  stableDebtBalances,
  variableDebtBalances,
  approvedCreditDelegationAddresses,
  addApprovedCreditDelegationAddress,
  setIsSameWallet,
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

    // Check if sender and recipient are the same
    if (wallet.accounts?.[0]?.address == localStorage.getItem('sender')) {
      setIsSameWallet(true)
    }
  }, [wallet, setIsSameWallet])

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
      <Text mb="28px">
        Please delegate all debt positions to the contract to start the transfer
      </Text>
      <Center mb="24px">
        <Button onClick={onOpen} alignSelf="center">
          Switch to recipient wallet
        </Button>
      </Center>
      <Flex flexDir="column" justifyContent="center" alignItems="center">
        {stableDebtBalances
          ?.filter((debt) => debt?.balance?.gt(0))
          .map((debt) => (
            <Flex key={debt.symbol} alignItems="center" mb="3">
              <Text size="sm" mr="16px">
                {debt.symbol} Stable Debt: {debt.balanceInTokenDecimals}
              </Text>
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
            </Flex>
          ))}
        {variableDebtBalances
          ?.filter((debt) => debt?.balance?.gt(0))
          ?.map((debt) => (
            <Flex key={debt.symbol} alignItems="center" mb="3">
              <Text size="sm" mr="16px">
                {debt.symbol} Variable Debt: {debt.balanceInTokenDecimals}
              </Text>
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
            </Flex>
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
