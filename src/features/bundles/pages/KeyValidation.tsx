'use client';

import { Card } from '@/common/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
// import { useNavigate } from 'react-router-dom';
import useValidateKey from '../hooks/useValidateKey';
import type { KeyValidatePayload } from '@/common/types/bundle.type';
import type { ApiErrorResponse } from '@/common/types/error.type';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form'; // Import useForm
import { zodResolver } from '@hookform/resolvers/zod'; // Import resolver
import { activationSchema, type ActivationFormData } from '../components/forms/schema';
import { ActivationForm } from '../components/forms/key-validation-form';

/**
 * Activation key page
 */
export default function ActivationPage() {
  // const navigate = useNavigate();

  // Initialize useForm here in the parent.
  // This gives us one source of truth for the form's state.
  const {
    control,
    handleSubmit,
    setError,
    formState, // Pass the whole formState object
  } = useForm<ActivationFormData>({
    resolver: zodResolver(activationSchema),
    mode: 'onChange',
    defaultValues: {
      activationKey: '',
    },
  });

  // Get the mutation function and its state from your hook
  const { validateKey, isPending } = useValidateKey();

  const handleBack = () => {
    window.history.back();
  };

  /**
   * Key validation logic
   */
  const handleActivationLogic = async (data: ActivationFormData) => {
    try {
      // TODO: Get organization id from currently logged-in school admin
      const organizationId = 'c0000001-0000-0000-0000-000000000002';

      const payload: KeyValidatePayload = {
        organizationId: organizationId,
        activationKey: data.activationKey,
      };

      // Call validate key api
      const result = await validateKey(payload);

      // On success do something with the result (e.g., save maps, redirect)
      console.log('Successfully activated:', result.maps);

      // TODO: Navigate to a success page (bundle download page)
      // navigate(routes.activationSuccess);
    } catch (err) {
      // The error is already typed as AxiosError<ApiErrorResponse> by the hook
      const apiError = err as AxiosError<ApiErrorResponse>;
      const message = apiError.response?.data?.Message || 'An unknown error occurred.';

      console.error(message);

      // Set the server error on the form field
      setError('activationKey', { type: 'manual', message: message });
    }
  };

  return (
    <div className='mx-auto container w-full space-y-6 p-8'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={handleBack} className='rounded-full bg-white shadow-sm'>
          <ChevronLeft className='size-5' />
        </Button>
        <h1 className='text-3xl self-center font-bold text-neutral-900'>Activate Product</h1>
      </div>

      {/* Form Card */}
      <Card className='p-8 w-full max-w-lg mx-auto'>
        {/*
          Pass all RHF props and state down to the "dumb" form.
          We pass RHF's handleSubmit *wrapped around* our logic function.
        */}
        <ActivationForm
          onSubmit={handleSubmit(handleActivationLogic)}
          control={control}
          formState={formState}
          isPending={isPending}
        />
      </Card>
    </div>
  );
}