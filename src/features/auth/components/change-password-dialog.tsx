'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeClosed, Check, LockKeyhole, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { passwordSchema, type PasswordFormData } from './schema';
import { changePassword } from '@/common/services/auth.services';
import { toast } from 'sonner';

// ---------------- Password Input Component ----------------

const PasswordInput = ({
  label,
  id,
  register,
  error,
  placeholder,
}: {
  label: string;
  id: string;
  register: any;
  error?: string;
  placeholder?: string;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className='space-y-2'>
      <Label htmlFor={id} className='font-medium'>
        {label}
      </Label>
      <div className='relative'>
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className={`pr-10 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          {...register}
        />
        <button
          type='button'
          onClick={() => setShow(!show)}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700'
        >
          {show ? <EyeClosed size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p className='text-sm text-red-500 mt-1 flex items-center gap-1'>
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
};

// ---------------- Main Change Password Dialog ----------------

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  // Reset form every time the dialog closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  // Watch new password for live requirement check
  const newPasswordValue = useWatch({ control, name: 'newPassword' }) || '';

  const requirements = [
    { regex: /.{8,}/, label: 'Tối thiểu 8 ký tự' },
    { regex: /[A-Z]/, label: 'Ít nhất 1 chữ hoa (A-Z)' },
    { regex: /[a-z]/, label: 'Ít nhất 1 chữ thường (a-z)' },
    { regex: /[0-9]/, label: 'Ít nhất 1 số (0-9)' },
    { regex: /^[a-zA-Z0-9]*$/, label: 'Không chứa ký tự đặc biệt' },
  ];

  const onSubmit = async (data: PasswordFormData) => {
    setIsSubmitting(true);
    try {
      await changePassword(data.currentPassword, data.newPassword, data.confirmPassword);
      onSuccess?.();
      reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Change password error:', error);
      toast.error('Đổi mật khẩu thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] p-0 overflow-hidden gap-0'>
        {/* Header */}
        <DialogHeader className='px-6 py-6 bg-neutral-50 border-b border-neutral-100'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-white border border-neutral-200 rounded-lg shadow-sm'>
              <LockKeyhole className='text-primary w-5 h-5' />
            </div>
            <div>
              <DialogTitle className='text-xl'>Đổi mật khẩu</DialogTitle>
              <DialogDescription>Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='px-6 py-6 space-y-2'>
          {/* Current Password */}
          <PasswordInput
            id='currentPassword'
            label='Mật khẩu hiện tại'
            placeholder='Nhập mật khẩu hiện tại'
            register={register('currentPassword')}
            error={errors.currentPassword?.message}
          />

          <div className='h-px bg-neutral-100' />

          {/* New Password */}
          <div className='space-y-4'>
            <PasswordInput
              id='newPassword'
              label='Mật khẩu mới'
              placeholder='Nhập mật khẩu mới'
              register={register('newPassword')}
              error={errors.newPassword?.message}
            />

            {/* Requirements */}
            <div className='bg-neutral-50 p-4 rounded-lg border border-neutral-100 space-y-2'>
              <p className='text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2'>Yêu cầu mật khẩu:</p>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {requirements.map((req, index) => {
                  const isMet = req.regex.test(newPasswordValue) && newPasswordValue.length > 0;

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                        isMet ? 'text-green-600 font-medium' : 'text-neutral-500'
                      }`}
                    >
                      {isMet ? (
                        <Check size={14} className='shrink-0' />
                      ) : (
                        <div className='w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0' />
                      )}
                      {req.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <PasswordInput
            id='confirmPassword'
            label='Xác nhận mật khẩu mới'
            placeholder='Nhập lại mật khẩu mới'
            register={register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          {/* Footer */}
          <DialogFooter className='pt-2'>
            <Button type='button' variant='outline' onClick={handleCancel} disabled={isSubmitting}>
              Hủy
            </Button>

            <Button type='submit' disabled={isSubmitting} className='bg-primary hover:bg-primary/90'>
              {isSubmitting ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
