import { FormProvider, useFormContext } from '@/common/contexts/form-context';
import { PhaseOneStepOne } from '../components/forms/phase-one-step-one';
import { PhaseOneStepTwo } from '../components/forms/phase-one-step-two';
import { PhaseOneStepThree } from '../components/forms/phase-one-step-three';
import { PhaseTwo } from './VrTaskDesign';

const VrLessonDesign = () => {
  const { currentStep } = useFormContext();

  return (
    <>
      {currentStep === 1 && <PhaseOneStepOne />}
      {currentStep === 2 && <PhaseOneStepTwo />}
      {currentStep === 3 && <PhaseOneStepThree />}
      {currentStep === 4 && <PhaseTwo />}
    </>
  );
};

export const VrLessonDesignPage = () => {
  return (
    <FormProvider>
      <VrLessonDesign />
    </FormProvider>
  );
};
