import * as homeController from '@/controller/home';

import fetch from 'cross-fetch';
import fs, { write } from 'fs';
import { Router } from 'express';
import { Bolum, Main } from '@/types/general/Bolum';
import xpath from 'xpath'
import {DOMParser } from 'xmldom'
import {dirname} from 'path'

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
    console.log("deptNum");
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
      deptHtmlRes.includes('Information about the department could not be found.')
    ) {
      let bolum: Bolum = {
        isInfoFound: false,
        dersler: [],
        name: '',
        code: deptNum,
        isKibris: false,
      };
      main.bolumler.push(bolum);
      if (main.bolumler.length % 10 == 0) {
        writeResult(main);
      }
      continue;
    }
    //else
    else{
        let doc = new DOMParser({
            locator: {},
            errorHandler: { warning: function (w) { }, 
            error: function (e) { }, 
            fatalError: function (e) { console.error(e) } }
        }).parseFromString(deptHtmlRes);

        let totalCourses = xpath.select('//*[@id="single_content"]/form/TABLE[4]/TR', doc).length-1;
        let name = xpath.select('//*[@id="single_content"]/form/TABLE[1]/TR/TD[1]/FONT/text()',doc).toString();
        console.log(totalCourses);
        let bolum: Bolum = {
            isInfoFound: true,
            dersler: [],
            name: name,
            code: deptNum,
            isKibris: name.includes("Kuzey K"),
          };
        
        let courseCode = xpath.select('//*[@id="single_content"]/form/TABLE[4]/TR[2]/TD[2]/FONT/text()', doc).toString();
        

        if (main.bolumler.length % 10 == 0) {
            writeResult(main);
          }
    }
    w(deptNum,deptHtmlRes);

    if(i>11) break;
  }
  writeResult(main)
  //   let i = await fetch("https://oibs2.metu.edu.tr//View_Program_Course_Details_64/main.php", {
  //     "headers": {
  //       "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  //       "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
  //       "cache-control": "max-age=0",
  //       "content-type": "application/x-www-form-urlencoded",
  //       "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
  //       "sec-ch-ua-mobile": "?0",
  //       "sec-ch-ua-platform": "\"Windows\"",
  //       "sec-fetch-dest": "iframe",
  //       "sec-fetch-mode": "navigate",
  //       "sec-fetch-site": "same-origin",
  //       "sec-fetch-user": "?1",
  //       "upgrade-insecure-requests": "1",
  //       "cookie": "_ga=GA1.3.313145970.1639841661; _APP_LOCALE=EN; phpSess_e7f8a2b66340bd43b00edc2a215826d5=SIKVNGfSF1YCYxbBcxjeoL3VKhms7WsruFiSUOa1pVGrExcpuldfpSftcC5bvSR7aaw8k7p7vhoysf7a8kjJY4uAthEqMQiQfOfHgv23dWjIA4b5Kscro4zIViG9qvaM",
  //       "Referer": "https://oibs2.metu.edu.tr//View_Program_Course_Details_64/main.php",
  //       "Referrer-Policy": "strict-origin-when-cross-origin"
  //     },
  //     "body": "textWithoutThesis=1&select_dept=836&select_semester=20212&submit_CourseList=Submit&hidden_redir=Login",
  //     "method": "POST"
  //   });
  //   console.log("here");
  //   let text = await i.text();
  //   fs.writeFileSync(`req-results/temp2.txt`,text)
  //   console.log();
  //   console.log("her2e");
  res.json(result);
});
export default router;
function writeResult(main: Main) {
  let filename = `results_${new Date().toJSON().replace(/:/g, "-")}.json`;
  fs.writeFileSync(
    `real-req-results/${filename}`,
    JSON.stringify(main, null, 4),
  );
}
function w(deptnum: number,text: any){
    let dir='temp'
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(`temp/${deptnum}.html`,text);
}