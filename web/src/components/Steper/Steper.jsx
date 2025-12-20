import React from 'react';
import { useTranslation } from 'react-i18next';

const Steper = ({ currentStep }) => {
    const { t } = useTranslation();

    // Function to determine step color styles
    const getStepStyle = (step) => {
        if (step < currentStep) {
            return 'bg-[#43b11a] text-white border-[#43b11a]'; // Completed steps
        } else if (step === currentStep) {
            return 'bg-[#a797cc] text-white border-[#a797cc]'; // Active step (current step)
        } else {
            return 'bg-white text-[#a797cc] border-[#a797cc]'; // Upcoming steps
        }
    };

    const getTextStyle = (step) => {
        if (step < currentStep) {
            return 'text-[#43b11a]'; // Text color for completed steps
        } else if (step === currentStep) {
            return 'text-[#a797cc]'; // Text color for the active step
        } else {
            return 'text-[#cb9ea3]'; // Text color for upcoming steps
        }
    };

    const steps = [
        { step: 1, label: t('steper.tab1') }, // Basic Info
        { step: 2, label: t('steper.tab2') }, // Personal Info + Questions
        { step: 3, label: t('steper.tab3') }, // Bank Details
        { step: 4, label: t('steper.tab4') }, // Upload CNIC
    ];

    return (
        <div className="flex flex-col md:flex-row justify-start md:justify-center items-start md:items-center pt-8 px-5 sm:px-10 md:px-0 gap-y-5 md:gap-y-0">
            {steps.map((stepItem, index) => (
                <React.Fragment key={stepItem.step}>
                    {/* Step */}
                    <div className="flex items-center gap-x-2">
                        <div
                            className={`flex justify-center items-center w-10 h-10 font-semibold rounded-full border-2 shadow-md ${getStepStyle(stepItem.step)}`}
                        >
                            {currentStep > stepItem.step ? '✓' : stepItem.step}
                        </div>
                        <span className={`text-sm font-semibold ${getTextStyle(stepItem.step)}`}>{stepItem.label}</span>
                    </div>

                    {/* Step Divider - Only show if not last step */}
                    {index < steps.length - 1 && (
                        <div
                            className={`ml-1 md:ml-2 w-8 md:w-20 lg:w-24 border-t-2 transform rotate-90 md:rotate-0 ${
                                currentStep > stepItem.step ? 'border-[#43b11a]' : 'border-[#a797cc]'
                            }`}
                        ></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Steper;
