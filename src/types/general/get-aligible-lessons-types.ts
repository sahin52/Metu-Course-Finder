export type GetAligibleLessonsInputDto = {
  Department: string;
  WantsKibris: boolean;
  WantsNormalOdtu: boolean;
  Gpa: number;
  TakenCourses: TakenCourse[];
  SurnameFirstTwoChars: string;
  YearInSchool: number;
  DeptVersion: any; ///TODO
};
export type TakenCourse = {
  CourseCode: string;
  grade: Grade;
};

export type Grade =
  | 'AA'
  | 'BA'
  | 'BB'
  | 'CB'
  | 'CC'
  | 'DC'
  | 'DD'
  | 'FF'
  | 'FD'
  | 'NA'
  | 'S'
  | 'U'; //TODO
