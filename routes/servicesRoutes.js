import express from "express";
import { createMulterMiddleware } from "../utils/uploads.js";
import Services from "../models/services.js";
import ServiceInsights from "../models/serviceInsightsSchema.js";

const router = express.Router();

export const uploadSingle = (folderPath) =>
  createMulterMiddleware(folderPath).single("icon");

router.get("/", async (req, res) => {
  try {
    const data = await Services.find();
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
  "/create-services",
  uploadSingle("uploads/collaborative-advantages/icons"),
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
        message: "service created successfully",
        data: savedNews,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Failed to create service",
        error: error.message,
      });
    }
  }
);

router.get("/insights", async (req, res) => {
  try {
    const data = await ServiceInsights.find();
    return res.send({
      status: 200,
      insights: data,
      message: "successfuly fetched service insights",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "internal server error",
      error: error.message,
    });
  }
});

router.post("/create-insights", async (req, res) => {
  try {
    const { insights, description } = req.body;
    const createInsights = ServiceInsights({
      insights,
      description,
    });
    const savedInsights = await createInsights.save();
    return res.send({
      status: 200,
      insights: savedInsights,
      message: "successfuly created service insights",
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
