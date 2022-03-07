import { Grade } from "../general/get-aligible-lessons-types"

export type MainFilterInputDto = {
    takenCourses: TakenCourseRequestDto[]
    wantsKibrisOdtu: boolean
    wantsNormalOdtu: boolean
}

export type TakenCourseRequestDto={
    courseCode: number;
    grade: Grade;
}