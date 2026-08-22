const fs = require("fs");
const path = require("path");

const usersFile = path.join(
  __dirname,
  "../../data/users.json"
);

function getUsers() {
  return JSON.parse(
    fs.readFileSync(usersFile, "utf-8")
  );
}

function getDashboard(user) {

  const users = getUsers();

  // =========================
  // EMPLOYEE DASHBOARD
  // =========================

  if (user.role === "EMPLOYEE") {

    const employee = users.find(
      (u) => u.id === user.userId
    );

    if (!employee) {
      throw new Error("Employee not found");
    }

    return {

      role: "EMPLOYEE",

      user: {
        name: employee.name,
        email: employee.email,
        loginId: employee.loginId,
        companyName: employee.companyName
      },

      menu: [
        "Profile",
        "Attendance",
        "Leave Requests",
        "Payroll"
      ]

    };
  }


  // =========================
  // ADMIN DASHBOARD
  // =========================

  if (
    user.role === "ADMIN" ||
    user.role === "HR"
  ) {

    const employees = users.filter(
      (u) => u.role === "EMPLOYEE"
    );

    return {

      role: user.role,

      summary: {
        totalEmployees: employees.length
      },

      menu: [
        "Employees",
        "Attendance",
        "Leave Approvals",
        "Payroll"
      ]

    };
  }


  throw new Error("Invalid user role");
}


module.exports = {
  getDashboard
};