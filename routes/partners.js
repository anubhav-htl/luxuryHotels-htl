import express from "express";
import { createMulterMiddleware } from "../utils/uploads.js";
import Partners from "../models/partners.js";

const router = express.Router();

export const uploadSingle = (folderPath) =>
  createMulterMiddleware(folderPath).single("partners_image");

router.get("/", async (req, res) => {
  try {
    const data = await Partners.find();
    return res.send({
      status: 200,
      content: data,
      message: "successfuly fetched partners",
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
  "/create-partners",
  uploadSingle("uploads/partners"),
  async (req, res) => {
    try {
      const { name, website } = req.body;

      const partner = new Partners({
        logo: req.file.path,
        name,
        website,
      });

      const savedNews = await partner.save();

      res.status(201).json({
        message: "partner created successfully",
        data: savedNews,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Failed to create partner",
        error: error.message,
      });
    }
  }
);


export default router;
