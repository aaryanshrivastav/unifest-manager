import express from "express";
import {
  getFacultyHome,
  registerEvent,
  getFacultyEvents,
} from "../controllers/facultyController.js";
import { verifyFaculty } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:faculty_id/home", verifyFaculty, getFacultyHome);
router.post("/:faculty_id/register", verifyFaculty, registerEvent);
router.get("/:faculty_id/events", verifyFaculty, getFacultyEvents);

export default router;
