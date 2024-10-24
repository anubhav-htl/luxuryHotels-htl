import express from "express";

import {getCountryVideos,addCountryVideos} from '../controllers/countryVideos.js'

const router = express.Router();

router.get("/", getCountryVideos);
router.post("/add-country-videos", addCountryVideos);

export default router;
