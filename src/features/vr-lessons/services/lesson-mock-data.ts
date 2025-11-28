import type { VrLessonPreset } from '@/common/types/vr-lesson.type';

export const mockPreset: VrLessonPreset = {
  mapCode: 'map_lab_1',
  duration: 1200.0,
  isSequential: false,
  vrTasks: [
    {
      locationCode: 'map_lab_1_loc_2',
      vrTaskId: '54ab6e14-328b-479f-a5be-eae3d5c71881',
      taskNumber: 2,
      taskDescription: 'mt2',
      mapObject: {
        objectCode: 'beaker_h2o',
        activityType: {
          activityCode: 'info',
          config: {
            information: 'ttin',
          },
        },
      },
    },
    {
      locationCode: 'map_lab_1_loc_5',
      vrTaskId: '7cb70a1c-5d30-433d-8c17-0600f1240e79',
      taskNumber: 3,
      taskDescription: 'mt3',
      mapObject: {
        objectCode: 'tube_zinc',
        activityType: {
          activityCode: 'quiz',
          config: {
            question: 'cau hoi',
            answers: [
              {
                text: 'opa',
                isCorrect: true,
              },
              {
                text: 'opb',
                isCorrect: false,
              },
              {
                text: 'opc',
                isCorrect: false,
              },
              {
                text: 'opd',
                isCorrect: false,
              },
            ],
          },
        },
      },
    },
    {
      locationCode: 'map_lab_1_loc_1',
      vrTaskId: '81cc369d-40dd-4048-b6aa-88bc4857c175',
      taskNumber: 1,
      taskDescription: 'mt1',
      mapObject: {
        objectCode: 'beaker_h2so4',
        activityType: {
          activityCode: 'grab',
        },
      },
    },
  ],
};
