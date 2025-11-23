'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { Button } from '@/common/components/ui/button';
import { KeyIcon } from 'lucide-react';
import routes from '@/core/configs/routes';
import type { KeyValidatePayload } from '@/features/school-admin/bundles/types/bundle.type';
import type { ApiErrorResponse } from '@/common/types/error.type';
import { activationSchema, type ActivationFormData } from '../forms/schema';
import useValidateKey from '../../hooks/useValidateKey';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/common/components/ui/dialog';
import { ActivationForm } from '../forms/key-validation-form';

export function ActivationDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // TODO: Get organization id from currently logged-in school admin
  const organizationId = 'c0000001-0000-0000-0000-000000000002';

  // Initialize useForm hook
  const {
    control,
    handleSubmit,
    setError,
    formState,
    reset,
  } = useForm<ActivationFormData>({
    resolver: zodResolver(activationSchema),
    mode: 'onChange',
    defaultValues: {
      activationKey: '',
    },
  });

  // Get mutation function from the hook
  const { validateKey, isPending } = useValidateKey();

  /**
   * Key validation logic
   */
  const handleActivationLogic = async (data: ActivationFormData) => {
    try {
      const payload: KeyValidatePayload = {
        organizationId: organizationId,
        activationKey: data.activationKey,
      };

      // Call validate key api
      const result = await validateKey(payload);
      const orderId = result.orderId;

      // SUCCESS
      toast.success('Kích hoạt gói thành công.');

      // Invalidate the bundles list to refresh it in the background
      await queryClient.invalidateQueries({
        queryKey: ['myBundles', organizationId],
      });

      // Close dialog and reset form
      setOpen(false);
      reset();

      // Navigate to the new bundle's details page
      navigate(`${routes.myBundles}/${orderId}`);
    } catch (err) {
      // ERROR
      const apiError = err as AxiosError<ApiErrorResponse>;
      const message =
        apiError.response?.data?.Message || 'Mã kích hoạt không hợp lệ.';

      console.error(message);
      toast.error(`Kích hoạt thất bại: ${message}`);
      setError('activationKey', { type: 'manual', message: message });
    }
  };

  // Reset form when dialog is closed
  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <KeyIcon className="mr-2 h-4 w-4" />
          Kích Hoạt Gói
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nhập Mã Kích Hoạt Học Liệu</DialogTitle>
          <DialogDescription>
            Mã kích hoạt của bạn thường sẽ nằm trong email từ nhà cung cấp chính.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-0">
          <ActivationForm
            onSubmit={handleSubmit(handleActivationLogic)}
            control={control}
            formState={formState}
            isPending={isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}