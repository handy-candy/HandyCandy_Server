import express, { Request, Response } from "express";
import auth from "../middleware/auth";

const router = express.Router();
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

import Category from '../models/Category';
import Candy from "../models/Candy";

/**
 *  @route GET api/category/detail/:id
 *  @desc GET one candy detail
 *  @access Private
 */
 router.get("/detail/:id", auth, async (req: Request, res: Response) => {
  try {
    const candy = await Candy.findById(req.params.id); // 카테고리 하나 찾고
    if (!candy) { 
      return res.status(404).json({ msg: "category not found" });
    }
    const today = new Date();
    let data = { candy_id: candy['_id'], candy_image_url: candy['candy_image_url'], candy_name: candy['name'], shopping_link: candy['shopping_link'], reward_planned_at: candy['reward_planned_at'], message: candy['message']};
    let d_day = Math.ceil((candy['reward_planned_at'].getTime() - today.getTime())/(1000*3600*24)); //보상 완료일까지 남은 일수. 보상완료일 - 현재날짜 = day로 변환
    let category_id = (await Candy.findById(req.params.id)).category_id;
    let category_name = (await Category.findById(category_id)).name;
    let category_image_url = (await Category.findById(category_id)).category_image_url;
    let banner = get_banner_image_url(category_image_url);
    
    const result = await {
      banner: banner,
      candy_information: data,
      category_name : category_name, 
      d_day: d_day
    };
    res.json({
      status: 200,
      success: true,
      result: result,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

let get_banner_image_url = function(var1){ 
  if(var1 == "Ball" ){
    return "https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/bboddo.png";
  }
  else if(var1 == "Clover"){
    return "https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/flower.png";
  }
  else if(var1 == "Donut"){
    return "https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/donut.png";
  }
  else if(var1 == "Double"){
    return "https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/dd.png";
  }
  else if(var1 == "Flower"){
    return "https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/orange.png";
  }
  else if(var1 == "Fork"){
    return "https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/3d.png";
  }
  else if(var1 == "Leaf"){
    return "https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/leaf.png";
  }
  else if(var1 == "Magnet"){
    return "https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/u.png";
  }
  else if(var1 == "WaterDrop"){
    return "https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/mint.png";
  }
  else if(var1 == "X"){
    return "https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/blue.png";
  }
  else{
    return "";
  }
}

module.exports = router;