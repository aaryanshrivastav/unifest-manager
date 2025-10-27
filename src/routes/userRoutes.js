import express from "express";
import {
  getProfile,
  getAllEvents,
  getMyEvents,
  submitApplication,
} from "../controllers/userController.js";
import { verifyUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All user-specific routes are protected
router.get("/:user_id/home", verifyUser, getProfile);
router.get("/:user_id/events", verifyUser, getAllEvents);
router.get("/:user_id/my-events", verifyUser, getMyEvents);
router.post("/:user_id/application", verifyUser, submitApplication);

export default router;
