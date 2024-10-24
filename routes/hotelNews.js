import express from "express";

import {
  createHotelNews,
  getHotelNews,
  getHotelTravelNews,
  getHotelLatestNews,
  getNewsDetails
} from "../controllers/hotelNews.js";

import { createMulterMiddleware } from "../utils/uploads.js";

const router = express.Router();

export const uploadSingle = (folderPath) =>
  createMulterMiddleware(folderPath).single("news_image");

router.get("/", getHotelNews);
router.get("/get-travel-news", getHotelTravelNews);
router.get("/get-latest-news", getHotelLatestNews);
// router.post("/create-news", createHotelNews);  09-10-2024
router.post("/create-news", uploadSingle("uploads/hotelNews"), createHotelNews); //09-10-2024
router.post("/get-news-details", getNewsDetails); //10-10-2024

export default router;
