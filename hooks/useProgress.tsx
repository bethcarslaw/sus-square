import {
    Box,
    BoxProps,
    Button,
    Collapse,
    Heading,
    Stack,
    useToast,
} from '@chakra-ui/react';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface StepContext {
    activeStep: number;
    setActiveStep: (step: number) => void;
    goToNextStep: () => void;
    totalSteps: number;
}

const StepContext = createContext<StepContext>({
    activeStep: 1,
    setActiveStep: () => null,
    goToNextStep: () => null,
    totalSteps: 0,
});

const Steps = ({ children, ...props }) => {
    const [activeStep, setActiveStep] = useState(1);
    const [totalSteps, setTotalSteps] = useState(0);

    const stepComponents =
        children.length > 0 &&
        children.filter((child) => child.type.name === 'Step');

    const goToNextStep = () => {
        console.log('Go To Next Step');
        if (activeStep >= totalSteps) {
            return console.log('nope');
        }

        setActiveStep(activeStep + 1);
    };

    useEffect(() => {
        setTotalSteps(stepComponents.length);
    }, [children, stepComponents]);

    return (
        <StepContext.Provider
            value={{ activeStep, setActiveStep, goToNextStep, totalSteps }}
            {...props}
        >
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
    validate?: () => Promise<boolean>;
}

const Step = ({ step, heading, ...props }: StepProps) => {
    const { activeStep, setActiveStep, totalSteps } = useSteps();
    const toast = useToast();

    const goToStep = (step: number) => activeStep > step && setActiveStep(step);

    const goToNextStep = async () => {
        if (props.hasOwnProperty('validate')) {
            const hasErrors = await props.validate();

            if (hasErrors) {
                return toast({
                    status: 'error',
                    title: 'Whoops!',
                    description:
                        'Please address any form errors before proceeding.',
                    isClosable: true,
                });
            }
        }

        if (step === totalSteps) {
            return;
        }

        setActiveStep(step + 1);
    };
    return (
        <>
            <Stack
                onClick={() => goToStep(step)}
                opacity={activeStep !== step ? 0.4 : 1}
                cursor={activeStep < step ? 'default' : 'pointer'}
            >
                <Heading
                    size="sm"
                    py="6"
                    border="1px solid rgba(255,255,255,0.1)"
                    borderLeft="none"
                    borderRight="none"
                    _hover={{ background: 'rgba(255,255,255,0.1)' }}
                >
                    {heading ? heading : `Step ${step}`}
                </Heading>
            </Stack>
            <Collapse in={activeStep === step}>
                <Box py={4} {...props} />

                {step < totalSteps && (
                    <Stack direction="column-reverse">
                        <Button onClick={() => goToNextStep()}>
                            Next Step
                        </Button>
                    </Stack>
                )}
            </Collapse>
        </>
    );
};

const useSteps = () => {
    const { activeStep, setActiveStep, goToNextStep, totalSteps } =
        useContext(StepContext);

    return {
        activeStep,
        setActiveStep,
        goToNextStep,
        totalSteps,
    };
};

export { Steps, Step, useSteps };
