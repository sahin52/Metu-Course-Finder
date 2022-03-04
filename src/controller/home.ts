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

 
  let str = fs.readFileSync('temp/5720484.html').toString();
  getSectionIdsAndInstructorsFromHtmlString(str);
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
  p(getCriteriaXpathsOtherThanName(4,doc))

  // console.log(xpath.select(getCriteriaXpathsOtherThanName(4,doc), doc).toString());
  console.log("Number Of Criterias:")
  console.log(kacCriteraVar(doc));
  console.log("getCriterias: ")
  console.log(getCriterias(doc));

  console.log("getNameFromDoc(0,doc)")
  console.log(getGivenDeptFromDoc(0,doc));
  p("getCriteriaXpathsOtherThanName")
  p(getCriteriaXpathsOtherThanName(0,doc))
  p("getXpathForCriteriaName")
  p(getXpathForCriteriaName(0))
  p("getCriteriasOfIthRow")
  p(getCriteriasOfIthRow(0,doc))
  p()
  p()
  p("-------------------")
  p("")

}
export function getGivenDeptFromDoc(kacinci: number,document:Document){ //DONE
  let xpathString = getXpathForCriteriaName(kacinci);
  return xpath.select(xpathString, document).toString().replace(/[^A-Z]/g,"");
}

export function getCriteriasOfIthRow(kacinci:number,doc: Document){ //DONE
  let res: string[] = []
  let xpaths = getCriteriaXpathsOtherThanName(kacinci,doc)
  for (let i = 0; i < xpaths.length; i++) {
    const path = xpaths[i];
    res.push(xpath.select(path,doc).toString());
  }
  return res;
  
}
export function getXpathForCriteriaName(i: number){//DONE
  return '//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/'+'TR/TD/FONT/'.repeat(i)+'text()'
}
export function getCriteriaXpathsOtherThanName(i:number,doc:Document){//DONE test
  let res: string[] =[]
  for (let j = 1; j <= 8; j++) {
    res.push('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/'+'TR/TD/FONT/'.repeat(i)+`TD[${j}]/FONT/text()`)
  }
  return res;
}
export function kacCriteraVar(doc:Document): number{//DONE
  let res = 0;
  while(true){
    let name = getGivenDeptFromDoc(res,doc);
    if(name===undefined || name ===null || name===''){
      break;
    }
    res++;
  }
  return res;
}

export function getCriterias(doc: Document): Criteria[] {//DONE
  let numberOfCriterias = kacCriteraVar(doc);
  let res:Criteria[]= [];
  for (let i = 0; i < numberOfCriterias; i++) {
    let dept = getGivenDeptFromDoc(i,doc);
    let crits =  getCriteriasOfIthRow(i,doc);
    let criteria: Criteria = {
      givenDept: dept,
      startChar: crits[0],
      endChar: crits[1],
      minCumGpa: parseFloat(crits[2]),
      maxCumGpa: parseFloat(crits[3]),
      minYear: parseInt(crits[4]),
      maxYear: parseInt(crits[5]),
      startGrade: crits[6],
      endGrade: crits[7]
    };
    res.push(criteria);
  }

  return res;
}
export function getSectionIdsAndInstructorsFromHtmlString(sectionsHtmlString: string) {
  let submitSectionTextLocations = locations("submit_section", sectionsHtmlString);
  const sectionLen = submitSectionTextLocations.length;
  const sectionIdsStrings = submitSectionTextLocations.map(location => sectionsHtmlString.substring(location - 15, location - 5));
  console.log(sectionIdsStrings);
  const sectionIds = sectionIdsStrings.map(str => parseInt(removeNonNumbers(str)));
  console.log('sectionLen', sectionLen);
  let instrunctorNameStartLoc = submitSectionTextLocations.map(location=>sectionsHtmlString.slice(location).indexOf("FACE=ARIAL")+11+location)
  let nameEnd = instrunctorNameStartLoc.map(location=>sectionsHtmlString.slice(location).indexOf("</FONT>")+location)
  let names = nameEnd.map((location,i)=>sectionsHtmlString.substring(instrunctorNameStartLoc[i],location))
  return {sectionIds,names};
}


export function getPrerequisitesFromString(textHtml:string){
  
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
