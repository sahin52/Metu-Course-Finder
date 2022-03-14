import * as homeController from '@/controller/home';

import fetch from 'cross-fetch';
import fs, { cp, write } from 'fs';
import { Router } from 'express';
import {
  Bolum,
  CourseInfo,
  Criteria,
  Ders,
  Main,
  Prerequisite,
  Section,
} from '@/types/general/Bolum';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import { dirname } from 'path';
import { p, locations, removeNonNumbers } from '@/utils/p';
import { getSectionIdsAndInstructorsFromHtmlString } from '@/controller/home';
import { MainFilterInputDto } from '@/types/request/main-filter';

const router = Router();

router.get('/', homeController.getAppInfo);
router.get('/read', homeController.getIlkGiris);
let input: MainFilterInputDto = {
  takenCourses: [{courseCode:5710232,grade:"CC"}],
  wantsKibrisOdtu: false,
  wantsNormalOdtu: true,
  minWantedCredit: "3.00",
  ogrencininBolumu: "CENG",
  cumGpa: 3.0,
  soyad: "KA",
  year: 3,
}
homeController.MainFiltering(input);
router.get('/update-database', async (req, res) => {
  const result = { deneme: 123 };
  await homeController.GetAllDepartmentsCourses_Main();
  res.json(result);
});
router.get('/get-aligible-courses', async (req, res) => {
  homeController.MainFiltering(input);
});

export default router;
