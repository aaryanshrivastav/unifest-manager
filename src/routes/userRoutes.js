import express from "express";
import {
  getHome,
  getAllEvents,
  getMyEvents,
  submitApplication,
} from "../controllers/userController.js";
import { verifyUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes for user functionality
router.get("/:user_id/home", verifyUser, getHome);
router.get("/:user_id/events", verifyUser, getAllEvents);
router.get("/:user_id/my-events", verifyUser, getMyEvents);
router.post("/:user_id/application", verifyUser, submitApplication);

export default router;
