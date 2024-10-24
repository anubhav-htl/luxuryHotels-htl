import express from "express";

import Services from "../models/services.js";
import RoomAmenities from "../models/roomAmenitiesSchema.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await RoomAmenities.find();
    return res.send({
      status: 200,
      content: data,
      message: "successfuly fetched room amenities.",
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
