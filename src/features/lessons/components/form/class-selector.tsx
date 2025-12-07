'use client';

import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path, PathValue } from 'react-hook-form';
import { Label } from '@/common/components/ui/label';
import type { SubjectRetrieve } from '@/common/services/subject.service';

export function ClassSelector<T extends FieldValues>({
  control,
  selectedSubjectId,
  error,
  classes,
}: {
  control: Control<T>;
  selectedSubjectId: string;
  classes?: SubjectRetrieve[];
  error?: string;
}) {
  const availableClasses = classes?.filter((cls) => cls.masterSubject.id === selectedSubjectId);

  return (
    <Controller
      control={control}
      name={'classId' as Path<T>}
      defaultValue={'' as PathValue<T, Path<T>>}
      render={({ field }) => (
        <div className='space-y-4'>
          <Label htmlFor='class' className='text-lg font-semibold'>
            Chọn khối lớp
          </Label>

          {selectedSubjectId ? (
            <div className='grid grid-cols-3 gap-6 mt-4 w-full'>
              {availableClasses?.map((cls) => {
                const isSelected = field.value === cls.id;

                return (
                  <button
                    key={cls.id}
                    type='button'
                    onClick={() => field.onChange(cls.id)}
                    className={`flex flex-col items-center justify-center rounded-xl p-4 transition-all border shadow-sm h-full
                      ${
                        isSelected
                          ? 'bg-primary/5 border-primary ring-2 ring-primary text-primary'
                          : 'border-neutral-200 bg-white hover:border-primary/50 hover:bg-neutral-50 hover:shadow-md'
                      }
                    `}
                  >
                    <img 
                        src={cls.imageUrl} 
                        alt={cls.name} 
                        className='w-20 h-20 rounded-lg object-cover shadow-sm mb-3' 
                    />
                    
                    <span className='text-sm font-bold text-center line-clamp-2'>
                        {cls.name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className='p-8 border-2 border-dashed border-neutral-200 rounded-xl flex items-center justify-center bg-neutral-50'>
                <p className='text-base text-neutral-500 font-medium'>Vui lòng chọn môn học trước</p>
            </div>
          )}

          {error && <p className='text-sm text-red-500 font-medium mt-2'>{error}</p>}
        </div>
      )}
    />
  );
}