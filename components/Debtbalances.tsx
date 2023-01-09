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
import { useConnectWallet } from '@web3-onboard/react'
import { approveCreditDelegation } from '../utils/ethers'
import { AAVE_MIGRATION_CONTRACT } from '../constants'
import { WrapperTokenType } from './Balances'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber } from 'ethers'
import { revokeCreditDelegation } from '../utils/ethers'

type Props = {
  stableDebtBalances: WrapperTokenType[]
  variableDebtBalances: WrapperTokenType[]
  refreshDebtAllowances: () => void
  setIsSameWallet: (isSameWallet: boolean) => void
}

const DebtBalances = ({
  stableDebtBalances,
  variableDebtBalances,
  refreshDebtAllowances,
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
    await connect()
  }, [connect, onClose])

  useEffect(() => {
    if (!wallet) return
    refreshDebtAllowances()
  }, [refreshDebtAllowances, wallet])

  useEffect(() => {
    if (!wallet || !wallet.accounts?.[0]?.address) return
    localStorage.setItem('recipient', wallet?.accounts?.[0]?.address)
    console.log('stableDebtBalances', stableDebtBalances)
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
        BigNumber.from(2).pow(256).sub(1)
      )
      await tx.wait()
      refreshDebtAllowances()
    },
    [refreshDebtAllowances, wallet]
  )

  const onHandleRevoke = async (token: WrapperTokenType) => {
    const tx = await revokeCreditDelegation(
      wallet,
      debtTokenBalance.contractAddress,
      AAVE_MIGRATION_CONTRACT,
      // Maximum amount of tokens that can be approved -> 2^256 - 1
      //BigNumber.from(2).pow(256).sub(1)
    )
    // Wait until transaction is confirmed, then update "allowance" status
    await tx.wait()
    refreshDebtAllowances()
  }

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
          <GridItem rowSpan={1} colSpan={1} colStart={0} colEnd={1} h="0">
            <Flex w="100px">
              <b>Stable Interest Debt</b>
            </Flex>
          </GridItem>
          {stableDebtBalances
            ?.filter((debt) => debt?.balance?.gt(0))
            .map((debt) => (
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
                <GridItem colStart={2} colEnd={3} h="12">
                  {parseFloat(debt.balanceInTokenDecimals).toFixed(5)}
                </GridItem>
                <GridItem colStart={3} colEnd={5} h="12">
                  {!isOldWallet && (
                    <>
                      <Button
                        isDisabled={debt.allowance?.gt(0)}
                        onClick={() => onHandleApprove(debt)}
                      >
                        {debt.allowance?.gt(0) ? 'Approved' : 'Approve'}
                      </Button>

                      <Button onClick={() => onHandleRevoke(debt)}>
                        {'Revoke'}
                      </Button>
                    </>
                  )}
                </GridItem>
              </>
            ))}
        </Grid>

        <Grid
          gap={0}
          templateColumns={'100px repeat(2, 1fr)'}
          gridTemplateRows={'80px repeat(1, 1fr)'}
          border="1px"
          borderRadius="10px"
          padding="10px"
          backgroundColor="white"
          opacity="0.9"
        >
          <GridItem rowSpan={1} colSpan={1} colStart={0} colEnd={1} h="0">
            <Flex w="100px">
              <b>Variable Interest Debt</b>
            </Flex>
          </GridItem>
          {/* <Flex border="1px" borderRadius="10px" padding="10px"> */}
          {variableDebtBalances
            ?.filter((debt) => debt?.balance?.gt(0))
            ?.map((debt) => (
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
                <GridItem colStart={2} colEnd={3} h="12">
                  {parseFloat(debt.balanceInTokenDecimals).toFixed(5)}
                </GridItem>
                <GridItem colStart={3} colEnd={5} h="12">
                  {!isOldWallet && (
                    <>
                      <Button
                        isDisabled={debt.allowance?.gte(debt.balance)}
                        onClick={() => onHandleApprove(debt)}
                      >
                        {debt.allowance?.gte(debt.balance)
                          ? 'Approved'
                          : 'Approve'}
                      </Button>
                      {/* <Button onClick={() => onHandleRevoke(debt)}>
                        {'Revoke'}
                      </Button> */}
                    </>
                  )}
                </GridItem>
              </>
            ))}
          {/* </Flex> */}
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
