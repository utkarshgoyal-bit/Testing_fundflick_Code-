import { useEffect, useState, useRef } from "react";
import { CheckCircle } from "lucide-react";

interface Step {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStatus: string;
}

const Stepper = ({ steps, currentStatus }: StepperProps) => {
  const safeStatus = currentStatus ?? "";
  const currentIndex =
    steps?.findIndex(
      (s) => (s.value?.toLowerCase() ?? "") === safeStatus.toLowerCase()
    ) ?? 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const stepCount = steps.length;
      const distanceBetweenCircles = containerWidth / (stepCount - 1);
      setProgressWidth(distanceBetweenCircles * currentIndex);
    }
  }, [currentIndex, steps.length]);

  return (
    <div ref={containerRef} className="relative w-full py-6">
      {/* Background line */}
      <div className="absolute top-1/2 left-0 w-full h-1 rounded-full -translate-y-1/2 bg-gray"></div>

      {/* Progress line */}
      <div
        className="absolute top-1/2 left-0 h-1 rounded-full -translate-y-1/2 transition-all duration-1000 ease-linear"
        style={{
          width: `${progressWidth}px`,
           background: "linear-gradient(to right, #7c3aed, #1e3a8a)"
        }}
      ></div>

      <ol className="flex justify-between relative w-full">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <li
              key={step.value}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`relative flex mt-5 items-center justify-center w-12 h-12 rounded-full shrink-0 border-2 transition-colors duration-500 cursor-pointer ${
                  isCompleted
                    ? "bg-blue-950 border-blue-950 text-white"
                    : isActive
                    ? "bg-white border-blue-950 text-blue-950"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle
                    size={20}
                    // className="animate-breathe"
                  />
                ) : (
                  <span className="text-gray-400">{step.icon}</span>
                )}

                {isActive && (
                  <div className="absolute w-14 h-14 border-4 border-blue-950 border-t-transparent border-l-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <span
                className={`text-sm font-medium text-center mt-2 ${
                  isActive ? "text-blue-950" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
      <style>
        {`
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          .animate-breathe {
            animation: breathe 1.5s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Stepper;
