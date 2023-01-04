import React from "react";
import Step from "./step";
import { Step as StepEnum } from "./stepProgress"

type Props = {
    labelArray: string[]
    currentStep: StepEnum
    updateStep: (step: StepEnum) => void
}

export default function StepNavigation(props: Props) {
    return (
        <div className="stepWrapper">
            {props.labelArray.map((item, index) => 
            <Step 
            key={index} 
            index={index} 
            label={item} 
            updateStep={props.updateStep} 
            selected={props.currentStep === index + 1}>

            </Step>) }
        </div>
    )
}