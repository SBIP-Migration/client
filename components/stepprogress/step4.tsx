import React from 'react'
import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'

export default function Step4(props) {
  return (
    <div className={'stepBlock' + (props.selected ? ' selected' : '')}>
      <Text textAlign="center">Execute Transfer</Text>
    </div>
  )
}
