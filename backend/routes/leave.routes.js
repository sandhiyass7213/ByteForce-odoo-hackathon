const express = require("express");

const leaveController =
  require("../controllers/leave.controller");

const authMiddleware =
  require("../middleware/auth.middleware");

const router = express.Router();


// Employee → Create Leave

router.post(
  "/",
  authMiddleware,
  leaveController.createLeave
);


// Employee → My Leaves

router.get(
  "/my",
  authMiddleware,
  leaveController.getMyLeaves
);


// Admin → All Leaves

router.get(
  "/all",
  authMiddleware,
  leaveController.getAllLeaves
);


// Admin → Approve / Reject

router.put(
  "/:id/status",
  authMiddleware,
  leaveController.updateLeaveStatus
);


module.exports = router;