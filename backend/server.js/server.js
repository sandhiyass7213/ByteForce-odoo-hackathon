const express = require("express");
const cors = require("cors");
const dashboardRoutes =
  require("./src/routes/dashboard.routes");
const authRoutes =
  require("./src/routes/auth.routes");
const profileRoutes =
  require("./src/routes/profile.routes");
const attendanceRoutes =
  require("./src/routes/attendance.routes");
const leaveRoutes =
  require("./src/routes/leave.routes");
const payrollRoutes =
  require("./src/routes/payroll.routes");
const app = express();


// Middleware
app.use(cors());

app.use(express.json());


// Test API
app.get("/api/health", (req, res) => {

  res.json({

    success: true,

    message:
      "Dayflow backend is running"

  });

});


// Auth APIs
app.use(
  "/api/auth",
  authRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
  "/api/profile",
  profileRoutes
);
app.use(
  "/api/attendance",
  attendanceRoutes
);
app.use(
  "/api/leave",
  leaveRoutes
);
app.use(
  "/api/payroll",
  payrollRoutes
);

const PORT = 5000;


app.listen(PORT, () => {

  console.log(
    `Dayflow backend running on http://localhost:${PORT}`
  );

});