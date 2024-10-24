import express from "express";
import TeamVisit from "../models/teamVisitSchema.js";

const router = express.Router();

router.post("/request-team-visit", async (req, res) => {
  try {
    const {
      name,
      email,
      representing,
      hotel_visit,
      date_from,
      date_to,
      sample_magazine,
      magazine_type,
      campaign_option,
      leave_message,
    } = req.body;

    const team = new TeamVisit({
      name,
      email,
      representing,
      hotel_visit,
      date_from,
      date_to,
      sample_magazine,
      magazine_type,
      campaign_option,
      leave_message,
    });

    const saveTeam = await team.save();

    res.status(201).json({
      message: "team visit request created successfully",
      data: saveTeam,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create team visit request",
      error: error.message,
    });
  }
});
export default router;
