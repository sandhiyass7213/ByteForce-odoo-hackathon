const fs = require("fs");
const path = require("path");

const payrollFile = path.join(
  __dirname,
  "../../data/payroll.json"
);

function getPayroll() {
  return JSON.parse(
    fs.readFileSync(payrollFile, "utf-8")
  );
}

function savePayroll(records) {
  fs.writeFileSync(
    payrollFile,
    JSON.stringify(records, null, 2)
  );
}


// ================= CREATE PAYROLL =================

function createPayroll(data) {

  const records = getPayroll();

  const {
    userId,
    basicSalary,
    allowances = 0,
    deductions = 0,
    month
  } = data;

  if (
    !userId ||
    basicSalary === undefined ||
    !month
  ) {
    throw new Error(
      "Please provide userId, basicSalary and month"
    );
  }

  const netSalary =
    Number(basicSalary) +
    Number(allowances) -
    Number(deductions);

  const payroll = {

    id: Date.now().toString(),

    userId,

    month,

    basicSalary: Number(basicSalary),

    allowances: Number(allowances),

    deductions: Number(deductions),

    netSalary,

    createdAt: new Date().toISOString()

  };

  records.push(payroll);

  savePayroll(records);

  return payroll;
}


// ================= MY PAYROLL =================

function getMyPayroll(userId) {

  const records = getPayroll();

  return records.filter(
    record => record.userId === userId
  );
}


// ================= ALL PAYROLL =================

function getAllPayroll() {

  return getPayroll();

}


module.exports = {
  createPayroll,
  getMyPayroll,
  getAllPayroll
};