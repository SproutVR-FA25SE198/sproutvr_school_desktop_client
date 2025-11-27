'use client';
import type { VRDevice } from '../types/session-monitoring.type';

interface DeviceCardProps {
  device: VRDevice;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const isOnline = device.status === 'Connected';
  const statusColor = isOnline ? '#29ae62' : '#ef4444';
  const statusBg = isOnline ? 'bg-green-50' : 'bg-red-50';

  return (
    <div
      className={`flex flex-col rounded-lg border border-neutral-200 overflow-hidden ${statusBg} shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Header */}
      <div className='border-b border-neutral-200 bg-white px-4 py-3 flex justify-between'>
        <div>
          <div className='flex flex-row gap-2 items-end'>
            <p className='text-xs text-neutral-600 tracking-wide'>Thiết bị:</p>
            <p className='text-xs font-semibold text-neutral-900 break-all'>{device.vr_device_serial_number}</p>
          </div>
          <p className='text-sm font-medium text-neutral-900 mt-1'>{device.student_name}</p>
        </div>
        <div className='flex flex-row items-center gap-2'>
          <span className='text-xs font-medium uppercase' style={{ color: statusColor }}>
            {device.status === 'Connected' ? 'Đang kết nối' : 'Mất kết nối'}
          </span>
          <div
            className='h-4 w-4 rounded-full border-2'
            style={{ backgroundColor: statusColor, borderColor: statusColor }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className='flex-1 overflow-y-auto px-4 py-3 space-y-2'>
        {device.tasks.map((task, index) => (
          <div
            key={task.vr_task_id}
            className={`rounded border bg-white p-2 ${
              task.is_completed ? (task.is_correct ? 'border-green-400' : 'border-red-400') : 'border-neutral-200'
            }`}
          >
            <div className='flex justify-between'>
              <span className='text-xs font-semibold text-neutral-700'>
                {task.question_name ?? `Nhiệm vụ ${index + 1}`}
              </span>
              <span
                className={`text-xs font-semibold ${
                  task.is_completed
                    ? task.question_name
                      ? task.is_correct
                        ? 'text-green-600'
                        : 'text-red-600'
                      : 'text-green-600' 
                    : 'text-neutral-500'
                }`}
              >
                {task.is_completed
                  ? task.question_name
                    ? task.is_correct
                      ? 'Đúng'
                      : 'Sai'
                    : 'Hoàn thành' 
                  : 'Chưa hoàn thành'}
              </span>
            </div>
            {task.completion_time_at_vietnam && (
              <p className='text-xs text-neutral-600 mt-1'>
                {new Date(task.completion_time_at_vietnam).toLocaleTimeString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
