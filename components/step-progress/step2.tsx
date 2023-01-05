import React from 'react'
import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'

export default function Step2(props) {
  return (
    <div className={'stepBlock' + (props.selected ? ' selected' : '')}>
      <Text textAlign="center">Approve all Deposited tokens</Text>
    </div>
  )
}
