const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const usersFile = path.join(__dirname, "../../data/users.json");

function getUsers() {
  return JSON.parse(fs.readFileSync(usersFile, "utf-8"));
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}


// Generate Login ID
function generateLoginId(companyName, name, users) {

  const companyCode = companyName
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase();

  const nameCode = name
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 4)
    .toUpperCase();

  const number = String(users.length + 1).padStart(3, "0");

  return `${companyCode}${nameCode}${number}`;
}


// ================= SIGNUP =================

async function signup(data) {

  const users = getUsers();

  const {
    companyName,
    companyLogo,
    name,
    email,
    phone,
    password,
    confirmPassword
  } = data;


  // Check required fields
  if (
    !companyName ||
    !name ||
    !email ||
    !phone ||
    !password ||
    !confirmPassword
  ) {
    throw new Error("Please fill all required fields");
  }


  // Check password
  if (password !== confirmPassword) {
    throw new Error("Password and confirm password do not match");
  }


  // Check existing email
  const existingUser = users.find(
    user => user.email === email.toLowerCase()
  );

  if (existingUser) {
    throw new Error("Email already registered");
  }


  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);


  // Generate Login ID
  const loginId = generateLoginId(
    companyName,
    name,
    users
  );


  // Create user
  const newUser = {

    id: uuidv4(),

    companyName,

    companyLogo: companyLogo || null,

    name,

    email: email.toLowerCase(),

    phone,

    passwordHash,

    loginId,

    role: "EMPLOYEE",

    createdAt: new Date().toISOString()

  };


  users.push(newUser);

  saveUsers(users);


  // Don't return password
  return {

    companyName: newUser.companyName,

    name: newUser.name,

    email: newUser.email,

    phone: newUser.phone,

    loginId: newUser.loginId,

    role: newUser.role

  };
}


// ================= LOGIN =================

async function login(loginIdOrEmail, password) {

  const users = getUsers();


  // Login using Login ID OR Email
  const user = users.find(

    user =>

      user.loginId.toLowerCase() ===
        loginIdOrEmail.toLowerCase()

      ||

      user.email.toLowerCase() ===
        loginIdOrEmail.toLowerCase()

  );


  if (!user) {

    throw new Error(
      "Invalid Login ID/email or password"
    );

  }


  // Check password
  const passwordMatch = await bcrypt.compare(
    password,
    user.passwordHash
  );


  if (!passwordMatch) {

    throw new Error(
      "Invalid Login ID/email or password"
    );

  }


  // Create JWT
  const token = jwt.sign(

    {
      userId: user.id,

      loginId: user.loginId,

      role: user.role

    },

    process.env.JWT_SECRET ||
      "dayflow_secret_key",

    {
      expiresIn: "1d"
    }

  );


  return {

    token,

    user: {

      companyName: user.companyName,

      name: user.name,

      email: user.email,

      phone: user.phone,

      loginId: user.loginId,

      role: user.role

    }

  };

}


module.exports = {
  signup,
  login
};