export interface Subject {
  id: string;
  name: string;
  imageUrl: string;
}

export const mockSubjects: Subject[] = [
  {
    id: 'math-001',
    name: 'Mathematics',
    imageUrl: '/abstract-mathematics.png',
  },
  {
    id: 'biology-001',
    name: 'Biology',
    imageUrl: '/biology-concepts.png',
  },
  {
    id: 'chemistry-001',
    name: 'Chemistry',
    imageUrl: '/chemistry-lab-setup.png',
  },
  {
    id: 'physics-001',
    name: 'Physics',
    imageUrl: '/physics-concepts.png',
  },
  {
    id: 'history-001',
    name: 'History',
    imageUrl: '/history-scroll-timeline.png',
  },
  {
    id: 'english-001',
    name: 'English',
    imageUrl: '/english.jpg',
  },
];
