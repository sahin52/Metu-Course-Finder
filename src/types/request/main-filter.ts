import { Grade } from '../general/get-aligible-lessons-types';

export type MainFilterInputDto = {
  takenCourses: TakenCourseRequestDto[];
  wantsKibrisOdtu: boolean;
  wantsNormalOdtu: boolean;
  minWantedCredit: string;
  istenilenBolum?: number;
  ogrencininBolumu: string;
  soyad: string;
  cumGpa: number;
  year: number;
  [key: string]: any;
};

export type TakenCourseRequestDto = {
  courseCode: string; //this is actually string
  grade: Grade;
};
