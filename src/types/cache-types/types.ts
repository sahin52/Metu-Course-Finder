import { Criteria, Prerequisite } from '@/types/general/Bolum';
export type CacheSection = {
  prereqisites: CachePrerequisite;
  courseCode: number;
  courseName: string;
  credit: string;
  department: string;
  bolumCode: number;
  isKibris: boolean;
  bolumName: string;
  criterias: Criteria[];
  sectionNumber: number;
  creditAsFloat: number;
};

export type CachePrerequisite = {
  [key: string]: Prerequisite[];
};
