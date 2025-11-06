'use client';

import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path, PathValue } from 'react-hook-form';
import { Label } from '@/common/components/ui/label';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/common/components/ui/carousel';
import { mockSubjects } from '../../services/lesson-creation-mock-data';

// ✅ Generic version that works with any form type
export function SubjectSelector<T extends FieldValues>({ control, error }: { control: Control<T>; error?: string }) {
  return (
    <Controller
      control={control}
      name={'subjectId' as Path<T>} // ✅ typed safely
      defaultValue={'' as PathValue<T, Path<T>>}
      render={({ field }) => (
        <div className='space-y-3'>
          <Label className='text-base font-semibold'>Chọn môn học</Label>

          <Carousel className='w-full max-w-[420px] mx-auto'>
            <CarouselContent className='py-2 px-4'>
              {mockSubjects.map((subject) => {
                const isSelected = field.value === subject.id;

                return (
                  <CarouselItem key={subject.id} className='basis-1/3 sm:basis-1/4'>
                    <button
                      type='button'
                      onClick={() => field.onChange(subject.id)}
                      className={`w-full flex flex-col items-center gap-2 rounded-lg p-3 transition-all border
                      ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary'
                          : 'border-neutral-200 bg-white hover:border-primary hover:bg-neutral-50'
                      }
                      `}
                    >
                      <img src={subject.imageUrl} alt={subject.name} className='w-10 h-10 rounded-md object-cover' />
                      <span className='text-xs font-medium text-center line-clamp-2'>{subject.name}</span>
                    </button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white shadow-md hover:bg-neutral-100' />
            <CarouselNext className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white shadow-md hover:bg-neutral-100' />
          </Carousel>

          {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
      )}
    />
  );
}
