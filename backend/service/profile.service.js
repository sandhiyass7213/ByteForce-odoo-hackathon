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

function saveUsers(users) {
  fs.writeFileSync(
    usersFile,
    JSON.stringify(users, null, 2)
  );
}

function getProfile(userId) {

  const users = getUsers();

  const user = users.find(
    (u) => u.id === userId
  );

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    companyName: user.companyName,
    name: user.name,
    email: user.email,
    phone: user.phone,
    loginId: user.loginId,
    role: user.role
  };
}

function updateProfile(userId, data) {

  const users = getUsers();

  const userIndex = users.findIndex(
    (u) => u.id === userId
  );

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const user = users[userIndex];

  // Employee editable fields
  if (data.name !== undefined) {
    user.name = data.name;
  }

  if (data.phone !== undefined) {
    user.phone = data.phone;
  }

  users[userIndex] = user;

  saveUsers(users);

  return {
    id: user.id,
    companyName: user.companyName,
    name: user.name,
    email: user.email,
    phone: user.phone,
    loginId: user.loginId,
    role: user.role
  };
}

module.exports = {
  getProfile,
  updateProfile
};