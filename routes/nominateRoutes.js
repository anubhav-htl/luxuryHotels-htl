import express from "express";
const router = express.Router();
import Nominate from "../models/nomination.js";
import { createMulterMiddleware } from "../utils/uploads.js";

const uploadSingle = (folderPath) =>
  createMulterMiddleware(folderPath).single("images");

router.post(
  "/create-nominate",
  uploadSingle("uploads/nominate"),
  async (req, res) => {
    try {
      const {
        nomination_type,
        hotelName,
        hotelWebsite,
        images,
        nominatorName,
        nominatorEmail,
        country,
        desc,
        nominationStartDate,
        nominationEndDate,
        youtube_video_url,
        Subscription,
        leave_message,
        paymaent_status,
        request_to_visit,
        hotel,
      } = req.body;

      const nominate = new Nominate({
        nomination_type,
        hotelName,
        hotelWebsite,
        images,
        nominatorName,
        nominatorEmail,
        country,
        desc,
         images: req.file ? req.file.path : "",
        nominationStartDate,
        nominationEndDate,
        youtube_video_url,
        Subscription,
        leave_message,
        paymaent_status,
        request_to_visit,
        hotel,
      });

      const savedNominate = await nominate.save();

      res.status(201).json({
        status: true,
        message: "nominated successfully",
        response: savedNominate,
      });
    } catch (error) {
      res.status(400).json({
        message: "Failed to create nominate",
        error: error.message,
      });
    }
  }
);
export default router;
