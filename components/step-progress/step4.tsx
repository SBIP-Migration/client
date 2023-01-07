import React from 'react'
import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'

type Props = {
  selected: boolean
}

export default function Step4(props: Props) {
  return (
    <div className={'stepBlock' + (props.selected ? ' selected' : '')}>
      <Text className='pixel_font'  style={{ fontSize: 20 }}  textAlign="center"><b>Execute Transfer</b></Text>
    </div>
  )
}
