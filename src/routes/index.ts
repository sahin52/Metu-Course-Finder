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

const router = Router();

router.get('/', homeController.getAppInfo);
router.get('/temp', async (req, res) => {
  const result = { deneme: 123 };
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
    let setCookiFromHeader = headers.get('Set-Cookie');
    let setCooki = setCookiFromHeader!.slice(0, setCookiFromHeader!.length - 8);
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
    //else
    else {
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
    }
    if (main.bolumler.length % 2 == 0) {
      writeResult(main);
    }
    w(deptNum, deptHtmlRes);

    if (i > 1) break; // DEBUG
  }
  writeResult(main);

  res.json(result);
});
export default router;
function writeResult(main: Main) {
  let filename = `results_${new Date().toJSON().replace(/:/g, '-')}.json`;
  fs.writeFileSync(
    `real-req-results/${filename}`,
    JSON.stringify(main, null, 4),
  );
}
function w(deptnum: number, text: any) {
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
      derslerDoc,
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
  console.log("ewkk")
  console.log( xpath.select('//*[@id="single_content"]/form/TABLE[1]/TR[1]/TD[1]',sectionsDoc).toString())
  console.log( xpath.select('//*[@id="single_content"]/form/TABLE[1]/TR[1]',sectionsDoc).toString())
  console.log( xpath.select('//*[@id="single_content"]/form/TABLE[1]',sectionsDoc).toString())
  console.log( xpath.select('//*[@id="single_content"]/form/TABLE[2]',sectionsDoc).toString())
  console.log( xpath.select('//*[@id="single_content"]/form/TABLE[1]/TR[1]/TD[1]/FONT[1]/text()',sectionsDoc).toString())
  p("done");
  let courseInfo: CourseInfo = {
    department: xpath.select('//*[@id="single_content"]/form/TABLE[1]/TR[1]/TD[1]/FONT[1]/text()',sectionsDoc).toString(),
    courseCode: parseInt(xpath.select('//*[@id="single_content"]/form/TABLE[1]/TR[2]/TD[1]/FONT/text()',sectionsDoc).toString()), 
    courseName: xpath.select('//*[@id="single_content"]/form/TABLE[1]/TR[2]/TD[2]/FONT/text()',sectionsDoc).toString(),
    credit: xpath.select('//*[@id="single_content"]/form/TABLE[1]/TR[3]/TD[1]/FONT/text()',sectionsDoc).toString(),
    sectionlar: await getSectionBilgileri(sectionsHtmlString, setCookie,courseCode),
  };
  return courseInfo;
}

async function getSectionBilgileri(
  sectionsHtmlString: string,
  setCookie: string,
  courseCode: string
): Promise<Section[]> {
  let submitSectionTextLocations = locations("submit_section",sectionsHtmlString)
  const sectionLen = submitSectionTextLocations.length;
  const sectionIdsStrings = submitSectionTextLocations.map(location => sectionsHtmlString.substring(location-15,location-5));
  console.log(sectionIdsStrings);
  const sectionIds = sectionIdsStrings.map(str=>parseInt(removeNonNumbers(str)));
  console.log('sectionLen', sectionLen);
  let res: Section[] = [];
  for (let i = 0; i < sectionLen; i++) {
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
    let html_Text = await htmlResponse.text()
    fs.writeFileSync(`temp/${courseCode}.${sectionId}.html`,html_Text)
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
      instructor: '', //TODO
      sectionNumber: sectionId, //TODO
      criteria: criterias,
    };
    res.push(section);
  }

  return res;
}

async function getPrerequisite(
  derslerDoc: Document,
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
        cookie:
          '_ga=GA1.3.313145970.1639841661; _APP_LOCALE=EN; _gid=GA1.3.1929801388.1646276825; phpSess_e7f8a2b66340bd43b00edc2a215826d5=Q8av7kEJYNJlpXlfhdwMWRIBR3XN2Tt5yBYuc89ZZ6yLTmSW74Gy5aozMO9yBWDgiraAThfED6KCyZyt7jyfMuBAqyBHWoXm2w4goIV0bI7vUs8gNbr41biLRWKczyWp',
        Referer:
          'https://oibs2.metu.edu.tr//View_Program_Course_Details_64/main.php',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: `SubmitPrerequisite=Prerequisite&text_course_code=${courseCode}&hidden_redir=Course_List`,
      method: 'POST',
    },
  );
  let textHtml = await response.text();
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
      MinGrade: xpath.select(minGradeX, doc).toString(),
      Type: xpath.select(typeX, doc).toString(),
      Position: xpath.select(positionX, doc).toString(),
    };
    res.push(prerequisite);
  }
  return res;
}
function getCriterias(doc: Document): Criteria[] {
  //DONE
  let criteriasBolumuX = '//*[@id="single_content"]/form/TABLE[3]/TR';
  let kacCriteria = xpath.select(criteriasBolumuX, doc).length - 1;
  let res: Criteria[] = [];
  for (let i = 0; i < kacCriteria; i++) {
    let givenDeptX = `//*[@id="single_content"]/form/TABLE[3]/TR[${
      i + 2
    }]/TD[1]/FONT/text()`;
    let startCharX = `//*[@id="single_content"]/form/TABLE[3]/TR[${
      i + 2
    }]/TD[2]/FONT/text()`;
    let endCharX = `//*[@id="single_content"]/form/TABLE[3]/TR[${
      i + 2
    }]/TD[3]/FONT/text()`;
    let minCumGpaX = `//*[@id="single_content"]/form/TABLE[3]/TR[${
      i + 2
    }]/TD[4]/FONT/text()`;
    let maxCumGpaX = `//*[@id="single_content"]/form/TABLE[3]/TR[${
      i + 2
    }]/TD[5]/FONT/text()`;
    let minYearX = `//*[@id="single_content"]/form/TABLE[3]/TR[${
      i + 2
    }]/TD[6]/FONT/text()`;
    let maxYearX = `//*[@id="single_content"]/form/TABLE[3]/TR[${
      i + 2
    }]/TD[7]/FONT/text()`;
    let startGradeX = `//*[@id="single_content"]/form/TABLE[3]/TR[${
      i + 2
    }]/TD[8]/FONT/text()`;
    let endGradeX = `//*[@id="single_content"]/form/TABLE[3]/TR[${
      i + 2
    }]/TD[9]/FONT/text()`;

    let criteria: Criteria = {
      givenDept: xpath.select(givenDeptX, doc).toString(),
      startChar: xpath.select(startCharX, doc).toString(),
      endChar: xpath.select(endCharX, doc).toString(),
      minCumGpa: parseFloat(xpath.select(minCumGpaX, doc).toString()),
      maxCumGpa: parseFloat(xpath.select(maxCumGpaX, doc).toString()),
      minYear: parseInt(xpath.select(minYearX, doc).toString()),
      maxYear: parseInt(xpath.select(maxYearX, doc).toString()),
      startGrade: xpath.select(startGradeX, doc).toString(),
      endGrade: xpath.select(endGradeX, doc).toString(),
    };
    res.push(criteria);
  }
  return res;
}
