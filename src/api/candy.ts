import express, { Request, Response } from "express";
import auth from "../middleware/auth";
import { candyDetail } from "../controllers/candy";
const router = express.Router();
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');



 router.get("/detail/:id", auth, candyDetail);


module.exports = router;