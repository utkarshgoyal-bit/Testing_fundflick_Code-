import React from "react";
import cn from "classnames"; // For conditional class merging
import { Check, Dot } from "lucide-react";
import { STEPS_NAMES } from "@/lib/enums";

const StepBarDesktop = ({
    steps,
    activeStep,
    completedSteps,
    handleStepChange,
    stepsData,
    STEPS_NAMES,
}: {
    steps: { name: string; icon: React.ReactNode }[];
    activeStep: string;
    completedSteps: string[];
    handleStepChange: (step: string) => void;
    stepsData: any;
    STEPS_NAMES: any;
}) => {
    return (
        <div className="flex items-center md:w-[90%] w-full m-auto h-[5%] max-md:hidden">
            {steps.map((list, index) => (
                <React.Fragment key={index}>
                    {/* Step Dot */}
                    <div
                        onClick={() => {
                            if (!stepsData.stepsDone?.includes(STEPS_NAMES.CUSTOMER)) return;
                            handleStepChange(list.name);
                        }}
                        className={cn(
                            "border-2 rounded-full  h-11 w-11 relative z-10 cursor-pointer",
                            (completedSteps.includes(list.name) ||
                                stepsData?.stepsDone?.includes(list.name.toString()) ||
                                activeStep === list.name) && "bg-primary",
                            activeStep === list.name && "border-4 border-[#d7d3dc] font-bold"
                        )}

                    >
                        <div className="flex items-center justify-center w-full h-full">
                            {completedSteps.includes(list.name) ||
                                stepsData?.stepsDone?.includes(list.name.toString()) ? (
                                <Check size={30} className="text-white" />
                            ) : (
                                <Dot
                                    size={10}
                                    className={cn(
                                        "bg-[#D0D5DD] text-[#D0D5DD] rounded-full",
                                        activeStep === list.name && "bg-white text-white"
                                    )}
                                />
                            )}
                        </div>
                        <p className="relative -left-1 mt-1 ">{list.name}</p>
                    </div>

                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                        <div
                            className={cn(
                                "flex-1 h-1",
                                (completedSteps.includes(list.name) ||
                                    stepsData?.stepsDone?.includes(list.name.toString()))
                                    ? "bg-primary"
                                    : "bg-[#D0D5DD]"
                            )}
                        ></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const StepBarMobile = ({ steps, activeStep, completedSteps, handleStepChange, stepsData }: {
    steps: { name: string; icon: React.ReactNode }[],
    activeStep: string,
    completedSteps: string[],
    handleStepChange: (step: string) => void,
    stepsData: any
}) => {
    return (
        <div
            className="flex overflow-x-auto gap-4 pt-2 md:hidden border-b-2  "
        >
            {steps.map((list, index) => (
                <div
                    key={index}
                    onClick={() => {
                        if (!stepsData.stepsDone?.includes((STEPS_NAMES.CUSTOMER))) return
                        handleStepChange(list.name)
                    }}
                    className={cn(
                        "flex-shrink-0 px-2 py-2  cursor-pointer transition-all duration-150 text-md",
                        (completedSteps.includes(list.name) ||
                            stepsData?.stepsDone?.includes((list.name).toString())) &&
                        "text-[#7F56D9]",
                        activeStep === list.name && "border-b-4 border-b-[#7F56D9] font-bold"
                    )}
                >
                    <div className="flex items-center justify-stretch">
                        <span>{list.name}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export { StepBarDesktop, StepBarMobile };
