import React from 'react'
import { Button, Center, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import ConnectWallet from './step1'
import ApproveLendingPositions from './step2'
import ApproveDebtPositions from './step3'
import ExecuteTransfer from './step4'
import { StepEnum } from '../../pages'

export type StepProps = {
  selected: boolean
  index: number
  updateStep: (step: number) => void
}

export default function Step(props: StepProps) {
  return (
    <>
      <div className={'stepBlock' + (props.selected ? ' selected' : '')}>
        <div
          className="circleWrapper"
          onClick={() => props.updateStep(props.index + 1)}
        >
          <div className="circle">{props.index + 1}</div>
        </div>
        <Flex>
          <Center w="100px" className="stepbox" pt="2.5">
            {props.index + 1 == StepEnum.APPROVE_A_TOKENS ? (
              <ApproveLendingPositions />
            ) : props.index + 1 == StepEnum.APPROVE_DEBT_POSITIONS ? (
              <ApproveDebtPositions />
            ) : props.index + 1 == StepEnum.TRANSFER_TOKENS ? (
              <ExecuteTransfer />
            ) : null}
          </Center>
        </Flex>
      </div>
    </>
  )
}
