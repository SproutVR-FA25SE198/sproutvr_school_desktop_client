'use client';

import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Button } from '@/common/components/ui/button';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { useFormContext } from '@/common/contexts/form-context';
import { useEffect } from 'react';

interface BaseActivityProps {
  taskNumber: number;
  onValidChange?: (isValid: boolean) => void;
}

/* -------------------------------------------------------------------------- */
/* 🧠 QUIZ ACTIVITY (with per-option isCorrect flag) */
/* -------------------------------------------------------------------------- */
export function QuizActivity({ taskNumber, onValidChange }: BaseActivityProps) {
  const { taskDetails, updateTaskDetails } = useFormContext();
  const task = taskDetails[taskNumber];

  const quizData = task?.quizData ?? {
    question: '',
    options: [
      { id: 'a', text: '', isCorrect: false },
      { id: 'b', text: '', isCorrect: false },
    ],
  };

  const handleQuestionChange = (value: string) => {
    updateTaskDetails(taskNumber, {
      quizData: { ...quizData, question: value },
    });
  };

  const handleOptionChange = (id: string, text: string) => {
    const updatedOptions = quizData.options.map((opt) => (opt.id === id ? { ...opt, text } : opt));
    updateTaskDetails(taskNumber, {
      quizData: { ...quizData, options: updatedOptions },
    });
  };

  const handleToggleCorrect = (id: string) => {
    const updated = quizData.options.map((opt) => (opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt));
    updateTaskDetails(taskNumber, {
      quizData: { ...quizData, options: updated },
    });
  };

  const addOption = () => {
    const nextLetter = String.fromCharCode(97 + quizData.options.length);
    updateTaskDetails(taskNumber, {
      quizData: {
        ...quizData,
        options: [...quizData.options, { id: nextLetter, text: '', isCorrect: false }],
      },
    });
  };

  const removeOption = (id: string) => {
    const updated = quizData.options
      .filter((opt) => opt.id !== id)
      .map((opt, i) => ({
        ...opt,
        id: String.fromCharCode(97 + i),
      }));

    updateTaskDetails(taskNumber, {
      quizData: { ...quizData, options: updated },
    });
  };

  // ✅ Validate when all fields are filled and at least one correct answer is set
  useEffect(() => {
    const valid =
      quizData.question.trim() !== '' &&
      quizData.options.every((opt) => opt.text.trim() !== '') &&
      quizData.options.some((opt) => opt.isCorrect);
    onValidChange?.(valid);
  }, [quizData]);

  return (
    <div className='space-y-4'>
      {/* Question Input */}
      <div className='flex gap-4 items-center'>
        <Label>Question</Label>
        <Input
          value={quizData.question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          placeholder='Enter quiz question'
        />
      </div>

      {/* Options */}
      <div className='space-y-3 grid grid-cols-2 items-center gap-2'>
        {quizData.options.map((opt, i) => (
          <div
            key={opt.id}
            className='flex m-0 items-center gap-2 border border-border rounded-md px-3 py-2 bg-background'
          >
            {/* Toggle Correct */}
            <button
              type='button'
              onClick={() => handleToggleCorrect(opt.id)}
              className={`${opt.isCorrect ? 'text-green-600' : 'text-muted-foreground'}`}
            >
              {opt.isCorrect ? <CheckSquare className='w-5 h-5' /> : <Square className='w-5 h-5' />}
            </button>

            {/* Option Label */}
            <Label className='w-5'>{opt.id.toUpperCase()}:</Label>

            {/* Option Input */}
            <Input
              value={opt.text}
              onChange={(e) => handleOptionChange(opt.id, e.target.value)}
              placeholder={`Option ${opt.id.toUpperCase()}`}
            />

            {/* Delete Button */}
            {i > 1 && (
              <Button
                type='button'
                size='icon'
                variant='ghost'
                onClick={() => removeOption(opt.id)}
                className='text-destructive'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Add Option */}
      <Button type='button' variant='outline' size='sm' onClick={addOption} className='gap-2 bg-transparent'>
        <Plus className='h-4 w-4' /> Add Option
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 🧾 INFORMATION ACTIVITY (unchanged) */
/* -------------------------------------------------------------------------- */
export function InformationActivity({ taskNumber, onValidChange }: BaseActivityProps) {
  const { taskDetails, updateTaskDetails } = useFormContext();
  const infoText = taskDetails[taskNumber]?.infoText ?? '';

  const handleChange = (value: string) => {
    updateTaskDetails(taskNumber, { infoText: value });
    onValidChange?.(value.trim() !== '');
  };

  return (
    <div className='space-y-2'>
      <Label>Information Content</Label>
      <Input value={infoText} onChange={(e) => handleChange(e.target.value)} placeholder='Enter information text...' />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 📦 EXPORT MAP */
/* -------------------------------------------------------------------------- */
export const activityInputMap = {
  quiz: QuizActivity,
  information: InformationActivity,
};
