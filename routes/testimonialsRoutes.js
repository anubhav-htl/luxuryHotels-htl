import express from "express";
import { createMulterMiddleware } from "../utils/uploads.js";
import TestimonialsSchema from "../models/testimonialsSchema.js";
const router = express.Router();

export const uploadSingle = (folderPath) =>
  createMulterMiddleware(folderPath).single("hotel_logo");

router.get("/", async (req, res) => {
  try {
    const data = await TestimonialsSchema.find();
    return res.send({
      status: 200,
      content: data,
      message: "successfuly fetched testimonials",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "internal server error",
      error: error.message,
    });
  }
});

router.post(
  "/create-testimonials",
  uploadSingle("uploads/testimonials"),
  async (req, res) => {
    try {
      const { name, desc, rating, hotel_id } = req.body;

      const testimonials = new TestimonialsSchema({
        hotel_logo: req.file.path,
        name,
        desc,
        rating,
        hotel_id,
      });

      const savedTestimonials = await testimonials.save();

      res.status(201).json({
        message: "testimonials created successfully",
        data: savedTestimonials,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Failed to create testimonials",
        error: error.message,
      });
    }
  }
);


export default router;