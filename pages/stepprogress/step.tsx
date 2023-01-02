import React from "react";
import { Button, Center, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";

export default function Step(props) {
    return (
        <>
        {/* <Flex>
        <Center 
        w="180px"
        flexDirection='column'
        alignItems='stretch' */}
        <div
        className={"stepBlock" + (props.selected ? " selected" : "")}>
            <div className="circleWrapper" onClick={() => props.updateStep(props.index + 1)}>
            <div className="circle">{props.index + 1}</div>
            
            </div>
            
            <Flex>
            <Center w='100px' className="stepbox">
            {(props.index + 1 ==1) &&
            <Step1/>
            }
            {(props.index + 1 ==2) &&
            <Step2/>
            }
            {(props.index + 1 ==3) &&
            <Step3/>
            }
            {(props.index + 1 ==4) &&
            <Step4/>
            }
            </Center>
            
            </Flex>
        </div>
        {/* </Center> */}
        {/* </Flex> */}
        </>
    )
}