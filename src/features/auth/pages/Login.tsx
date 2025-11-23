'use client';

import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { UserRole } from '@/common/utils/constants';
import { loginThunk } from '@/common/store/auth/authThunks';
import { useAppDispatch, useAppSelector } from '@/common/store/hooks';

import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { type LoginFormData, loginSchema } from '../components/schema';

import { zodResolver } from '@hookform/resolvers/zod';
import routes from '@/core/configs/routes';
import Loading from '@/common/components/loading';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state) => state.auth);

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginThunk(data));
    console.log(result);
    if (result.meta.requestStatus === 'rejected') {
      alert(result.payload as string);
      return;
    }
    if (loginThunk.fulfilled.match(result)) {
      // Redirect based on user role
      const user = result.payload;
      if (user && user.roles.includes(UserRole.ADMIN)) {
        navigate(routes.adminDashboard);
      } else {
        navigate(routes.home);
      }
    } else {
      toast.error(result.payload as string);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  if (isSubmitting || isLoading) return <Loading isLoading={isLoading || isSubmitting} />;

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-primary to-primary-light p-4'>
      {/* Background pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl'></div>
      </div>

      {/* Login card */}
      <div className='relative w-full max-w-md animate-fade-in'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 md:p-10'>
          {/* Logo and branding */}
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4'>
              <span className='text-2xl font-bold text-white'>VR</span>
            </div>
            <h1 className='text-3xl font-bold text-neutral-900 mb-2'>SproutVR</h1>
            <p className='text-neutral-500'>Hệ thống Giáo dục VR</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {/* Email */}
            <div>
              <Label>Địa chỉ email</Label>
              <Input
                type='email'
                placeholder='your@school.edu'
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <Label>Mật khẩu</Label>
              <div className='relative'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  {...register('password')}
                  className={errors.password ? 'border-red-500' : ''}
                />

                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500'
                >
                  {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <Button disabled={isLoading} type='submit' variant='secondary' size='lg' className='w-full'>
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          {/* Footer */}
          <p className='text-center text-sm text-neutral-500 mt-6'>
            Cần giúp đỡ? Liên hệ với quản trị viên trường của bạn
          </p>
        </div>
      </div>
    </div>
  );
}
