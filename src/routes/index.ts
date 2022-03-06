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
import { p,locations, removeNonNumbers } from '@/utils/p';
import { getSectionIdsAndInstructorsFromHtmlString } from '@/controller/home';

const router = Router();

router.get('/', homeController.getAppInfo);
router.get('/read',homeController.getIlkGiris);
// homeController.readFunc()
router.get('/temp', async (req, res) => {
  const result = { deneme: 123 };
  await homeController.GetAllDepartmentsCourses_Main();
  res.json(result);
});

export default router;
