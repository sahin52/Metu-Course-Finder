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
import { locations, removeNonNumbers } from '@/utils/p';
import { getSectionIdsAndInstructorsFromHtmlString } from '@/controller/home';
import { MainFilterInputDto } from '@/types/request/main-filter';

const router = Router();

router.get('/', homeController.getAppInfo);
router.get('/read-test', homeController.getIlkGiris);
let input: MainFilterInputDto = {
  takenCourses: [],
  wantsKibrisOdtu: false,
  wantsNormalOdtu: true,
  minWantedCredit: '2.00',
  ogrencininBolumu: 'CENG',
  cumGpa: 2.6,
  soyad: 'KA',
  year: 3,
};
// homeController.MainFiltering(input);
router.get('/update-database', async (req, res) => {
  const result = { deneme: 123 };
  await homeController.GetAllDepartmentsCourses_Main();
  res.json(result);
});
router.get('/get-aligible-courses-test', async (req, res) => {
  homeController.MainFiltering(input, res);
});
router.get('/g-test', async (req, res) => {
  homeController.CrFilter();
  const result = { deneme: 123 };
  res.json(result);
});
router.get('/get-details', (req, res) => {
  // main function
  let query: any = req.query;
  if (query.wantsKibrisOdtu === 'true') {
    query.wantsKibrisOdtu = true;
  }
  if (query.wantsKibrisOdtu === 'false') {
    query.wantsKibrisOdtu = false;
  }
  if (query.wantsNormalOdtu === 'true') {
    query.wantsNormalOdtu = true;
  }
  if (query.wantsNormalOdtu === 'false') {
    query.wantsNormalOdtu = false;
  }
  query.cumGpa = parseFloat(query.cumGpa);
  query.year = parseInt(query.year);
  query.istenilenBolum = parseInt(query.istenilenBolum);
  if (query.takenCourses === undefined) query.takenCourses = [];
  homeController.MainFiltering(query, res);
});
export default router;
