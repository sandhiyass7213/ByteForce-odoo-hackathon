const express = require("express");

const dashboardController =
  require("../controllers/dashboard.controller");

const authMiddleware =
  require("../middleware/auth.middleware");


const router = express.Router();


router.get(
  "/",
  authMiddleware,
  dashboardController.getDashboard
);


module.exports = router;