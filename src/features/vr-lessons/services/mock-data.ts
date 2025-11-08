// ============================
// ✅ Mock data aligned with your interfaces
// ============================

import type { Lesson } from '@/common/types/lesson.type';
import type { MapObject, ActivityType, TaskLocation, Map } from '@/common/types/map.type';
import type { MasterSubject, Subject } from '@/common/types/subject.type';
import type { VrLesson, VrTask } from '@/common/types/vr-lesson.type';

// ---------- MASTER SUBJECTS ----------
export const masterSubjects: MasterSubject[] = [
  {
    id: 'ms1',
    name: 'STEM Education',
    description: 'Science, Technology, Engineering and Mathematics learning path',
    imageUrl: '/images/master-stem.jpg',
    status: 'active',
  },
  {
    id: 'ms2',
    name: 'Humanities',
    description: 'History, literature and arts courses',
    imageUrl: '/images/master-humanities.jpg',
    status: 'active',
  },
];

// ---------- SUBJECTS ----------
export const subjects: Subject[] = [
  {
    id: 'sub1',
    name: 'Physics',
    masterSubjectId: 'ms1',
    masterSubjectName: 'STEM Education',
    description: 'Basic introduction to motion, forces, and energy.',
    imageUrl: '/images/subject-physics.jpg',
    status: 'active',
  },
  {
    id: 'sub2',
    name: 'Chemistry',
    masterSubjectId: 'ms1',
    masterSubjectName: 'STEM Education',
    description: 'Learn about elements, compounds, and chemical reactions.',
    imageUrl: '/images/subject-chemistry.jpg',
    status: 'active',
  },
  {
    id: 'sub3',
    name: 'Biology',
    masterSubjectId: 'ms1',
    masterSubjectName: 'STEM Education',
    description: 'Explore the fundamentals of life and ecosystems.',
    imageUrl: '/images/subject-biology.jpg',
    status: 'active',
  },
  {
    id: 'sub4',
    name: 'World History',
    masterSubjectId: 'ms2',
    masterSubjectName: 'Humanities',
    description: 'Study major civilizations and global historical events.',
    imageUrl: '/images/subject-history.jpg',
    status: 'active',
  },
  {
    id: 'sub5',
    name: 'Art & Design',
    masterSubjectId: 'ms2',
    masterSubjectName: 'Humanities',
    description: 'Develop creativity through visual arts and design.',
    imageUrl: '/images/subject-art.jpg',
    status: 'active',
  },
];

// ---------- LESSONS ----------
export const lessons: Lesson[] = [
  {
    id: 'lesson1',
    subjectId: 'sub1',
    subjectName: 'Physics',
    teacherId: 't001',
    name: 'Newton’s Laws of Motion',
    description: 'Understanding Newton’s three laws of motion with examples',
    resourceRelativeFilePath: '/resources/lesson1-newton.pdf',
    status: 'active',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-02T09:00:00Z',
  },
  {
    id: 'lesson2',
    subjectId: 'sub2',
    subjectName: 'Chemistry',
    teacherId: 't002',
    name: 'Chemical Reactions',
    description: 'Introduction to acids, bases, and reactions',
    resourceRelativeFilePath: '/resources/lesson2-chem.pdf',
    status: 'active',
    createdAt: '2025-01-05T09:00:00Z',
    updatedAt: '2025-01-05T09:00:00Z',
  },
];

// ---------- MAPS ----------
export const maps: Map[] = [
  {
    id: 'map1',
    name: 'Science Laboratory',
    description: 'VR environment simulating a modern laboratory',
    imageUrl: '/images/vr-science-lab.jpg',
    subjectId: 'sub2',
    subjectName: 'Chemistry',
    mapCode: 'MAP-SCI-01',
    status: 'active',
  },
  {
    id: 'map2',
    name: 'Classroom Environment',
    description: 'A virtual classroom with whiteboard and desks',
    imageUrl: '/images/vr-classroom.jpg',
    subjectId: 'sub1',
    subjectName: 'Physics',
    mapCode: 'MAP-PHY-01',
    status: 'active',
  },
];

