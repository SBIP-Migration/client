import { Flex } from '@chakra-ui/react'
import React from 'react'
import { StepEnum } from '../../pages'
import Step from './step'

type Props = {
  labelArray: string[]
  currentStep: StepEnum
  updateStep: (step: StepEnum) => void
}

export default function StepNavigation(props: Props) {
  return (
    <Flex>
      {props.labelArray.map((_, index) => (
        <Step
          key={index}
          index={index}
          updateStep={props.updateStep}
          selected={props.currentStep === index + 1}
        />
      ))}
    </Flex>
  )
}
