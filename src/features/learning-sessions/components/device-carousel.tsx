'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DeviceCard } from './device-card';
import type { VRDevice } from '../types/session-monitoring.type';

interface DeviceCarouselProps {
  isTaskMenuCollapsed: boolean;
  devices: VRDevice[];
}

export function DeviceCarousel({ isTaskMenuCollapsed, devices }: DeviceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const devicesPerView = isTaskMenuCollapsed ? 3 : 2;
  const maxIndex = Math.max(0, devices.length - devicesPerView);
  const activeDevicesCount = devices.filter((device) => device.status === 'Connected').length;

  const handlePrevious = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  const visibleDevices = devices.slice(currentIndex, currentIndex + devicesPerView);

  return (
    <div className='flex flex-col gap-4 h-full'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-neutral-900'>Quản lý thiết bị</h2>
        {activeDevicesCount}/{devices.length} thiết bị đang hoạt động
        <p className='text-sm text-neutral-600'>
          {currentIndex + 1} - {Math.min(currentIndex + devicesPerView, devices.length)} trong số {devices.length}
        </p>
      </div>

      <div className='flex-1 flex items-start gap-4'>
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className='p-2 border rounded-lg bg-white hover:bg-neutral-100 disabled:opacity-50 transition-all'
        >
          <ChevronLeft size={20} />
        </button>

        <div className='flex-1 grid gap-4' style={{ gridTemplateColumns: `repeat(${devicesPerView}, 1fr)` }}>
          {visibleDevices.map((device) => (
            <DeviceCard key={device.vr_device_serial_number} device={device} />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === maxIndex}
          className='p-2 border rounded-lg bg-white hover:bg-neutral-100 disabled:opacity-50 transition-all'
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