// ---------- MAP OBJECTS ----------
export const mapObjects: MapObject[] = [
  {
    id: 'obj1',
    name: 'Beaker',
    mapId: 'map1',
    imageUrl: '/images/object-beaker.jpg',
    objectCode: 'OBJ-BEAKER',
  },
  {
    id: 'obj2',
    name: 'Microscope',
    mapId: 'map1',
    imageUrl: '/images/object-microscope.jpg',
    objectCode: 'OBJ-MICRO',
  },
  {
    id: 'obj3',
    name: 'Whiteboard',
    mapId: 'map2',
    imageUrl: '/images/object-whiteboard.jpg',
    objectCode: 'OBJ-WBOARD',
  },
];

// ---------- ACTIVITY TYPES ----------
export const activityTypes: ActivityType[] = [
  { id: 'quiz', name: 'Quiz', activityCode: 'ACT-QUIZ' },
  { id: 'information', name: 'Information', activityCode: 'ACT-INFO' },
];

// ---------- TASK LOCATIONS ----------
export const taskLocations: TaskLocation[] = [
  { id: 'loc1', name: 'Table A', mapId: 'map1', locationCode: 'LOC-TBL-A', imageUrl: '/images/loc-tableA.jpg' },
  { id: 'loc2', name: 'Table B', mapId: 'map1', locationCode: 'LOC-TBL-B', imageUrl: '/images/loc-tableB.jpg' },
  { id: 'loc3', name: 'Front Board', mapId: 'map2', locationCode: 'LOC-FRBOARD', imageUrl: '/images/loc-board.jpg' },
];

// ---------- VR LESSONS ----------
export const vrLessons: VrLesson[] = [
  {
    id: 'vrl1',
    mapId: 'map1',
    lessonId: 'lesson2',
    mapName: 'Science Laboratory',
    lessonName: 'Chemical Reactions',
    description: 'Hands-on VR chemistry experiments',
    maxDuration: 300,
    presetJsonRelativeFilePath: '/presets/vrl1-chemistry.json',
    status: 'active',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z',
  },
  {
    id: 'vrl2',
    mapId: 'map2',
    lessonId: 'lesson1',
    mapName: 'Classroom Environment',
    lessonName: 'Newton’s Laws of Motion',
    description: 'Simulate forces and movement in VR',
    maxDuration: 240,
    presetJsonRelativeFilePath: '/presets/vrl2-physics.json',
    status: 'active',
    createdAt: '2025-02-03T09:00:00Z',
    updatedAt: '2025-02-03T09:00:00Z',
  },
];

// ---------- VR TASKS ----------
export const vrTasks: VrTask[] = [
  {
    id: 'task1',
    vrLessonId: 'vrl1',
    taskLocationId: 'loc1',
    taskLocationName: 'Table A',
    mapObjectId: 'obj1',
    mapObjectName: 'Beaker',
    activityTypeId: 'act2',
    activityTypeName: 'Experiment',
    taskNumber: 1,
    description: 'Mix acid and base to observe reaction',
    createdAt: '2025-02-01T09:30:00Z',
    updatedAt: '2025-02-01T09:30:00Z',
  },
  {
    id: 'task2',
    vrLessonId: 'vrl2',
    taskLocationId: 'loc3',
    taskLocationName: 'Front Board',
    mapObjectId: 'obj3',
    mapObjectName: 'Whiteboard',
    activityTypeId: 'act1',
    activityTypeName: 'Quiz',
    taskNumber: 1,
    description: 'Answer 5 quick questions about motion laws',
    createdAt: '2025-02-03T10:00:00Z',
    updatedAt: '2025-02-03T10:00:00Z',
  },
];
