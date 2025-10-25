import express from "express";
import {
  getVolunteerHome,
  getVolunteerEvents,
  getVolunteerShifts,
} from "../controllers/volunteerController.js";
import { verifyVolunteer } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:volunteer_id/home", verifyVolunteer, getVolunteerHome);
router.get("/:volunteer_id/events", verifyVolunteer, getVolunteerEvents);
router.get("/:volunteer_id/shift", verifyVolunteer, getVolunteerShifts);

export default router;
