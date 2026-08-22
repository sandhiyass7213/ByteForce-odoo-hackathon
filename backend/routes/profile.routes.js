const express = require("express");

const profileController =
  require("../controllers/profile.controller");

const authMiddleware =
  require("../middleware/auth.middleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  profileController.getProfile
);

router.put(
  "/",
  authMiddleware,
  profileController.updateProfile
);

module.exports = router;