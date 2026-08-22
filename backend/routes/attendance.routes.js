const express = require("express");

const attendanceController =
  require("../controllers/attendance.controller");

const authMiddleware =
  require("../middleware/auth.middleware");

const router = express.Router();


// Check In

router.post(
  "/check-in",
  authMiddleware,
  attendanceController.checkIn
);


// Check Out

router.post(
  "/check-out",
  authMiddleware,
  attendanceController.checkOut
);


// My Attendance

router.get(
  "/my",
  authMiddleware,
  attendanceController.getMyAttendance
);


module.exports = router;