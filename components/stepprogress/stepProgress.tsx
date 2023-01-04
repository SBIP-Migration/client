import { Box, Button, Flex } from '@chakra-ui/react'
import React, { useState } from 'react'
import { StepEnum } from '../../pages'
import StepNavigation from './stepNavigation'

type Props = {
  currentStep: StepEnum
  updateStep: (step: StepEnum) => void
}

function StepProgress({ currentStep, updateStep }: Props) {
  const labelArray: string[] = ['Step 1', 'Step 2', 'Step 3']

  return (
    <Flex flexDir="column">
      <StepNavigation
        {...{
          labelArray,
          currentStep,
          updateStep,
        }}
      />
    </Flex>
  )
}

export default StepProgress
