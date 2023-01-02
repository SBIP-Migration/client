import React from "react";
import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'

export default function Step2(props) {
    return (
        <div className={"stepBlock" + (props.selected ? " selected" : "")}>
            
            <span> Approve all Deposited tokens</span>
        </div>
    )
}