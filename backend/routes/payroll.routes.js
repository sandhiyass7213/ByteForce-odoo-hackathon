const express = require("express");

const payrollController =
  require("../controllers/payroll.controller");

const authMiddleware =
  require("../middleware/auth.middleware");

const allowRoles =
  require("../middleware/role.middleware");

const router = express.Router();


// Admin / HR → Create Payroll

router.post(
  "/",
  authMiddleware,
  allowRoles("ADMIN", "HR"),
  payrollController.createPayroll
);


// Employee → My Payroll

router.get(
  "/my",
  authMiddleware,
  payrollController.getMyPayroll
);


// Admin / HR → All Payroll

router.get(
  "/all",
  authMiddleware,
  allowRoles("ADMIN", "HR"),
  payrollController.getAllPayroll
);


module.exports = router;