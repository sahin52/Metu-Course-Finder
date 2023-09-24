export interface Main {
  bolumler: Bolum[];
}
export interface Bolum {
  dersler: Ders[];
  name: string;
  code: number;
  totalCourses: number;
  isKibris: boolean;
  isInfoFound: boolean;
}

export interface Ders {
  prerequisite: Prerequisite[];
  courseInfo: CourseInfo;
}
export interface Prerequisite {
  ProgramCode: number;
  DeptVersion: number;
  CourseCode: number;
  Name: string;
  Credit: string;
  SetNo: number;
  MinGrade: MinGrade;
  Type: string;
  Position: 'Offered Course / A??k Ders ' | 'Closed Course / Kapal? Ders';
}
export interface CourseInfo {
  department: string;
  courseCode: number;
  courseName: string;
  credit: string;
  sectionlar: Section[];
}
export interface Section {
  instructor: string;
  sectionNumber: number;
  criteria: Criteria[];
}
export interface Criteria {
  givenDept: string;
  startChar: string;
  endChar: string;
  minCumGpa: number;
  maxCumGpa: number;
  minYear: number;
  maxYear: number;
  startGrade: StartEndGrades; //"Hic almayanlar alabilir"|"Herkes alabilir";
  endGrade: StartEndGrades; // "Hic almayanlar alabilir"|"Herkes alabilir";
}

export type StartEndGrades =
  | 'Hic almayanlar veya Basarisizlar (FD ve alti)'
  | 'Kaldi'
  | 'CC'
  | 'CB'
  | 'DC'
  | 'FD'
  | 'FF'
  | 'NA'
  | 'Hic almayanlar alabilir'
  | 'Consent of dept'
  | 'Herkes alabilir'
  | 'Hic almayanlar veya DD ve alti'
  | 'Hic almayanlar veya CC ve alti'
  | 'U'
  | 'DD'
  | 'Gecti'
  | 'BB'
  | 'AA'
  | 'BA'
  | 'Hic almayanlar veya BB ve alti';

export type MinGrade = 'DD' | 'S' | 'CB' | 'CC' | 'BB' | 'FF' | 'FD' | 'U';
