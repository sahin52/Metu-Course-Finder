import * as homeService from '@/service/home';

import { Request, Response } from 'express';

import fetch from 'cross-fetch';
import fs, { cp, write } from 'fs';
import { Router } from 'express';
import {
  Bolum,
  CourseInfo,
  Criteria,
  Ders,
  Main,
  MinGrade,
  Prerequisite,
  Section,
  StartEndGrades,
} from '@/types/general/Bolum';
import { CacheSection } from '@/types/cache-types/types';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import { dirname } from 'path';
import cache from 'memory-cache';
import { p, locations, removeNonNumbers } from '@/utils/p';
import {
  MainFilterInputDto,
  TakenCourseRequestDto,
} from '@/types/request/main-filter';
import { Grade } from '@/types/general/get-aligible-lessons-types';

/**
 * Gets the API information.
 *
 * @param {Request} req
 * @param {Response} res
 */
export const getAppInfo = (req: Request, res: Response) => {
  const result = homeService.getAppInfo();

  res.json(result);
};
const cacheKey = 'veri';
const allLessonsDataPath = 'data/all-lesson-details.json';
export const getIlkGiris = (req: Request, res: Response) => {
  const result = { asd: 1 };
  readFunc();
  res.json(result);
};
export async function GetAllDepartmentsCourses_Main() {
  let allDeptsNum: number[] = JSON.parse(
    fs.readFileSync('helperfiles/important/all-depts.json').toString(),
  );
  let main: Main = { bolumler: [] };
  for (let i = 0; i < allDeptsNum.length; i++) {
    const deptNum = allDeptsNum[i];
    console.log('deptNum');
    console.log(deptNum);

    let f = await fetch(
      'https://oibs2.metu.edu.tr//View_Program_Course_Details_64/main.php',
      {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
          'cache-control': 'max-age=0',
          'content-type': 'application/x-www-form-urlencoded',
          'sec-ch-ua':
            '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'iframe',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          cookie:
            '_ga=GA1.3.313145970.1639841661; _APP_LOCALE=EN; _gid=GA1.3.1929801388.1646276825; __sid=96e2dde3240ef372dd4e282dd9271ca52e99e434694b2f1ac1792111a61ad8005f39477f281d2aef8ddf15bff886c9a4070f89a1c8ec566cc29e3598b0dd4a05; phpSess_e7f8a2b66340bd43b00edc2a215826d5=e6xWDHqXZ8PcEyiDg84qzRIp2AtcIHS1xOXKkbeixoxpPwjovgVlFM11r2jPGfplvuclZ4rXs6PStVzF6BFXpejwF1P22ws0Zc2aj7CM0I0UegU4OuKD6Eh3jeK9Fv6v',
          Referer: 'https://oibs2.metu.edu.tr//View_Program_Course_Details_64/',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: `textWithoutThesis=1&select_dept=${deptNum}&select_semester=20212&submit_CourseList=Submit&hidden_redir=Login`,
        method: 'POST',
      },
    );
    let headers = f.headers;
    let deptHtmlRes = await f.text();
    w(deptNum, deptHtmlRes);

    if (
      deptHtmlRes.includes(
        'Information about the department could not be found.',
      )
    ) {
      let bolum: Bolum = {
        isInfoFound: false,
        dersler: [],
        name: '',
        totalCourses: -1,
        code: deptNum,
        isKibris: false,
      };
      main.bolumler.push(bolum);
      continue;
    }
    let setCookiFromHeader = headers.get('Set-Cookie');
    let setCooki = setCookiFromHeader!.slice(0, setCookiFromHeader!.length - 8);

    //else

    let doc = new DOMParser({
      locator: {},
      errorHandler: {
        warning: function (w) {},
        error: function (e) {},
        fatalError: function (e) {
          console.error(e);
        },
      },
    }).parseFromString(deptHtmlRes);

    let totalCourses =
      xpath.select('//*[@id="single_content"]/form/TABLE[4]/TR', doc).length -
      1;
    let name = xpath
      .select(
        '//*[@id="single_content"]/form/TABLE[1]/TR/TD[1]/FONT/text()',
        doc,
      )
      .toString();
    console.log(totalCourses);
    let bolum: Bolum = {
      isInfoFound: true,
      dersler: await getDersler(doc, totalCourses, deptNum, setCooki),
      name: name,
      code: deptNum,
      totalCourses: totalCourses,
      isKibris: name.includes('Kuzey K'),
    };

    //
    main.bolumler.push(bolum);

    if (main.bolumler.length % 2 == 0) {
      writeResult(main);
    }
  }
  writeResult(main);
}

