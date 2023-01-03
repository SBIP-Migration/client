import React, { useState } from "react";
import StepNavigation from "./stepNavigation";

export enum Step {
  CONNECT_WALLET = 0,
  APPROVE_A_TOKENS = 1,
  APPROVE_DEBT_POSITIONS = 2,
  TRANSFER_TOKENS = 3,
  COMPLETE = 4
}


function StepProgress() {
  const labelArray = ['Step 1', 'Step 2', 'Step 3', 'Step 4']
  const [currentStep, updateCurrentStep] = useState<Step>(Step.CONNECT_WALLET);

  function updateStep(step: Step) {
    updateCurrentStep(step);
  }

  return (
    <div className="App">
      <StepNavigation labelArray={labelArray} currentStep={currentStep} updateStep={updateStep} />
      <p>Selected Step: {currentStep}</p>
      <button className="primaryButton" disabled={currentStep === Step.CONNECT_WALLET} onClick={() => updateStep(currentStep - 1)}>Previous Step</button>
      <button className="primaryButton" disabled={currentStep === Step.TRANSFER_TOKENS} onClick={() => updateStep(currentStep + 1)}>Next Step</button>
    </div>
  );
}

export default StepProgress;
