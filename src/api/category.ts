import { Router } from 'express';
import { check } from 'express-validator';
import {
  allCategory,
  deleteCategory,
  addCategory,
  modifyCategory,
  detailCategory,
  completedDetailCategory,
} from '../controllers/category';
import auth from '../middleware/auth';
const router = Router();
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

const check_category = [
  check('name', 'Category name is required').not().isEmpty(),
  check('category_image_url', 'category emoji is required').not().isEmpty(),
];

/**
 * @swagger
 * /category:
 *   get:
 *    summary: "담은 캔디 : 전체보기"
 *    description: "담은 캔디 : 전체보기"
 *    tags: [category]
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        description: User token
 *        schema:
 *          type: string
 *
 *
 *    responses:
 *      "200":
 *        description: 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 200
 *                data:
 *                  type: boolean
 *                result:
 *                  type: array
 *                  description: 사용자의 모든 카테고리 리스트
 *                  items:
 *                    type: object
 *                    properties:
 *                      category_id:
 *                        type: string
 *                        example: "60e2fe377056fe1264f76eed"
 *                      name:
 *                        type: string
 *                        example: "바쁜 일상 후를 위한"
 *                      category_image_url:
 *                        type: string
 *                        example: "이미지 "
 *                      category_candy_count:
 *                        type: integer
 *                        example: 8
 *                      recent_update_date:
 *                        type: integer
 *                        example: 10
 *                      image_url_one:
 *                        type: string
 *                        example: "image"
 *                      image_url_two:
 *                        type: string
 *                        example: ""
 *                      image_url_three:
 *                        type: string
 *                        example: ""
 */
router.get('/', auth, allCategory);

router.delete('/:id', auth, deleteCategory);

router.post('/', auth, check_category, addCategory);

router.put('/:id', auth, modifyCategory);

/**
 * @swagger
 * /category/detail/{id}:
 *   get:
 *    summary: "담은 캔디 : 카테고리별로 보기"
 *    description: "담은 캔디 : 카테고리별로 보기"
 *    tags: [category]
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        description: User token
 *        schema:
 *          type: string
 *      - in: path
 *        name: category_id
 *        required: true
 *        description: 카테고리 ObjectID
 *        schema:
 *          type: string
 *
 *
 *    responses:
 *      "200":
 *        description: 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 200
 *                data:
 *                  type: boolean
 *                result:
 *                  type: object
 *                  properties:
 *                    banner:
 *                      type: string
 *                      example: https://mint.png
 *                    all_candy_count:
 *                      type: integer
 *                      example: 25
 *                    coming_candy_count:
 *                      type: integer
 *                      example: 14
 *                    waiting_candy_count:
 *                      type: integer
 *                      example: 11
 *                    coming_candy:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          candy_id:
 *                            type: string
 *                            description: 캔디 아이디
 *                          candy_image_url:
 *                            type: string
 *                            description: 캔디 사진
 *                          candy_name:
 *                            type: string
 *                            description: 캔디 이름
 *                          category_name:
 *                            type: string
 *                            description: 카테고리 이름
 *                          reward_planned_at:
 *                            type: date
 *                            description: 보상 날짜 ("yyyy-mm-dd")
 *                            example: 2021-07-17T00:00:00.000Z
 *                          d_day:
 *                            type: integer
 *                            description: 디데이 (보상완료일까지 남은 일수)
 *                    waiting_candy:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          candy_id:
 *                            type: string
 *                          candy_image_url:
 *                            type: string
 *                          candy_name:
 *                            type: string
 *                          category_name:
 *                            type: string
 *                          waiting_date:
 *                            type: integer
 *
 */

router.get('/detail/:id', auth, detailCategory);

router.get('/completed/detail/:id', auth, completedDetailCategory);

module.exports = router;
