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
    console.log("candy/detail/:category_id success");
    const candy = await Candy.findById(req.params.id); // 카테고리 하나 찾고
    console.log("candy/detail/:category_id success-21");
    if (!candy) { 
      return res.status(404).json({ msg: "category not found" });
    }
    console.log(candy);
    const today = new Date();
    let data = { candy_id: candy['_id'], candy_image_url: candy['candy_image_url'], candy_name: candy['name'], shopping_link: candy['shopping_link'], reward_planned_at: candy['reward_planned_at'], message: candy['message']};
    let d_day = Math.ceil((candy['reward_planned_at'].getTime() - today.getTime())/(1000*3600*24)); //보상 완료일까지 남은 일수. 보상완료일 - 현재날짜 = day로 변환
    let category_id = (await Candy.findById(req.params.id)).category_id;
    let category_name = (await Category.findById(category_id)).name;
   
    const result = await {
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

module.exports = router;