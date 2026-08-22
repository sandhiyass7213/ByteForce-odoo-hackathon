const fs = require("fs");
const path = require("path");

const leaveFile = path.join(
  __dirname,
  "../../data/leaves.json"
);

function getLeaves() {
  return JSON.parse(
    fs.readFileSync(leaveFile, "utf-8")
  );
}

function saveLeaves(leaves) {
  fs.writeFileSync(
    leaveFile,
    JSON.stringify(leaves, null, 2)
  );
}


// ================= CREATE LEAVE =================

function createLeave(userId, data) {

  const leaves = getLeaves();

  const {
    leaveType,
    fromDate,
    toDate,
    reason
  } = data;

  if (
    !leaveType ||
    !fromDate ||
    !toDate ||
    !reason
  ) {
    throw new Error(
      "Please fill all leave details"
    );
  }

  if (new Date(fromDate) > new Date(toDate)) {
    throw new Error(
      "From date cannot be after to date"
    );
  }

  const leave = {

    id: Date.now().toString(),

    userId,

    leaveType,

    fromDate,

    toDate,

    reason,

    status: "PENDING",

    createdAt: new Date().toISOString()

  };

  leaves.push(leave);

  saveLeaves(leaves);

  return leave;
}


// ================= MY LEAVES =================

function getMyLeaves(userId) {

  const leaves = getLeaves();

  return leaves.filter(
    leave => leave.userId === userId
  );
}


// ================= ALL LEAVES =================

function getAllLeaves() {

  return getLeaves();

}


// ================= UPDATE STATUS =================

function updateLeaveStatus(
  leaveId,
  status
) {

  const leaves = getLeaves();

  const leave = leaves.find(
    leave => leave.id === leaveId
  );

  if (!leave) {
    throw new Error(
      "Leave request not found"
    );
  }

  if (
    status !== "APPROVED" &&
    status !== "REJECTED"
  ) {
    throw new Error(
      "Invalid leave status"
    );
  }

  leave.status = status;

  leave.updatedAt =
    new Date().toISOString();

  saveLeaves(leaves);

  return leave;
}


module.exports = {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
};