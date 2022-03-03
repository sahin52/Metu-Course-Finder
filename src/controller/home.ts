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

  let str = fs.readFileSync('temp/5720172.1.xml').toString();
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
  console.log(xpath.select('//*[@id="single_content"]/form/TABLE[3]/TR/TD/FONT/B/TR/TD/FONT/TR/TD/FONT/TR/TD/FONT/TR/TD/FONT/TD/FONT/text()', doc).toString());

  p("-------------------")
  p("")

}
