import express from "express";
import {
  getAdminHome,
  getApprovals,
  getAdminLists,
} from "../controllers/adminController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:admin_id/home", verifyAdmin, getAdminHome);
router.get("/:admin_id/approval", verifyAdmin, getApprovals);
router.get("/:admin_id/list", verifyAdmin, getAdminLists);

export default router;
