import express from "express";
import {
  getAllHotels,
  getAllNominatedHotels,
  getHotel,
  hello,
  getAllCountries,
  getAllHotelsByCountry,
  submitGuestReview,
  getHotelReviews,
  getAllExclusiveOffers,
} from "../controllers/hotelsAPI.js";
import reviewsValidator from "../validators/reviewsValidator.js";
import { createMulterMiddleware } from "../utils/uploads.js";
const router = express.Router();

const uploadSingle = (folderPath) =>
  createMulterMiddleware(folderPath).single("reviewer_image");

router.get("/", hello);

router.get("/hotel/:hotelId", getHotel);

router.get("/allHotels", getAllHotels);

router.get("/nominatedHotels", getAllNominatedHotels);

router.get("/exclusiveOffers", getAllExclusiveOffers);

router.get("/allCountries", getAllCountries);

router.get("/hotels-by-country/:countryId", getAllHotelsByCountry);

// router.post("/guest-reviews", reviewsValidator, submitGuestReview); //23-10-2024
router.post("/guest-reviews", uploadSingle("uploads/reviewer-images") , submitGuestReview);

router.get("/reviews/:hotelId", getHotelReviews);

export default router;
