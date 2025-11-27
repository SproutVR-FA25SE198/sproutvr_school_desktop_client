'use client';

interface SubjectFilterTabsProps {
  selectedSubject: string;
  subjects: { id: string; name: string }[];
  onSubjectChange: (subjectName: string) => void;
}

export function SubjectFilterTabs({ selectedSubject, subjects, onSubjectChange }: SubjectFilterTabsProps) {
  return (
    <div className="flex gap-2 mb-6 pb-4 border-b border-neutral-200 overflow-x-auto">
      {subjects.map((subject) => (
        <button
          key={subject.id}
          onClick={() =>
            onSubjectChange(
              selectedSubject === subject.name ? 'all' : subject.name
            )
          }
          className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
            selectedSubject === subject.name
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
