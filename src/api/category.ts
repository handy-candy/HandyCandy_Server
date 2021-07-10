import express, { Request, Response } from "express";

const router = express.Router();
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

import Category from '../models/Category';
import Candy from '../models/Candy';
import { check, validationResult } from "express-validator";


/**
 *  @route GET api/category
 *  @desc Get all category
 *  @access Private
 */
 router.get("/", async (req: Request, res: Response) => {
  try {
    const categoryArray = await Category.find();
    console.log(categoryArray);
    let resultArray = [];
    if(categoryArray){ // 카테고리가 존재하는 경우에만 실행
      for( const category of categoryArray){
        let data = { category_id: category['_id'], name: category['name'], category_image_url: category['category_image_url'] };
        const candyArray = await Candy.find({ category_id: category['_id'] }); // Candy들 중에 category_id가 일치하는 캔디들만 배열로 만들어 리턴
        let category_candy_count = candyArray.length;
        let candy_created_at = candyArray[0].created_at;
        let now_date = new Date(); // 현재 날짜
        let recent_update_date = Math.ceil((now_date.getTime() - candy_created_at.getTime())/(1000*3600*24));

        data['category_candy_count'] = category_candy_count;
        data['recent_update_date'] = recent_update_date;
        resultArray.push(data);
      }
      console.log(resultArray);
      res.json({
        status: 200,
        success: true,
        result: resultArray,
      });
    }
    else {
      return res.json("Error : 404 Not Found"); // 카테고리가 존재하지 않을 때
    }  
  } catch (error) {
    res.status(500).send("Server Error");
  }
});


module.exports = router;