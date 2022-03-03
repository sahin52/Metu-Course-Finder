interface RootObject {
  bolumler: Bolum[];
}
interface Bolum {
  dersler: Ders[];
  name: string;
  code: number;
  isKibris: boolean;
}

interface Ders {
  prerequisite: Prerequisite[];
  courseInfo: CourseInfo;
}
interface Prerequisite {
  ProgramCode: number;
  DeptVersion: number;
  CourseCode: number;
  Name: string;
  Credit: string;
  SetNo: number;
  MinGrade: string;
  Type: string;
  Position: string;
}
interface CourseInfo {
  department: string;
  courseCode: number;
  courseName: string;
  credit: string;
  sectionlar: Section[];
}
interface Section {
  instructor: string;
  sectionNumber: number;
  criteria: Criteria[] | undefined;
}
interface Criteria {
  givenDept: string;
  startChar: string;
  endChar: string;
  minCumGpa: number;
  maxCumGpa: number;
  minYear: number;
  maxYear: number;
  startGrade: "Hic almayanlar alabilir"|"Herkes alabilir";
  endGrade: "Hic almayanlar alabilir"|"Herkes alabilir";
}
