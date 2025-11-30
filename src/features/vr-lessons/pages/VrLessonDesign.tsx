import { FormProvider, useFormContext } from '@/common/contexts/form-context';
import { PhaseOneStepOne } from '../components/forms/phase-one-step-one';
import { PhaseOneStepTwo } from '../components/forms/phase-one-step-two';
import { PhaseOneStepThree } from '../components/forms/phase-one-step-three';
import { PhaseTwo } from './VrTaskDesign';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import useGetMapsBySubject from '@/common/hooks/useGetMapsBySubject';
import Loading from '@/common/components/loading';
import type { MapRetrieveResponse } from '@/common/types/map.type';

const VrLessonDesign = () => {
  const { currentStep } = useFormContext();
  const location = useLocation();
  const lesson = useMemo(() => location.state?.lesson, [location.state?.lesson]);

  const { data: maps, isLoading: isMapsLoading } = useGetMapsBySubject({ subjectId: lesson?.subject.id || '' });

  const isLoading = isMapsLoading;

  if (isLoading) return <Loading isLoading />;

  return (
    <>
      <div className='mt-16'>
        {currentStep === 1 && <PhaseOneStepOne maps={maps || ({} as MapRetrieveResponse)} lesson={lesson} />}
        {currentStep === 2 && <PhaseOneStepTwo maps={maps || ({} as MapRetrieveResponse)} />}
        {currentStep === 3 && <PhaseOneStepThree />}
        {currentStep === 4 && <PhaseTwo />}
      </div>
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
