'use client';

import { Controller } from 'react-hook-form';
import { Button } from '@/common/components/ui/button';
import { KeyInput } from '../key-input';
import { Loader2 } from 'lucide-react';
import type { Control, FormState } from 'react-hook-form';
import type { ActivationFormData } from './schema';

/**
 * Define the activation form props
 */
interface ActivationFormProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => void | Promise<void>;
  control: Control<ActivationFormData>;
  formState: FormState<ActivationFormData>;
  isPending: boolean;
}

/**
 * Activation key form
 */
export function ActivationForm({
  onSubmit,
  control,
  formState,
  isPending,
}: ActivationFormProps) {
  // Get validity from the formState prop
  const { isValid } = formState;

  // The form element uses the onSubmit prop from the parent
  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      {/* Activation Key Input */}
      <div>
        <Controller
          name='activationKey' // Binds this to the 'activationKey' field in our schema.
          control={control} // Use the control prop from the parent.
          render={({ field, fieldState }) => (
            <KeyInput
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      {/* Footer Buttons */}
      <div className='flex justify-end gap-2 pt-0'>
        <Button
          type='submit'
          variant='secondary'
          // Disable the button if the form is invalid (checked by Zod) or currently submitting.
          disabled={!isValid || isPending}
          className='min-w-40'
        >
          {isPending ? (
            <span className='inline-flex items-center'>
              Đang Kích Hoạt
              <Loader2 className='ms-2 h-4 w-4 animate-spin' />
            </span>
          ) : (
            'Kích Hoạt'
          )}
        </Button>
      </div>
    </form>
  );
}