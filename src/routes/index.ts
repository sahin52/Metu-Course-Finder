import * as homeController from '@/controller/home';

import fetch from 'cross-fetch';
import fs, { cp, write } from 'fs';
import { Router } from 'express';
import {
  Bolum,
  CourseInfo,
  Ders,
  Main,
  Prerequisite,
  Section,
} from '@/types/general/Bolum';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import { dirname } from 'path';
import { p } from '@/utils/p';

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
    let deptHtmlRes = await (
      await fetch(
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
              '_ga=GA1.3.313145970.1639841661; _APP_LOCALE=EN; phpSess_e7f8a2b66340bd43b00edc2a215826d5=SIKVNGfSF1YCYxbBcxjeoL3VKhms7WsruFiSUOa1pVGrExcpuldfpSftcC5bvSR7aaw8k7p7vhoysf7a8kjJY4uAthEqMQiQfOfHgv23dWjIA4b5Kscro4zIViG9qvaM',
            Referer:
              'https://oibs2.metu.edu.tr//View_Program_Course_Details_64/main.php',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
          body: `textWithoutThesis=1&select_dept=${deptNum}&select_semester=20212&submit_CourseList=Submit&hidden_redir=Login`,
          method: 'POST',
        },
      )
    ).text();
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
        dersler: await getDersler(doc, totalCourses, deptNum),
        name: name,
        code: deptNum,
        totalCourses: totalCourses,
        isKibris: name.includes('Kuzey K'),
      };

      //
      main.bolumler.push(bolum);
    }
    if (main.bolumler.length % 10 == 0) {
      writeResult(main);
    }
    w(deptNum, deptHtmlRes);

    if (i > 11) break; // DEBUG
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
): Promise<Ders[]> {
  let res: Ders[] = [];
  for (let i = 0; i < totalCourses; i++) {
    let courseInfo = await getCourseInfo(i, derslerDoc);
    let prerequisite = await getPrerequisite(i, derslerDoc);
    let ders: Ders = {
      courseInfo: courseInfo,
      prerequisite: prerequisite,
    };
    res.push(ders);
  }
  return [];
}

async function getCourseInfo(
  i: number,
  derslerDoc: Document,
): Promise<CourseInfo> {
  let courseCodeXpath = `//*[@id="single_content"]/form/TABLE[4]/TR[${
    i + 2
  }]/TD[2]/FONT/text()`;
  let courseCode = xpath.select(courseCodeXpath, derslerDoc).toString();

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
        cookie:
          '_ga=GA1.3.313145970.1639841661; _APP_LOCALE=EN; phpSess_e7f8a2b66340bd43b00edc2a215826d5=Me2CWS88sguBhTLhgZmeBw69YjIp9oHpmUTw5zBNk87W8eAGEvbeBfUwzEYJxhUHrtgm6AdBn7P7JXRrl2ylTbmuM7TJqSBP11wOO6W1V5qkApNWvsYNBcqVDho6jg42',
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
  let sectionsHtml = await courseInfoFetch.text();
  fs.writeFileSync(`temp/${courseCode}.html`, sectionsHtml);
  let senctionsDoc = new DOMParser({
    locator: {},
    errorHandler: {
      warning: function (w) {},
      error: function (e) {},
      fatalError: function (e) {
        console.error(e);
      },
    },
  }).parseFromString(sectionsHtml);

  let ilkSectionIcin =
    'string(//*[@id="single_content"]/form/TABLE[3]/TR[3]/TD[1]/FONT/INPUT/@VALUE)';
  let r = xpath.select(ilkSectionIcin, senctionsDoc).toString();
  let ikiChrome =
    '//*[@id="single_content"]/form/table[3]/tbody/tr[5]/td[1]/font/input';
  let ikiReel =
    'string(//*[@id="single_content"]/form/TABLE[3]/TR[5]/TD[1]/FONT/INPUT/@VALUE)';
  p('r->', r);
  let courseInfo: CourseInfo = {
    department: '',
    courseCode: 0,
    courseName: '',
    credit: '',
    sectionlar: await getSectionBilgileri(),
  };
  return courseInfo;
}

async function getSectionBilgileri(): Promise<Section[]> {
  fetch('https://oibs2.metu.edu.tr//View_Program_Course_Details_64/main.php', {
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
        '_ga=GA1.3.313145970.1639841661; _APP_LOCALE=EN; phpSess_e7f8a2b66340bd43b00edc2a215826d5=Gq3P9i2Faf1TwCtYyKx8VJZ18s09xP9tuCOmrE1MMpM0MeX0aBGAW76332w9rd0gci9JMOB0W8ZaeBiQrcd2qLam1r2Vnpi49NfM8NzswtCnVJDouW3QVV4URVKsDKZF',
      Referer:
        'https://oibs2.metu.edu.tr//View_Program_Course_Details_64/main.php',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: 'submit_section=1&hidden_redir=Course_Info',
    method: 'POST',
  });
  throw new Error();
}

function getPrerequisite(
  i: number,
  derslerDoc: Document,
): Promise<Prerequisite[]> {
  throw new Error('Function not implemented.');
}
