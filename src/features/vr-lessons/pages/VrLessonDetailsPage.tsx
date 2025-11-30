'use client';

import { Button } from '@/common/components/ui/button';
import { Link, useParams } from 'react-router-dom';
import { VrLessonDetails } from '../components/vr-lesson-details';
import useGetVrLessonById, { useGetVrLessonPresetFile } from '@/common/hooks/useGetVrLessonById';
import Loading from '@/common/components/loading';
import { ChevronLeft } from 'lucide-react';
import routes from '@/core/configs/routes';
import useGetTaskLocations from '@/common/hooks/useGetTaskLocations';
import useGetMapObjects from '@/common/hooks/useGetMapObjects';
import useGetActivityTypes from '@/common/hooks/useGetActivityTypes';
import { useEffect, useState } from 'react';
import type { VrLessonPresetExtended, VrLessonPresetTaskExtended } from '@/common/types/vr-lesson.type';

export default function VrLessonDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: lesson, isLoading: isLessonLoading } = useGetVrLessonById(id || '');
  const { data: tasks, isLoading: isTasksLoading } = useGetVrLessonPresetFile(lesson?.presetJsonRelativeFilePath || '');
  const { data: locations, isLoading: isLocationsLoading } = useGetTaskLocations({ mapId: lesson?.map.id || '' });

  const { data: objects, isLoading: isObjectsLoading } = useGetMapObjects({
    mapId: lesson?.map.id || '',
    locationId: '',
  });

  const { data: activityTypes, isLoading: isActivityTypesLoading } = useGetActivityTypes({
    objectId: '',
  });

  const [tasksExtended, setTasksExtended] = useState<VrLessonPresetExtended | null>(null);

  useEffect(() => {
    if (lesson && tasks && locations && objects && activityTypes) {
      const extendedTasks = tasks.vrTasks.map((task) => {
        const location = locations.items.find((loc) => loc.locationCode === task.locationCode);
        const object = objects.items.find((obj) => obj.objectCode === task.mapObject.objectCode);
        const activityType = activityTypes.items.find(
          (act) => act.activityCode === task.mapObject.activityType.activityCode,
        );
        return {
          ...task,
          locationName: location ? location.name : 'Unknown Location',
          locationImageUrl: location ? location.imageUrl : '',
          mapObject: {
            ...task.mapObject,
            name: object ? object.name : 'Unknown Object',
            imageUrl: object ? object.imageUrl : '',
            activityType: {
              ...task.mapObject.activityType,
              name: activityType ? activityType.name : 'Unknown Activity',
            },
          },
        } as VrLessonPresetTaskExtended;
      });

      setTasksExtended({
        ...tasks,
        vrTasks: extendedTasks,
      });
    }
  }, [lesson, tasks, locations, objects, activityTypes]);

  const isLoading =
    isLessonLoading || isTasksLoading || isLocationsLoading || isObjectsLoading || isActivityTypesLoading;

  if (isLoading) return <Loading isLoading={isLoading} />;
  if (!lesson || !tasksExtended) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-neutral-900 mb-2'>Không tìm thấy bài học VR</h2>
          <p className='text-neutral-600 mb-4'>Bài học VR bạn đang tìm không tồn tại.</p>
          <Link to={routes.lessons.replace(':id', lesson?.lesson.id || '')}>
            <Button className='bg-primary text-white hover:bg-primary/90'>Quay lại</Button>
          </Link>
        </div>
      </div>
    );
  } else
    return (
      <div className='flex-1 overflow-y-auto h-full'>
        <div className='max-w-4xl mx-auto px-8 py-8 overflow-y-auto'>
          {/* Back Button */}
          <Link
            to={routes.lessonDetails.replace(':id', lesson.lesson.id) || routes.home}
            className='inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors'
          >
            <ChevronLeft size={16} />
            <span>Quay lại</span>
          </Link>

          {/* VR Lesson Details */}
          <VrLessonDetails lesson={lesson} tasks={tasksExtended || ({} as VrLessonPresetExtended)} />
        </div>
      </div>
    );
}
