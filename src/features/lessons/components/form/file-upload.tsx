'use client';

import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Label } from '@/common/components/ui/label';
import { Trash, Upload } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/common/components/ui/button';

export function FileUpload<T extends FieldValues>({ control, error }: { control: Control<T>; error?: string }) {
  const [isDragActive, setIsDragActive] = useState(false);

  return (
    <Controller
      control={control}
      name={'resourceFile' as Path<T>}
      render={({ field }) => {
        const isFile = field.value && typeof field.value === 'object' && 'name' in field.value;

        return (
          <div className='space-y-3'>
            <Label className='text-base font-semibold'>Tài liệu (PDF)</Label>

            <div
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragActive(false);
              }}
              onDragOver={(e) => e.preventDefault()}
              className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-neutral-300 bg-neutral-50'
              }`}
            >
              {isFile ? (
                <>
                  <p className='font-medium'>{field.value.name}</p>
                  <Button
                    variant={'link'}
                    className='text-destructive hover:cursor-pointer'
                    onClick={() => field.onChange(null)}
                  >
                    <Trash /> Xóa
                  </Button>
                </>
              ) : (
                <label className='cursor-pointer'>
                  <Upload className='mx-auto size-8 text-neutral-400' />
                  <p className='font-medium'>Chọn file hoặc kéo thả</p>

                  <input
                    type='file'
                    accept='application/pdf'
                    className='hidden'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) field.onChange(file);
                    }}
                  />
                </label>
              )}
            </div>

            {error && <p className='text-sm text-red-500'>{error}</p>}
          </div>
        );
      }}
    />
  );
}
