import React from "react";
import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'

export default function Step1(props) {
    return (
        <div className={"stepBlock" + (props.selected ? " selected" : "")}>
            <span className="description"> Connect your Account and get Balances of tokens</span>
        </div>
    )
}