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
  // const availableClasses = classes?.slice(0, 3); // Temporary: show first 3 classes only

  return (
    <Controller
      control={control}
      name={'classId' as Path<T>}
      defaultValue={'' as PathValue<T, Path<T>>}
      render={({ field }) => (
        <div className='space-y-3'>
          <Label htmlFor='class' className='text-base font-semibold'>
            Chọn khối lớp
          </Label>

          {selectedSubjectId ? (
            <div className='grid grid-cols-3 gap-3 mt-3 max-w-md'>
              {availableClasses?.map((cls) => {
                const isSelected = field.value === cls.id;

                return (
                  <button
                    key={cls.id}
                    type='button'
                    onClick={() => field.onChange(cls.id)}
                    className={`flex flex-col items-center justify-center rounded-lg p-3 transition-all border text-sm font-medium
                      ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary'
                          : 'border-neutral-200 bg-white hover:border-primary hover:bg-neutral-50'
                      }
                    `}
                  >
                    <img src={cls.imageUrl} alt={cls.name} className='w-10 h-10 rounded-md object-cover' />
                    <span className='text-xs font-medium text-center line-clamp-2'>{cls.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className='text-sm text-neutral-500'>Vui lòng chọn môn học trước</p>
          )}

          {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
      )}
    />
  );
}
