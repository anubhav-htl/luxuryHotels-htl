import express from "express";
import ExclusiveOffer from "../models/exclusiveoffer.js";
import {
  createExclusiveOffer,
  getAllExclusiveOffers,
  editExclusiveOffer,
  getOfferByHotelID,
} from "../controllers/exclusiveoffers.js";
import { createMulterMiddleware } from "../utils/uploads.js";

export const uploadSingle = (folderPath) =>
  createMulterMiddleware(folderPath).single("offer_image");

const router = express.Router();

router.get("/", getAllExclusiveOffers);

router.get("/add", (req, res) => {
  res.render("exclusiveoffers/addexclusiveoffer");
});

router.post("/edit/:id", editExclusiveOffer);

router.get("/edit/:offer_id", async (req, res) => {
  const { offer_id } = req.params;

  try {
    const offerData = await ExclusiveOffer.findById(offer_id);
    res.render("exclusiveoffers/editexclusiveoffers", { offerData });
  } catch (error) {
    console.error(error);
  }
});

// router.post('/', createExclusiveOffer);
router.post(
  "/create-offer",
  uploadSingle("uploads/offer-images"),
  createExclusiveOffer
);

router.get("/offer/:hotel_id", getOfferByHotelID);
export default router;
