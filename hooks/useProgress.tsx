import {
  Box,
  BoxProps,
  Collapse,
  Heading,
  Stack,
  useToast,
} from "@chakra-ui/react";
import React, { createContext, useContext, useState } from "react";

interface StepContext {
  activeStep: number;
  setActiveStep: (step: number) => void;
}

const StepContext = createContext<StepContext>({
  activeStep: 1,
  setActiveStep: () => null,
});

const Steps = ({ children, ...props }) => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <StepContext.Provider value={{ activeStep, setActiveStep }} {...props}>
      {React.Children.toArray(children).map((child, index) => (
        <>
          {React.cloneElement(
            child as React.ReactElement<
              any,
              string | React.JSXElementConstructor<any>
            >,
            { step: index + 1 }
          )}
        </>
      ))}
    </StepContext.Provider>
  );
};

interface StepProps extends BoxProps {
  heading?: string;
  step?: number;
  validate?: () => boolean;
}

const Step = ({ step, heading, ...props }: StepProps) => {
  const { activeStep, setActiveStep } = useSteps();
  const toast = useToast();

  const goToStep = (step: number) => {
    console.log(props);
    if (!props.hasOwnProperty("validate")) {
      console.log("No validate");
      setActiveStep(step);
      return;
    }

    if (props.validate()) {
      console.log("Validated");
      setActiveStep(step);
      return;
    }

    return toast({
      title: "Please fill in all required fields",
      status: "error",
    });
  };

  return (
    <>
      <Stack
        onClick={() => goToStep(step)}
        opacity={activeStep !== step ? 0.4 : 1}
        cursor="pointer"
      >
        <Heading
          size="sm"
          py="6"
          border="1px solid rgba(255,255,255,0.1)"
          borderLeft="none"
          borderRight="none"
          _hover={{ background: "rgba(255,255,255,0.1)" }}
        >
          {heading ? heading : `Step ${step}`}
        </Heading>
      </Stack>
      <Collapse in={activeStep === step}>
        <Box py={4} {...props} />
      </Collapse>
    </>
  );
};

const useSteps = () => {
  const { activeStep, setActiveStep } = useContext(StepContext);

  return {
    activeStep,
    setActiveStep,
  };
};

export { Steps, Step, useSteps };
