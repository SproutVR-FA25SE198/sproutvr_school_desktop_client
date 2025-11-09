'use client';

import { SUBJECTS } from '../services/lessons-mock-data';

interface SubjectFilterTabsProps {
  selectedSubject: string;
  onSubjectChange: (subjectId: string) => void;
}

export function SubjectFilterTabs({ selectedSubject, onSubjectChange }: SubjectFilterTabsProps) {
  return (
    <div className='flex gap-2 mb-6 pb-4 border-b border-neutral-200'>
      {SUBJECTS.map((subject) => (
        <button
          key={subject.id}
          onClick={() => onSubjectChange(subject.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedSubject === subject.id
              ? 'bg-primary text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          {subject.name}
        </button>
      ))}
    </div>
  );
}
