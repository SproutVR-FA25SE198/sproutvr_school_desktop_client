'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { VrLessonPatchPayload, VrLessonRetrieve, VrTaskDetails } from '../types/vr-lesson.type';
import { createVrLessonPhaseTwo } from '@/features/vr-lessons/services/vr-lesson.service';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import routes from '@/core/configs/routes';
import { toast } from 'sonner';

export interface LessonFormData {
  id: string;
  subject: string;
  lesson: string;
  duration: string;
  instructions: string;
  map: string;
  name: string;
  description: string;
}

export interface TaskData {
  taskName: string;
  description: string;
  taskLocation: string;
  object: string;
  activity: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizData {
  question: string;
  options: QuizOption[];
}

export interface TaskSetupData {
  taskName: string;
  description: string;
  taskLocation: string;
  mapObject: string;
  activityType: string;
  quizData?: QuizData;
}

export interface TaskDetails {
  vrTaskId: string;
  activityType: string;
  quizData?: QuizData;
  infoText?: string;
}

export interface FormContextType {
  // Step 1 data
  lessonData: LessonFormData;
  updateLessonData: (data: Partial<LessonFormData>) => void;

  // Step 2 data
  tasks: Record<number, TaskData>;
  updateTask: (taskNumber: number, data: Partial<TaskData>) => void;

  tasksType: 'ordered' | 'unordered';
  setTasksType: (type: 'ordered' | 'unordered') => void;
  taskSetups: Record<number, TaskSetupData>;
  updateTaskSetup: (taskNumber: number, data: Partial<TaskSetupData>) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  taskDetails: Record<number, TaskDetails>;
  updateTaskDetails: (taskNumber: number, updates: Partial<TaskDetails>) => void;
  // Navigation
  currentStep: number;
  goToStep: (step: number) => void;

  // Submit
  submitForm: () => void;

  createVrLessonPhaseTwoMutate: (variables: { vrLessonId: string; payload: VrLessonPatchPayload }) => void;
  isPending: boolean;

  vrLessonData: VrLessonRetrieve | null;
  setVrLessonData: (data: VrLessonRetrieve | null) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [lessonData, setLessonData] = useState<LessonFormData>({
    id: '',
    subject: '',
    lesson: '',
    duration: '',
    instructions: '',
    map: '',
    name: '',
    description: '',
  });

  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Record<number, TaskData>>({
    1: {
      taskName: '',
      description: '',
      taskLocation: '',
      object: '',
      activity: '',
    },
  });

  const [vrLessonData, setVrLessonData] = useState<VrLessonRetrieve | null>(null);

  const [tasksType, setTasksType] = useState<'ordered' | 'unordered'>('unordered');
  const [currentTab, setCurrentTab] = useState('overview');
  const [taskSetups, setTaskSetups] = useState<Record<number, TaskSetupData>>({});
  const [taskDetails, setTaskDetails] = useState<Record<number, TaskDetails>>({});

  const [currentStep, setCurrentStep] = useState(1);

  const { mutate: createVrLessonPhaseTwoMutate, isPending } = useMutation({
    mutationFn: async (variables: { vrLessonId: string; payload: VrLessonPatchPayload }) => {
      return await createVrLessonPhaseTwo({
        lessonId: variables.vrLessonId,
        payload: variables.payload,
      });
    },
  });

  const updateLessonData = (data: Partial<LessonFormData>) => {
    setLessonData((prev) => ({ ...prev, ...data }));
  };

  const updateTask = (taskNumber: number, data: Partial<TaskData>) => {
    setTasks((prev) => ({
      ...prev,
      [taskNumber]: { ...prev[taskNumber], ...data },
    }));
  };

  const updateTaskSetup = (taskNumber: number, data: Partial<TaskSetupData>) => {
    setTaskSetups((prev) => ({
      ...prev,
      [taskNumber]: { ...prev[taskNumber], ...data },
    }));
  };

  const updateTaskDetails = (taskNumber: number, updates: Partial<TaskDetails>) => {
    setTaskDetails((prev) => ({
      ...prev,
      [taskNumber]: {
        ...prev[taskNumber],
        ...updates,
      },
    }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);

    if (step === 4 && Object.keys(taskSetups).length === 0) {
      const initialSetups: Record<number, TaskSetupData> = {};
      Object.keys(tasks).forEach((key) => {
        const taskNum = Number.parseInt(key);
        const task = tasks[taskNum];
        initialSetups[taskNum] = {
          taskName: task.taskName || '',
          description: task.description || '',
          taskLocation: task.taskLocation || '',
          mapObject: task.object || '',
          activityType: task.activity || '',
          quizData: {
            question: '',
            options: [
              { id: 'a', text: '', isCorrect: false },
              { id: 'b', text: '', isCorrect: false },
            ],
          },
        };
      });
      setTaskSetups(initialSetups);
    }
  };

  const submitForm = () => {
    const completeFormData: VrLessonPatchPayload = {
      isSequential: tasksType === 'ordered',
      taskConfigs: Object.keys(taskDetails).map((key) => {
        const vrTaskId = vrLessonData?.tasks[Number.parseInt(key) - 1]?.id || '';
        const quiz = taskDetails[Number.parseInt(key)]?.quizData;
        const info = taskDetails[Number.parseInt(key)]?.infoText || null;
        return {
          vrTaskId,
          question: quiz?.question || '',
          answers: quiz?.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })) || [],
          information: info,
        } as VrTaskDetails;
      }),
    };

    console.log('vrLessonData:', vrLessonData);

    createVrLessonPhaseTwoMutate(
      { vrLessonId: vrLessonData?.id || '', payload: completeFormData },
      {
        onSuccess: () => {
          toast.success('Hoàn tất tạo bài học VR!');
          navigate(routes.lessonDetails.replace(':id', vrLessonData?.lesson.id || ''), { state: { refresh: true } });
        },
      },
    );
    // Send to backend here
  };

  return (
    <FormContext.Provider
      value={{
        lessonData,
        updateLessonData,
        tasks,
        updateTask,
        tasksType,
        setTasksType,
        taskSetups,
        updateTaskSetup,
        taskDetails,
        updateTaskDetails,
        currentTab,
        setCurrentTab,
        currentStep,
        goToStep,
        submitForm,
        vrLessonData,
        setVrLessonData,
        createVrLessonPhaseTwoMutate,
        isPending: isPending,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
}
