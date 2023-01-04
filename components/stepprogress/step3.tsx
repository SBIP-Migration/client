import React from "react";
import { Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'

export default function Step3(props) {
    return (
        <div className={"stepBlock" + (props.selected ? " selected" : "")}>
            {/* <div>{props.index + 1}</div> */}
            <span> Approve All Debt Positions</span>
        </div>
    )
}