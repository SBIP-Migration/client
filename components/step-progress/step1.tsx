import React from 'react'
import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'

export default function Step1(props) {
  return (
    <div className={'stepBlock' + (props.selected ? ' selected' : '')}>
      <Text className="description" textAlign="center">
        Connect your Wallet
      </Text>
    </div>
  )
}
