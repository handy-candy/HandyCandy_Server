/**
 * @swagger
 * tags:
 *   name: candies
 *   description: ""
 */

import { Router } from 'express';
import { check } from 'express-validator';
import {
  comingCandy,
  deleteCandy,
  recommendCandy,
  addCandy,
  addDateCandy,
  completedCandy,
  rewardCandy,
  detailCompletedCandies,
  modifyCandy,
  modifyImage,
  getAllCandies,
  addCandyCategory,
  monthlyCompletedCandy,
  monthlyCategoryCompletedCandy,
  yearlyCompletedCandy,
} from '../controllers';
import auth from '../middleware/auth';
const router = Router();

const check_candy = [
  check('category_id', 'CategoryID is required').not().isEmpty(),
  check('candy_name', 'CandyName is required').not().isEmpty(),
];

router.get('/commingCandy', auth, comingCandy);

router.delete('/:candy_id', auth, deleteCandy);

router.get('/recommendCandy', recommendCandy);

router.post('/', auth, addCandy);

/**
 * @swagger
 * /candies/date/{candy_id}:
 *   put:
 *    summary: "완료한캔디: 모든 캔디(전체보기)"
 *    description: "완료한캔디: 모든 캔디(전체보기)"
 *    tags: [candies]
 *    parameters:
 *      - in: path
 *        name: candy_id
 *        required: true
 *        description: 캔디 ObjectId
 *        schema:
 *          type: string
 *      - in: header
 *        name: x-auth-token
 *        required: true
 *        description: User token
 *        schema:
 *          type: string
 *
 *
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              year:
 *                type: integer
 *                description: 보상받을 날짜(년)
 *              month:
 *                type: integer
 *                description: 보상받을 날짜(월)
 *              date:
 *                type: integer
 *                description: 보상받을 날짜(일)
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
 *                  type: string
 *                  example:
 *                    "보상 날짜가 등록되었습니다."
 */
router.put('/date/:candy_id', auth, addDateCandy);

router.get('/completedCandy', auth, completedCandy);

/**
 * @swagger
 * path:
 *  /user:
 *    post:
 *      summary: Create a new user
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.get('/completedCandy/detail/:candy_id', auth, detailCompletedCandies);

//router.put('/:candy_id', auth, modifyCandy);

router.put('/info/:candy_id', auth, modifyCandy);

//router.patch('/image/:candy_id', upload.single('candy_image_url'), auth, modifyImage);

router.get('/all', auth, getAllCandies);

router.put('/category/:candy_id', auth, addCandyCategory);

router.put('/rewardCandy/:candy_id', auth, rewardCandy);

router.get('/monthlyCompletedCandy/all', auth, monthlyCompletedCandy);

router.get('/monthlyCompletedCandy/:category_id', auth, monthlyCategoryCompletedCandy);

router.get('/yearlyCompletedCandy/:year', auth, yearlyCompletedCandy);

module.exports = router;
