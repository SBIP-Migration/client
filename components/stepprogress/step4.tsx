import React from "react";
import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'

export default function Step4(props) {
    return (
        <div className={"stepBlock" + (props.selected ? " selected" : "")}>
            {/* <div>{props.index + 1}</div> */}
            <span>Execute Transfer</span>
        </div>
    )
}