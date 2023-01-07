import React from 'react'
import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'

export default function Step1(props) {
  return (
    <div className={'stepBlock' + (props.selected ? ' selected' : '')}>
      <Text className='description pixel_font'  style={{ fontSize: 20 }} textAlign="center">
        <b>Connect your Wallet</b>
      </Text>
    </div>
  )
}
