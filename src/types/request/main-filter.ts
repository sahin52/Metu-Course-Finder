import { Grade } from "../general/get-aligible-lessons-types"

export type MainFilterInputDto = {
    takenCourses: TakenCourseRequestDto[]
    wantsKibrisOdtu: boolean
    wantsNormalOdtu: boolean
    minWantedCredit: string
    istenilenBolum?: number
    ogrencininBolumu: string
}

export type TakenCourseRequestDto={
    courseCode: number;
    grade: Grade;
}