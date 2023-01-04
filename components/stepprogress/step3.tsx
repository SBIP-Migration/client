import React from 'react'
import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'

export default function Step3(props) {
  return (
    <div className={'stepBlock' + (props.selected ? ' selected' : '')}>
      <Text textAlign="center"> Approve All Debt Positions</Text>
    </div>
  )
}
