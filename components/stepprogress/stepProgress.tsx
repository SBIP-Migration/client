import { Box, Button, Flex } from '@chakra-ui/react'
import React, { useState } from 'react'
import StepNavigation from './stepNavigation'

export enum StepEnum {
  CONNECT_WALLET = 1,
  APPROVE_A_TOKENS = 2,
  APPROVE_DEBT_POSITIONS = 3,
  TRANSFER_TOKENS = 4,
  COMPLETE = 5,
}

function StepProgress() {
  const labelArray = ['Step 1', 'Step 2', 'Step 3', 'Step 4']
  const [currentStep, updateCurrentStep] = useState<StepEnum>(
    StepEnum.CONNECT_WALLET
  )

  function updateStep(step: StepEnum) {
    updateCurrentStep(step)
  }

  return (
    <Flex flexDir="column">
      <StepNavigation
        labelArray={labelArray}
        currentStep={currentStep}
        updateStep={updateStep}
      />
      <Box alignSelf="center" mt="4">
        <Button
          backgroundColor="red"
          textColor="white"
          onClick={() => updateStep(currentStep + 1)}
        >
          Next Step
        </Button>
      </Box>
    </Flex>
  )
}

export default StepProgress
