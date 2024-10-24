import express from "express";
import HotelFacilitiesSchema from "../models/hotelFacilitiesSchema.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await HotelFacilitiesSchema.find();
    return res.send({
      status: 200,
      content: data,
      message: "successfuly fetched room hotel facilities.",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "internal server error",
      error: error.message,
    });
  }
});

export default router;
