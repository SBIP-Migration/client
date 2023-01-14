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
  Spinner,
} from '@chakra-ui/react'
import { useConnectWallet } from '@web3-onboard/react'
import { approveCreditDelegation } from '../utils/ethers'
import { AAVE_MIGRATION_CONTRACT } from '../constants'
import { WrapperTokenType } from './Balances'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber } from 'ethers'
import { DebtType } from '../pages'

type Props = {
  stableDebtBalances: WrapperTokenType[]
  variableDebtBalances: WrapperTokenType[]
  refreshDebtAllowances: () => void
  onRefreshDebtAllowance: (
    token: WrapperTokenType,
    debtType: DebtType
  ) => Promise<void>
  setIsSameWallet: (isSameWallet: boolean) => void
}

const DebtBalances = ({
  stableDebtBalances,
  variableDebtBalances,
  onRefreshDebtAllowance,
  refreshDebtAllowances,
  setIsSameWallet,
}: Props) => {
  // Pop up wallet, while keeping tx state
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [{ wallet }, connect, disconnect] = useConnectWallet()
  const prevWallet = usePrevious(wallet)

  // Handle "loading" state
  const [addressBalanceUpdated, setAddressBalanceUpdated] = useState<
    string | null
  >(null)

  const onDisconnectWallet = useCallback(async () => {
    localStorage.setItem('sender', wallet.accounts?.[0]?.address)
    await disconnect(wallet)
  }, [disconnect, wallet])

  const onConnectRecipientWallet = useCallback(async () => {
    onClose()
    await connect()
  }, [connect, onClose])

  useEffect(() => {
    if (!wallet) return
    refreshDebtAllowances()
  }, [refreshDebtAllowances, wallet])

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
    async (debtTokenBalance: WrapperTokenType, debtType: DebtType) => {
      if (!wallet) return
      const tx = await approveCreditDelegation(
        wallet,
        debtTokenBalance.contractAddress,
        AAVE_MIGRATION_CONTRACT,
        BigNumber.from(2).pow(256).sub(1)
      )
      setAddressBalanceUpdated(debtTokenBalance.contractAddress)
      await tx.wait()
      await onRefreshDebtAllowance(debtTokenBalance, debtType)
      setAddressBalanceUpdated(null)
    },
    [onRefreshDebtAllowance, wallet]
  )

  // Set delegation to 0
  const onCancelApprove = useCallback(
    async (debtTokenBalance: WrapperTokenType, debtType: DebtType) => {
      if (!wallet) return
      const tx = await approveCreditDelegation(
        wallet,
        debtTokenBalance.contractAddress,
        AAVE_MIGRATION_CONTRACT,
        BigNumber.from(0)
      )
      setAddressBalanceUpdated(debtTokenBalance.contractAddress)
      await tx.wait()
      onRefreshDebtAllowance(debtTokenBalance, debtType)
      setAddressBalanceUpdated(null)
    },
    [onRefreshDebtAllowance, wallet]
  )

  const nonZeroStableDebtBalances = useMemo(
    () => stableDebtBalances?.filter((debt) => debt?.balance?.gt(0)),
    [stableDebtBalances]
  )

  const nonZeroVariableDebtBalances = useMemo(
    () => variableDebtBalances?.filter((debt) => debt?.balance?.gt(0)),
    [variableDebtBalances]
  )

  return (
    <Flex flexDir="column" mt="32px">
      <Heading textAlign="center" mb="8px">
        Debt Positions
      </Heading>
      <Text
        mb="28px"
        ml="5"
        backgroundColor="white"
        opacity="0.9"
        borderRadius="10px"
        padding="10px"
      >
        Please delegate all debt positions to the contract to start the transfer
      </Text>
      <Center mb="24px">
        <Button onClick={onOpen} alignSelf="center">
          Switch to recipient wallet
        </Button>
      </Center>
      <Flex flexDir="column" justifyContent="center" alignItems="left" ml="30">
        <Heading
          fontWeight="bold"
          backgroundColor="gray.200"
          width="fit-content"
          p="1"
          color="black"
          borderRadius="4px"
          mb="2.5"
          size="md"
        >
          Stable Interest Debt
        </Heading>
        <Grid
          templateColumns={'100px repeat(2, 1fr)'}
          gridTemplateRows={'50px repeat(3, 1fr) 30px'}
          gap={0}
          border="1px"
          borderRadius="10px"
          padding="10px"
          mb="10px"
          backgroundColor="white"
          opacity="0.9"
        >
          {nonZeroStableDebtBalances.length == 0 ? (
            <GridItem
              rowSpan={2}
              colSpan={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              No stable debt positions
            </GridItem>
          ) : (
            nonZeroStableDebtBalances?.map((debt) => (
              <>
                <GridItem
                  key={debt.symbol}
                  rowSpan={1}
                  colSpan={1}
                  colStart={1}
                  colEnd={2}
                  h="0"
                >
                  <Text size="sm" mr="16px">
                    <b>{debt.symbol} :</b>
                  </Text>
                </GridItem>
                <GridItem colStart={2} colEnd={4} h="12">
                  <Text textAlign="center">
                    {parseFloat(debt.balanceInTokenDecimals).toFixed(5)}{' '}
                    {debt.symbol}
                  </Text>
                </GridItem>
                <GridItem colStart={4} colEnd={5} h="12">
                  {addressBalanceUpdated?.toLowerCase() ===
                  debt.contractAddress.toLowerCase() ? (
                    <Flex justifyContent="center" mr="24px">
                      <Spinner size="md" alignSelf="center" />
                    </Flex>
                  ) : (
                    !isOldWallet && (
                      <Button
                        isDisabled={debt.allowance?.gte(debt.balance)}
                        onClick={() => onHandleApprove(debt, DebtType.STABLE)}
                      >
                        {debt.allowance?.gte(debt.balance)
                          ? 'Approved'
                          : 'Approve'}
                      </Button>
                    )
                  )}
                </GridItem>
              </>
            ))
          )}
        </Grid>
        <Heading
          fontWeight="bold"
          backgroundColor="gray.200"
          width="fit-content"
          p="1"
          color="black"
          borderRadius="4px"
          mb="2.5"
          size="md"
        >
          Variable Interest Debt
        </Heading>
        <Grid
          gap={0}
          templateColumns={'100px repeat(2, 1fr)'}
          gridTemplateRows={'50px repeat(1, 1fr)'}
          border="1px"
          borderRadius="10px"
          padding="10px"
          backgroundColor="white"
          opacity="0.9"
        >
          {nonZeroVariableDebtBalances.length === 0 ? (
            <GridItem
              rowSpan={2}
              colSpan={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              No variable debt positions
            </GridItem>
          ) : (
            nonZeroVariableDebtBalances?.map((debt) => (
              <>
                <GridItem
                  key={debt.symbol}
                  rowSpan={1}
                  colSpan={1}
                  colStart={1}
                  colEnd={2}
                  h="0"
                >
                  <Text size="sm" mr="16px">
                    <b>{debt.symbol} :</b>
                  </Text>
                </GridItem>
                <GridItem colStart={2} colEnd={4} h="12">
                  <Text textAlign="center">
                    {parseFloat(debt.balanceInTokenDecimals).toFixed(5)}{' '}
                    {debt.symbol}
                  </Text>
                </GridItem>
                <GridItem colStart={4} colEnd={5} h="12">
                  {addressBalanceUpdated?.toLowerCase() ===
                  debt.contractAddress.toLowerCase() ? (
                    <Flex justifyContent="center" mr="24px">
                      <Spinner size="md" alignSelf="center" />
                    </Flex>
                  ) : (
                    !isOldWallet && (
                      <Button
                        isDisabled={debt.allowance?.gte(debt.balance)}
                        onClick={() => onHandleApprove(debt, DebtType.VARIABLE)}
                      >
                        {debt.allowance?.gte(debt.balance)
                          ? 'Approved'
                          : 'Approve'}
                      </Button>
                    )
                  )}
                </GridItem>
                {/* <GridItem colStart={4} colEnd={5} h="12">
                  <Button
                    onClick={() => onCancelApprove(debt, DebtType.VARIABLE)}
                  >
                    Cancel Approve
                  </Button>
                </GridItem> */}
              </>
            ))
          )}
        </Grid>
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
