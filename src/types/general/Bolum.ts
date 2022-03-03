export interface Main {
    bolumler: Bolum[];
  }
  export interface Bolum {
    dersler: Ders[];
    name: string;
    code: number;
    totalCourses: number;
    isKibris: boolean;
    isInfoFound: boolean
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
    MinGrade: string;
    Type: string;
    Position: string;
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
    criteria: Criteria[] | undefined;
  }
  export interface Criteria {
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
  