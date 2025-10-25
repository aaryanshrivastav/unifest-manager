import express from "express";
import {
  getCoordinatorHome,
  assignVolunteers,
  getCoordinatorShifts,
  getVolunteerList,
} from "../controllers/coordinatorController.js";
import { verifyCoordinator } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:coordinator_id/home", verifyCoordinator, getCoordinatorHome);
router.post("/:coordinator_id/assign", verifyCoordinator, assignVolunteers);
router.get("/:coordinator_id/shift", verifyCoordinator, getCoordinatorShifts);
router.get("/:coordinator_id/list", verifyCoordinator, getVolunteerList);

export default router;
