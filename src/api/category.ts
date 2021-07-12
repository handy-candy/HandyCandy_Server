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

/**
 *  @route Delete api/category/:id
 *  @desc Delete category and candies
 *  @access Private
 */
 router.delete("/:id", auth, async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) { 
      return res.status(404).json({ msg: "category not found" });
    }
    const candy_array = await Candy.find({ category_id: req.params.id });
    if(candy_array){ 
      for(const candy of candy_array){
        candy.remove(); 
      }
    }
    await category.remove();

    res.json({
      status: 200,
      success: true,
      result: "Category removed successfully.",
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

/**
 *  @route POST api/category/
 *  @desc Create a category
 *  @access Private
 */
 router.post(
  "/",
  [
    check("name", "Category name is required").not().isEmpty(),
    check("category_image_url", "category emoji is required").not().isEmpty()
  ],
  auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, category_image_url } = req.body;
    try {
      const new_category = new Category({
        name: name,
        category_image_url: category_image_url
      });
      const category = await new_category.save();
      res.json({
        status: 200,
        success: true,
        result: category,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 *  @route PUT api/category/
 *  @desc Modification a category information
 *  @access Private
 */
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { name, category_image_url } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    category['name'] = name;
    category['category_image_url'] = category_image_url;
    await category.save(); 
    res.json({
      status: 200,
      success: true,
      result: category,
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

/**
 *  @route GET api/category/detail/:id
 *  @desc GET one category detail
 *  @access Private
 */
 router.get("/detail/:id", auth, async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id); // 카테고리 하나 찾고
    if (!category) { 
      return res.status(404).json({ msg: "category not found" });
    }
    const today = new Date();
    const candy_array = await Candy.find({ category_id: category['_id'] }).sort({ date:-1 });
    const coming_candy_array = await Candy.find({
      user_id: req.body.user.id,
      reward_planned_at: { $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
      reward_completed_at: { $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
    });
    const waiting_candy_array = await Candy.find({
      user_id: req.body.user.id,
      reward_planned_at: { $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
      reward_completed_at: { $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
    });
    let result_coming_candy_array = [];
    let result_waiting_candy_array = [];
    for(const candy of coming_candy_array){
      let data = { candy_id: candy['_id'], candy_image_url: candy['candy_image_url'], candy_name: candy['name'], category_name: category['name'], reward_planned_at: candy['reward_planned_at']};
      let today = new Date(); // 현재 날짜
      let d_day = Math.ceil((candy['reward_planned_at'].getTime() - today.getTime())/(1000*3600*24)); //보상 완료일까지 남은 일수. 보상완료일 - 현재날짜 = day로 변환
      data['d_day'] = d_day;
      result_coming_candy_array.push(data);
    }
    for(const candy of waiting_candy_array){
      let data = { candy_id: candy['_id'], candy_image_url: candy['_id'],candy_name: candy['name'], category_name: category['name']};
      let today = new Date(); // 현재 날짜
      let waiting_date = Math.ceil((today.getTime() - candy['created_at'].getTime())/(1000*3600*24));

      data['waiting_date'] = waiting_date;
      result_waiting_candy_array.push(data);
    }
    let coming_candy_count = coming_candy_array.length;
    let waiting_candy_count = waiting_candy_array.length;
    console.log("result_coming_candy_array : ");
    console.log(result_coming_candy_array);
    console.log("result_waiting_candy_array : ");
    console.log(result_waiting_candy_array);
    const result = await {
      all_candy_count: coming_candy_count + waiting_candy_count,
      coming_candy_count: coming_candy_count,
      waiting_candy_count: waiting_candy_count,
      coming_candy : result_coming_candy_array,
      waiting_candy: result_waiting_candy_array,
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

