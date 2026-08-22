const fs = require("fs");
const path = require("path");

const attendanceFile = path.join(
  __dirname,
  "../../data/attendance.json"
);

function getAttendance() {
  return JSON.parse(
    fs.readFileSync(attendanceFile, "utf-8")
  );
}

function saveAttendance(records) {
  fs.writeFileSync(
    attendanceFile,
    JSON.stringify(records, null, 2)
  );
}


// ================= CHECK IN =================

function checkIn(userId) {

  const records = getAttendance();

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // Check if already checked in today
  const existing = records.find(
    record =>
      record.userId === userId &&
      record.date === today
  );

  if (existing) {
    throw new Error(
      "You have already checked in today"
    );
  }

  const now = new Date();

  const record = {
    id: Date.now().toString(),

    userId,

    date: today,

    checkIn: now.toISOString(),

    checkOut: null,

    status: "PRESENT"
  };

  records.push(record);

  saveAttendance(records);

  return record;
}


// ================= CHECK OUT =================

function checkOut(userId) {

  const records = getAttendance();

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const record = records.find(
    record =>
      record.userId === userId &&
      record.date === today
  );

  if (!record) {
    throw new Error(
      "Please check in first"
    );
  }

  if (record.checkOut) {
    throw new Error(
      "You have already checked out today"
    );
  }

  record.checkOut = new Date().toISOString();

  saveAttendance(records);

  return record;
}


// ================= MY ATTENDANCE =================

function getMyAttendance(userId) {

  const records = getAttendance();

  return records.filter(
    record => record.userId === userId
  );
}


module.exports = {
  checkIn,
  checkOut,
  getMyAttendance
};