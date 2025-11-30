'use client';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Mail, Calendar, Clock, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import type { RootState } from '@/common/store';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import routes from '@/core/configs/routes';
import { formatDateOnly } from '@/common/utils/date-time-vn-converter';
import { ProfileField } from '../components/profileField';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  if (!user) return null;

  // Helper to get initials
  const initials = user.fullName
    .split(' ')
    .filter(Boolean)
    .map((name) => name.charAt(0).toUpperCase())
    .join('')
    .slice(0, 1);

  return (
    <div className='flex-1 h-full overflow-y-auto bg-slate-50/50 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        
        {/* Page Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Tài khoản cá nhân</h1>
          </div>
          <div className='flex gap-3'>
            <Button variant="outline" className='bg-white' onClick={() => navigate(routes.resetPassword)}>
              <KeyRound size={16} className="mr-2" />
              Đổi mật khẩu
            </Button>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
          
          {/* Top Section */}
          <div className='p-8 pb-0'>
            <div className='flex flex-col md:flex-row gap-6 items-start'>
              {/* Large Avatar */}
              <div className='w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-slate-50'>
                {initials}
              </div>

              {/* Name */}
              <div className='flex-1 space-y-2 pt-2'>
                <div className='flex items-center gap-3'>
                  <h2 className='text-xl font-bold text-slate-900'>{user.fullName}</h2>
                  {user.status.key === 1 ? (
                    <Badge className='bg-green-100 text-green-700 hover:bg-green-100 border-green-200 px-3'>
                      <CheckCircle2 size={14} className="mr-1" /> Hoạt động
                    </Badge>
                  ) : (
                     <Badge variant="destructive" className='px-3'>
                      <AlertCircle size={14} className="mr-1" /> Đã khóa
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='h-px bg-slate-100 mx-8 my-8' />

          {/* Details Grid */}
          <div className='p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8'>
            
            <ProfileField 
              icon={<Mail className='text-blue-500' size={20} />}
              label="Địa chỉ Email"
              value={user.email}
            />

            <ProfileField 
              icon={<Calendar className='text-purple-500' size={20} />}
              label="Ngày sinh"
              value={formatDateOnly(user.dateOfBirth)}
            />

            <ProfileField 
              icon={<Clock className='text-orange-500' size={20} />}
              label="Ngày tham gia"
              value={formatDateOnly(user.joinedAtVietNam)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}