export function tempApiTrials() {
  let data = GetFromCache();
  let res = new Set();
  data.forEach((row) =>
    Object.entries(row.prereqisites).forEach(([key, value]) =>
      value.forEach((pre) => res.add(pre.MinGrade)),
    ),
  );
  console.log(res);
}
const groupBy = function (xs: any[], key: string) {
  return xs.reduce(function (rv: any, x: any) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
export function GetFromCache(): CacheSection[] {
  // Try Get From Cache
  var veri: CacheSection[] = cache.get(cacheKey);
  if (veri === null) {
    p('veri null');
    let json: Main = JSON.parse(fs.readFileSync(allLessonsDataPath).toString());
    let filteredBolums = json.bolumler.filter(
      (i) =>
        i.totalCourses > 0 && i.isInfoFound === true && i.dersler.length > 0,
    );
    let sections: CacheSection[] = [];
    filteredBolums.forEach((bolum) => {
      bolum.dersler.forEach((course) => {
        course.courseInfo.sectionlar.forEach((section) => {
          sections.push({
            prereqisites: groupBy(course.prerequisite, 'SetNo'),
            bolumCode: bolum.code,
            bolumName: bolum.name,
            courseCode: course.courseInfo.courseCode,
            courseName: course.courseInfo.courseName,
            credit: course.courseInfo.credit,
            creditAsFloat: parseFloat(course.courseInfo.credit.substring(0, 4)),
            department: course.courseInfo.department,
            isKibris: bolum.isKibris,
            criterias: section.criteria,
            sectionNumber: section.sectionNumber,
          });
        });
      });
    });
    fs.writeFileSync('temp/cache.json', JSON.stringify(sections));
    cache.put(cacheKey, sections);
    return sections;
    //// departman Acik mi, Ders Acmis mi,
    //// veriyi sadece kursa çevir: GetAllCoursesAndTheirPrerequisites And Their Sections
    //// bunu cache'ye kaydet
  }
  p('veri not null');
  return veri;
}
export function MainFiltering(input: MainFilterInputDto) {
  let sections = GetFromCache();
  let res = sections
    .filter(
      (section) =>
        (input.wantsKibrisOdtu && section.isKibris) ||
        (input.wantsNormalOdtu && !section.isKibris),
    )
    .filter(
      (section) => section.credit.substring(0, 4) >= input.minWantedCredit,
    )
    .filter((section) => {
      if (input.istenilenBolum === undefined) return true;
      return (
        input.istenilenBolum !== undefined &&
        section.bolumCode === input.istenilenBolum
      );
    })
    .filter((section) => {
      let res =
        Object.keys(section.prereqisites).length === 0 ||
        Object.entries(section.prereqisites).some(([setNo, prerequisites], i) =>
          prerequisites.every((prerequisite) => {
            let res = input.takenCourses.some((inputcourse) => {
              let res =
                inputcourse.courseCode === prerequisite.CourseCode &&
                isGradeGreater(inputcourse.grade, prerequisite.MinGrade);
              return res;
            });
            return res;
          }),
        );
      return res;
    })
    .filter((section) => {
      let res = true;
      if (section.criterias.length === 0) return true;
      res = section.criterias.some((criteria) => {
        let res =
          (criteria.givenDept === 'ALL' ||
            criteria.givenDept === input.ogrencininBolumu) &&
          criteria.startChar < input.soyad &&
          criteria.endChar > input.soyad &&
          criteria.minCumGpa < input.cumGpa &&
          criteria.maxCumGpa > input.cumGpa &&
          criteria.minYear < input.year &&
          criteria.maxYear > input.year &&
          getIfGradeOK(
            criteria.startGrade,
            criteria.endGrade,
            input.takenCourses.filter(
              (i) => i.courseCode === section.courseCode,
            )[0],
          );
        return res;
      });
      return res;
    });
  console.log(JSON.stringify(res, null, 4));
  console.log(res.length);
  // isKibris
  // prerequisitesi olan kursları icinden prerequisitesi uymayanları cikar:
  ////////// SetNo'ya ve ders alımına göre filtrele
  ////////// ProgramCode ve DeptVersion hepsinde aynı
  ////////// verilen CourseCode alınmış mı, alındıysa min grade okey mi
  ////////// position kapalı acik ders ? Siktir et bi ise yaramiyor
  //
  // criteria'lari uymayanlari cikar:
  ////////// GivenDept Bizim dept değilse
  ////////// Soyisim StartChar ve EndChar arasında değilse //TODO dahil mi
  ////////// minCumGpa maxCumGpa arasında olmayan bi cumGpa'imiz varsa// TODO dahilmi
  ////////// minYear maxYear arasında olmayan bi year'ımız varsa // TODO dahilmi
  ////////// startGrade ve endGrade arasında olmayan bir gradeimiz varsa
  ////////// CIKAR
}
export function readFunc() {
  let result = new Set<string>();
  let startChars = new Set<string>();
  let endChars = new Set<string>();
  let positions = new Set<string>();
  let str = fs.readFileSync(allLessonsDataPath).toString();
  let json: Main = JSON.parse(str);
  let courseCodes = new Set<number>();
  json.bolumler
    .filter((i) => i.isInfoFound && i.totalCourses > 0)
    .forEach((i) =>
      i.dersler.forEach((ders) => {
        ders.prerequisite.forEach((pre) => {
          if (pre.Position === 'Closed Course / Kapal? Ders')
            courseCodes.add(pre.CourseCode);
        });
      }),
    );
  json.bolumler
    .filter((i) => i.isInfoFound && i.totalCourses > 0)
    .forEach((i) =>
      i.dersler.forEach((ders) => {
        ders.courseInfo.sectionlar.forEach((sections) => {
          sections.criteria.forEach((criter) => {});
        });
        ders.prerequisite.forEach((pre) => {
          if (courseCodes.has(pre.CourseCode)) p(pre.Position);
        });
      }),
    );
  p('--------------------1');

  console.log(result);
  p('--------------------2');
  console.log(startChars);
  p('--------------------3');
  console.log(endChars);
  p('--------------------4');
  p(positions);
  p('--------------------5');
}

export function getGivenDeptFromDoc(kacinci: number, document: Document) {
  //DONE
  let xpathString = getXpathForCriteriaName(kacinci);
  return xpath
    .select(xpathString, document)
    .toString()
    .replace(/[^A-Z]/g, '');
}

export function getCriteriasOfIthRow(kacinci: number, doc: Document) {
  //DONE
  let res: string[] = [];
  let xpaths = getCriteriaXpathsOtherThanName(kacinci, doc);
  for (let i = 0; i < xpaths.length; i++) {
    const path = xpaths[i];
    res.push(xpath.select(path, doc).toString());
  }
  return res;
}
export function getXpathForCriteriaName(i: number) {
  //DONE
  return (
    '//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/' +
    'TR/TD/FONT/'.repeat(i) +
    'text()'
  );
}
export function getCriteriaXpathsOtherThanName(i: number, doc: Document) {
  //DONE test
  let res: string[] = [];
  for (let j = 1; j <= 8; j++) {
    res.push(
      '//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/' +
        'TR/TD/FONT/'.repeat(i) +
        `TD[${j}]/FONT/text()`,
    );
  }
  return res;
}
export function kacCriteraVar(doc: Document): number {
  //DONE
  let res = 0;
  while (true) {
    let name = getGivenDeptFromDoc(res, doc);
    if (name === undefined || name === null || name === '') {
      break;
    }
    res++;
  }
  return res;
}

export function getCriterias(doc: Document): Criteria[] {
  //DONE
  let numberOfCriterias = kacCriteraVar(doc);
  let res: Criteria[] = [];
  for (let i = 0; i < numberOfCriterias; i++) {
    let dept = getGivenDeptFromDoc(i, doc);
    let crits = getCriteriasOfIthRow(i, doc);
    let criteria: Criteria = {
      givenDept: dept,
      startChar: crits[0],
      endChar: crits[1],
      minCumGpa: parseFloat(crits[2]),
      maxCumGpa: parseFloat(crits[3]),
      minYear: parseInt(crits[4]),
      maxYear: parseInt(crits[5]),
      startGrade: crits[6] as any,
      endGrade: crits[7] as any,
    };
    res.push(criteria);
  }

  return res;
}
export function getSectionIdsAndInstructorsFromHtmlString(
  sectionsHtmlString: string,
) {
  let submitSectionTextLocations = locations(
    'submit_section',
    sectionsHtmlString,
  );
  const sectionLen = submitSectionTextLocations.length;
  const sectionIdsStrings = submitSectionTextLocations.map((location) =>
    sectionsHtmlString.substring(location - 15, location - 5),
  );
  console.log(sectionIdsStrings);
  const sectionIds = sectionIdsStrings.map((str) =>
    parseInt(removeNonNumbers(str)),
  );
  console.log('sectionLen', sectionLen);
  let instrunctorNameStartLoc = submitSectionTextLocations.map(
    (location) =>
      sectionsHtmlString.slice(location).indexOf('FACE=ARIAL') + 11 + location,
  );
  let nameEnd = instrunctorNameStartLoc.map(
    (location) =>
      sectionsHtmlString.slice(location).indexOf('</FONT>') + location,
  );
  let names = nameEnd.map((location, i) =>
    sectionsHtmlString.substring(instrunctorNameStartLoc[i], location),
  );
  return { sectionIds, names };
}

export function getPrerequisitesFromString(textHtml: string) {
  if (textHtml.includes('There is no prerequisite defined for this course')) {
    return [];
  }

  let doc = new DOMParser({
    locator: {},
    errorHandler: {
      warning: function (w) {},
      error: function (e) {},
      fatalError: function (e) {
        console.error(e);
      },
    },
  }).parseFromString(textHtml);

  let uzunluk =
    xpath.select(`//*[@id="single_content"]/form/TABLE[4]/TR`, doc).length - 1;
  let res: Prerequisite[] = [];
  for (let i = 0; i < uzunluk; i++) {
    let programCodeX = `//*[@id="single_content"]/form/TABLE[4]/TR[${
      i + 2
    }]/TD[1]/FONT/text()`;
    let deptVersionX = `//*[@id="single_content"]/form/TABLE[4]/TR[${
      i + 2
    }]/TD[2]/FONT/text()`;
    let courseCodeX = `//*[@id="single_content"]/form/TABLE[4]/TR[${
      i + 2
    }]/TD[3]/FONT/text()`;
    let nameX = `//*[@id="single_content"]/form/TABLE[4]/TR[${
      i + 2
    }]/TD[4]/FONT/text()`;
    let creditX = `//*[@id="single_content"]/form/TABLE[4]/TR[${
      i + 2
    }]/TD[5]/FONT/text()`;
    let setNoX = `//*[@id="single_content"]/form/TABLE[4]/TR[${
      i + 2
    }]/TD[6]/FONT/text()`;
    let minGradeX = `//*[@id="single_content"]/form/TABLE[4]/TR[${
      i + 2
    }]/TD[7]/FONT/text()`;
    let typeX = `//*[@id="single_content"]/form/TABLE[4]/TR[${
      i + 2
    }]/TD[8]/FONT/text()`;
    let positionX = `//*[@id="single_content"]/form/TABLE[4]/TR[${
      i + 2
    }]/TD[9]/FONT/text()`;
    let prerequisite: Prerequisite = {
      ProgramCode: parseInt(xpath.select(programCodeX, doc).toString()),
      DeptVersion: parseInt(xpath.select(deptVersionX, doc).toString()),
      CourseCode: parseInt(xpath.select(courseCodeX, doc).toString()),
      Name: xpath.select(nameX, doc).toString(),
      Credit: xpath.select(creditX, doc).toString(),
      SetNo: parseInt(xpath.select(setNoX, doc).toString()),
      MinGrade: xpath.select(minGradeX, doc).toString() as any,
      Type: xpath.select(typeX, doc).toString(),
      Position: xpath.select(positionX, doc).toString() as any,
    };
    res.push(prerequisite);
  }
  return res;
}

function writeResult(main: Main) {
  let filename = `results_${new Date().toJSON().replace(/:/g, '-')}.json`;
  fs.writeFileSync(
    `real-req-results/${filename}`,
    JSON.stringify(main, null, 4),
  );
}
function w(deptnum: number | string, text: any) {
  let dir = 'temp';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(`temp/${deptnum}.html`, text);
}

async function getDersler(
  derslerDoc: Document,
  totalCourses: number,
  deptNum: number,
  setCookie: string,
): Promise<Ders[]> {
  let res: Ders[] = [];

  for (let i = 0; i < totalCourses; i++) {
    let courseCodeXpath = `//*[@id="single_content"]/form/TABLE[4]/TR[${
      i + 2
    }]/TD[2]/FONT/text()`;
    let courseCode = xpath.select(courseCodeXpath, derslerDoc).toString();

    let courseInfo = await getCourseInfo(i, derslerDoc, courseCode, setCookie);
    let prerequisite: Prerequisite[] = await getPrerequisite(
      setCookie,
      courseCode,
    );
    let ders: Ders = {
      courseInfo: courseInfo,
      prerequisite: prerequisite,
    };
    res.push(ders);
  }
  return res;
}

async function getCourseInfo(
  i: number,
  derslerDoc: Document,
  courseCode: string,
  setCookie: string,
): Promise<CourseInfo> {
  p('courseCode', courseCode);
  let courseInfoFetch = await fetch(
    'https://oibs2.metu.edu.tr//View_Program_Course_Details_64/main.php',
    {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'max-age=0',
        'content-type': 'application/x-www-form-urlencoded',
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'iframe',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        cookie: `_ga=GA1.3.313145970.1639841661; _APP_LOCALE=EN; _gid=GA1.3.1929801388.1646276825; __sid=96e2dde3240ef372dd4e282dd9271ca52e99e434694b2f1ac1792111a61ad8005f39477f281d2aef8ddf15bff886c9a4070f89a1c8ec566cc29e3598b0dd4a05; ${setCookie}`,
        Referer:
          'https://oibs2.metu.edu.tr//View_Program_Course_Details_64/main.php',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: `SubmitCourseInfo=Course+Info&text_course_code=${courseCode}&hidden_redir=Course_List`,
      method: 'POST',
    },
  );
  // console.log('responz');
  // console.log(response);
  let sectionsHtmlString = await courseInfoFetch.text();
  let dir = 'temp';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(`temp/${courseCode}.html`, sectionsHtmlString);
  let sectionsDoc = new DOMParser({
    locator: {},
    errorHandler: {
      warning: function (w) {},
      error: function (e) {},
      fatalError: function (e) {
        console.error(e);
      },
    },
  }).parseFromString(sectionsHtmlString);
  console.log('ewkk');
  console.log(
    xpath
      .select(
        '//*[@id="single_content"]/form/TABLE[1]/TR[1]/TD[1]',
        sectionsDoc,
      )
      .toString(),
  );
  console.log(
    xpath
      .select('//*[@id="single_content"]/form/TABLE[1]/TR[1]', sectionsDoc)
      .toString(),
  );
  console.log(
    xpath
      .select('//*[@id="single_content"]/form/TABLE[1]', sectionsDoc)
      .toString(),
  );
  console.log(
    xpath
      .select('//*[@id="single_content"]/form/TABLE[2]', sectionsDoc)
      .toString(),
  );
  console.log(
    xpath
      .select(
        '//*[@id="single_content"]/form/TABLE[1]/TR[1]/TD[1]/FONT[1]/text()',
        sectionsDoc,
      )
      .toString(),
  );
  p('done');
  let courseInfo: CourseInfo = {
    department: xpath
      .select(
        '//*[@id="single_content"]/form/TABLE[1]/TR[1]/TD[1]/FONT[1]/text()',
        sectionsDoc,
      )
      .toString(),
    courseCode: parseInt(
      xpath
        .select(
          '//*[@id="single_content"]/form/TABLE[1]/TR[2]/TD[1]/FONT/text()',
          sectionsDoc,
        )
        .toString(),
    ),
    courseName: xpath
      .select(
        '//*[@id="single_content"]/form/TABLE[1]/TR[2]/TD[2]/FONT/text()',
        sectionsDoc,
      )
      .toString(),
    credit: xpath
      .select(
        '//*[@id="single_content"]/form/TABLE[1]/TR[3]/TD[1]/FONT/text()',
        sectionsDoc,
      )
      .toString(),
    sectionlar: await getSectionBilgileri(
      sectionsHtmlString,
      setCookie,
      courseCode,
    ),
  };
  return courseInfo;
}

async function getSectionBilgileri(
  sectionsHtmlString: string,
  setCookie: string,
  courseCode: string,
): Promise<Section[]> {
  const { sectionIds, names } =
    getSectionIdsAndInstructorsFromHtmlString(sectionsHtmlString);
  let res: Section[] = [];
  for (let i = 0; i < sectionIds.length; i++) {
    let sectionId = sectionIds[i];
    let htmlResponse = await fetch(
      'https://oibs2.metu.edu.tr//View_Program_Course_Details_64/main.php',
      {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
          'cache-control': 'max-age=0',
          'content-type': 'application/x-www-form-urlencoded',
          'sec-ch-ua':
            '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'iframe',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          cookie: `_ga=GA1.3.313145970.1639841661; _APP_LOCALE=EN; _gid=GA1.3.1929801388.1646276825; ${setCookie}`,
          Referer:
            'https://oibs2.metu.edu.tr//View_Program_Course_Details_64/main.php',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: `submit_section=${sectionId}&hidden_redir=Course_Info`,
        method: 'POST',
      },
    );
    let html_Text = await htmlResponse.text();
    fs.writeFileSync(`temp/${courseCode}.${sectionId}.html`, html_Text);
    let doc = new DOMParser({
      locator: {},
      errorHandler: {
        warning: function (w) {},
        error: function (e) {},
        fatalError: function (e) {
          console.error(e);
        },
      },
    }).parseFromString(html_Text);

    let criterias: Criteria[] = getCriterias(doc);

    let section: Section = {
      instructor: names[i], //TODO
      sectionNumber: sectionId,
      criteria: criterias,
    };
    res.push(section);
  }

  return res;
}

async function getPrerequisite(
  setCookie: string,
  courseCode: string,
): Promise<Prerequisite[]> {
  let response = await fetch(
    'https://oibs2.metu.edu.tr//View_Program_Course_Details_64/main.php',
    {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'max-age=0',
        'content-type': 'application/x-www-form-urlencoded',
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'iframe',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        cookie: `_ga=GA1.3.313145970.1639841661; _APP_LOCALE=EN; _gid=GA1.3.1929801388.1646276825; ${setCookie}`,
        Referer:
          'https://oibs2.metu.edu.tr//View_Program_Course_Details_64/main.php',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: `SubmitPrerequisite=Prerequisite&text_course_code=${courseCode}&hidden_redir=Course_List`,
      method: 'POST',
    },
  );
  let textHtml = await response.text();
  w(`${courseCode}.p`, textHtml);
  return getPrerequisitesFromString(textHtml);
}

function isGradeGreater(grade: Grade, minGrade: MinGrade): boolean {
  if (grade === minGrade) return true;
  if (grade === 'AA' || grade === 'BA' || grade === 'BB') {
    switch (minGrade) {
      case 'BB':
      case 'CB':
      case 'CC':
      case 'DD':
      case 'FD':
      case 'S':
      case 'U':
        return true;
    }
  }
  if (grade === 'CB') {
    switch (minGrade) {
      case 'BB':
        return false;
      case 'CB':
      case 'CC':
      case 'DD':
      case 'FD':
      case 'S':
      case 'U':
        return true;
    }
  }
  if (grade === 'CC') {
    switch (minGrade) {
      case 'BB':
      case 'CB':
        return false;
      case 'CC':
      case 'DD':
      case 'FD':
      case 'S':
      case 'U':
        return true;
    }
  }
  if (grade === 'DC' || grade === 'DD') {
    switch (minGrade) {
      case 'BB':
      case 'CB':
      case 'CC':
        return false;
      case 'DD':
      case 'FD':
      case 'S':
      case 'U':
        return true;
    }
  }
  if (grade === 'FD') {
    switch (minGrade) {
      case 'BB':
      case 'CB':
      case 'CC':
      case 'DD':
        return false;
      case 'FD':
      case 'S':
      case 'U':
        return true;
    }
  }
  if (grade === 'FF' || grade === 'NA') {
    return false;
  }
  if (grade === 'S') {
    switch (minGrade) {
      case 'BB':
      case 'CB':
      case 'CC':
      case 'DD':
      case 'FD':
      case 'S':
      case 'U':
        return true;
    }
  }
  if (grade === 'U') {
    switch (minGrade) {
      case 'BB':
      case 'CB':
      case 'CC':
      case 'DD':
      case 'FD':
      case 'U':
        return true;
      case 'S':
        return false;
    }
  }
  return false;
}
function getIfGradeOK(
  startGrade: StartEndGrades,
  endGrade: StartEndGrades,
  takenCourse: TakenCourseRequestDto,
) {
  // if(takenCourse===null || takenCourse===undefined) return false;
  if (!isTakenCourseNull() && takenCourse.courseCode === 5710232) {
    console.log('here');
  }

  if (startGrade === 'Herkes alabilir') {
    return true;
  }
  if (startGrade === 'Hic almayanlar alabilir') {
    if (isTakenCourseNull()) return true;
    return false;
  }
  if (startGrade === 'Hic almayanlar veya DD ve alti') {
    if (isTakenCourseNull()) return true;
    if (takenCourse.grade >= 'DD') {
      return true;
    }
    return false;
  }
  if (startGrade === 'Hic almayanlar veya Basarisizlar (FD ve alti)') {
    if (isTakenCourseNull()) return true;
    if (takenCourse.grade >= 'FD') {
      return true;
    }
    return false;
  }
  if (startGrade === 'Hic almayanlar veya BB ve alti') {
    if (isTakenCourseNull()) return true;
    if (takenCourse.grade >= 'BB') {
      return true;
    }
    return false;
  }
  if (startGrade === 'Hic almayanlar veya CC ve alti') {
    if (isTakenCourseNull()) return true;
    if (takenCourse.grade >= 'CC') {
      return true;
    }
    return false;
  }
  if (isTakenCourseNull()) return true;
  if (startGrade.length === 2) {
    if (takenCourse.grade < startGrade && takenCourse.grade > endGrade) {
      return true;
    }
    return false;
  }
  // if(startGrade==='')
  return true;

  function isTakenCourseNull() {
    return takenCourse === null || takenCourse === undefined;
  }
}
