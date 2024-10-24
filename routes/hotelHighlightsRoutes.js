import express from "express";
import Highlight from "../models/highlight.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await Highlight.find();
    return res.send({
      status: 200,
      content: data,
      message: "successfuly fetched hotel highlights.",
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