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
  Prerequisite,
  Section,
} from '@/types/general/Bolum';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import { dirname } from 'path';
import { p,locations, removeNonNumbers } from '@/utils/p';

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

export const getIlkGiris = (req: Request, res: Response)=>{
  const result = {asd:1}
  readFunc();
  res.json(result);
}

export function readFunc() {
  const startChar_1 = '//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[1]/FONT/text()'
  const endChar_1 =   '//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[2]/FONT/text()'
  
  /// ilk satır                                                                                    |   
  //   dept -> console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/text()', doc).toString());

  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[1]/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[2]/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[3]/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[4]/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[5]/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[6]/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[7]/FONT/text()', doc).toString());
  // end grade-> console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[8]/FONT/text()', doc).toString());
  

  // ikinci satir
  // dept-> 
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[1]/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[2]/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[3]/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[4]/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[5]/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[6]/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[7]/FONT/text()', doc).toString());
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[8]/FONT/text()', doc).toString());
  
  // ucuncu satir                                                                        |         ---------   |              
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TR/TD/FONT/text()', doc).toString());
  // virgulle ayrilmis tum satir
  // console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TR/TD/FONT/TD/FONT/text()', doc).toString());

  let str = fs.readFileSync('temp/5720484.1.html').toString();
  let doc = new DOMParser({
    locator: {},
    errorHandler: {
      warning: function (w) { },
      error: function (e) { },
      fatalError: function (e) {
        console.error(e);
      },
    },
  }).parseFromString(str);
  p("#######################################3")
   p("ilk satır")
    p("dept -> ")
    console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/text()', doc).toString());

  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[1]/FONT/text()', doc).toString());//1
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[2]/FONT/text()', doc).toString());
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[3]/FONT/text()', doc).toString());
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[4]/FONT/text()', doc).toString());
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[5]/FONT/text()', doc).toString());
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[6]/FONT/text()', doc).toString());
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[7]/FONT/text()', doc).toString());
  p("end grade-> ")
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TD[8]/FONT/text()', doc).toString());
  p("<<<<////ilk satir>>>>")

  p("<<<ikinci satir>>>")
  p("dept-> ")
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/text()', doc).toString());
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[1]/FONT/text()', doc).toString());//1
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[2]/FONT/text()', doc).toString());
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[3]/FONT/text()', doc).toString());
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[4]/FONT/text()', doc).toString());
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[5]/FONT/text()', doc).toString());
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[6]/FONT/text()', doc).toString());
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[7]/FONT/text()', doc).toString());
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TD[8]/FONT/text()', doc).toString());
  
  p("ucuncu satir                                                                        |         ---------   |              ")
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TR/TD/FONT/text()', doc).toString());
  // virgulle ayrilmis tum satir
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TR/TD/FONT/TD/FONT/text()', doc).toString());
  p("dorduncu satir")
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TR/TD/FONT/TR/TD/FONT/text()', doc).toString());
  p("dorduncu satır - 2 tahmini:")
  p(getCriteriaXpathsOtherThanName(4))
  console.log(xpath.select(getCriteriaXpathsOtherThanName(4), doc).toString());
  console.log("Number Of Criterias:")
  console.log(kacCriteraVar(doc));
  
  p("-------------------")
  p("")

}
export function getNameFromDoc(kacinci: number,document:Document){
  let xpathString = getXpathForCriteriaName(kacinci);
  return xpath.select(xpathString, document).toString();
}
export function getCriteriasOfIth(i:number,document: Document){
  let x =8;
}
export function getXpathForCriteriaName(i: number){
  return '//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/'+'TR/TD/FONT/'.repeat(i)+'text()'
}
export function getCriteriaXpathsOtherThanName(i:number){
return '//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/'+'TR/TD/FONT/'.repeat(i)+'TD[1]/FONT/text()'
}
export function kacCriteraVar(doc:Document): number{
  let res = 0;
  while(true){
    let name = getNameFromDoc(res,doc);
    if(name===undefined || name ===null || name===''){
      break;
    }
    res++;
  }
  return res;
}

export function getCriterias(doc: Document): Criteria[] {
  //DONE
  let criteriasBolumuX = '//*[@id="single_content"]/form/TABLE[3]/TR';
  // /html/body/div/div/div/form/TABLE[6]/TR/TD/FONT/B/TR/TD
  let kacCriteria = xpath.select(criteriasBolumuX, doc).length - 1;
  console.log("Number Of Criterias:")
  console.log(kacCriteraVar(doc));
  throw new Error();
  let res: Criteria[] = [];
  //*[@id="single_content"]/form/table[3]/tbody/tr[2]/td[1]/font

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
