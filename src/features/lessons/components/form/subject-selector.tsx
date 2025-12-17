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
import type { MasterSubjectRetrieve } from '@/common/services/subject.service';

export function SubjectSelector<T extends FieldValues>({
  control,
  error,
  subjects,
}: {
  control: Control<T>;
  error?: string;
  subjects?: MasterSubjectRetrieve[];
}) {
  return (
    <Controller
      control={control}
      name={'subjectId' as Path<T>}
      defaultValue={'' as PathValue<T, Path<T>>}
      render={({ field }) => (
        <div className='space-y-4 max-w-[60%] flex-2'>
          <Label className='text-lg font-semibold'>Chọn môn học</Label>

          <Carousel
            className='w-full px-12 relative'
            opts={{
              align: 'start',
            }}
          >
            <CarouselContent className='py-4 -ml-2 mr-4'>
              {subjects?.map((subject) => {
                const isSelected = field.value === subject.id;

                return (
                  <CarouselItem key={subject.id} className={`pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4`}>
                    <button
                      type='button'
                      onClick={() => field.onChange(subject.id)}
                      className={`w-full flex flex-col items-center justify-center gap-3 rounded-xl p-4 transition-all border shadow-sm h-full
                      ${
                        isSelected
                          ? 'bg-primary/5 text-primary border-primary ring-2 ring-primary'
                          : 'border-neutral-200 bg-white hover:border-primary/50 hover:bg-neutral-50 hover:shadow-md'
                      }
                      `}
                    >
                      <img
                        src={subject.imageUrl}
                        alt={subject.name}
                        className='w-20 h-20 rounded-lg object-cover shadow-sm'
                      />

                      <span className='text-sm font-bold text-center line-clamp-2'>{subject.name}</span>
                    </button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className='absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 border-neutral-200 bg-white shadow-sm hover:bg-neutral-100' />
            <CarouselNext className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 border-neutral-200 bg-white shadow-sm hover:bg-neutral-100' />
          </Carousel>

          {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
      )}
    />
  );
}
