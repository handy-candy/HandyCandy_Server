import express, { Request, Response } from "express";
import auth from "../middleware/auth";

const router = express.Router();
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

import Category from '../models/Category';
import Candy from "../models/Candy";
import { check, validationResult } from "express-validator";


/**
 *  @route GET api/category
 *  @desc Get all category
 *  @access Private
 */
 router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const category_array = await Category.find();
    console.log(category_array);
    let result_array = [];
    if(category_array){ 
      for( const category of category_array){
        let data = { category_id: category['_id'], name: category['name'], category_image_url: category['category_image_url'] };
        const candy_array = await Candy.find({ category_id: category['_id'] }).sort({date: -1}); 
        let category_candy_count = candy_array.length;
        if(candy_array[0]){
          let candy_created_at = candy_array[0].created_at;
          let image_url_one = candy_array[0].candy_image_url;
          let image_url_two = '';
          let image_url_three = '';
          if(candy_array[1]){
            image_url_two = candy_array[1].candy_image_url;
          }
          if(candy_array[2]){
            image_url_three = candy_array[2].candy_image_url;
          }
        
          let today = new Date();
          let recent_update_date = Math.ceil((today.getTime() - candy_created_at.getTime())/(1000*3600*24));
          data['category_candy_count'] = category_candy_count;
          data['recent_update_date'] = recent_update_date;
          data['image_url_one'] = image_url_one;
          data['image_url_two'] = image_url_two;
          data['image_url_three'] = image_url_three;
          result_array.push(data);
        }
        else{
          data['category_candy_count'] = "0";
          data['recent_update_date'] = "0";
          data['image_url'] = "";
          result_array.push(data);
        }
      }
      console.log(result_array);
      res.json({
        status: 200,
        success: true,
        result: result_array,
      });
    }
    else {
      return res.json({
        msg: "Error : 404 Not Found"
      });
    }  
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;