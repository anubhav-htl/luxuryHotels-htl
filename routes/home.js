import express from "express";
import {
  addHomeContent,
  getHomeContent,
  removeHomeContent,
} from "../controllers/homecontent.js";

const router = express.Router();

router.get("/", getHomeContent);
router.post("/add-content", addHomeContent);
router.delete("/remove/:id", removeHomeContent);

export default router;
