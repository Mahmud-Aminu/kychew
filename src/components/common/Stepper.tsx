interface StepperProps {
    steps: string[];
    currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <nav aria-label="Progress" className="w-full">
            <ol className="flex items-center">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <li
                            key={step}
                            className={`relative flex-1 ${index < steps.length - 1 ? '' : ''}`}
                        >
                            <div className="flex items-center">
                                {/* Step circle */}
                                <div
                                    className={`
                    relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                    text-sm font-semibold transition-all duration-300
                    ${isCompleted
                                            ? 'bg-accent-600 text-white'
                                            : isCurrent
                                                ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                                                : 'bg-surface-200 text-surface-500'
                                        }
                  `}
                                    aria-current={isCurrent ? 'step' : undefined}
                                >
                                    {isCompleted ? (
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L7 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>

                                {/* Connector line */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`
                      h-0.5 w-full transition-colors duration-300
                      ${isCompleted ? 'bg-accent-600' : 'bg-surface-200'}
                    `}
                                    />
                                )}
                            </div>

                            {/* Step label */}
                            <p
                                className={`
                  mt-2 text-xs font-medium text-center absolute -left-2 w-20
                  ${isCompleted
                                        ? 'text-accent-700'
                                        : isCurrent
                                            ? 'text-primary-700'
                                            : 'text-surface-500'
                                    }
                `}
                            >
                                {step}
                            </p>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
