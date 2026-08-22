const authService = require("../services/auth.service");


// ================= SIGNUP =================

async function signup(req, res) {

  try {

    const user = await authService.signup(req.body);

    res.status(201).json({

      success: true,

      message: "Signup successful",

      user

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }

}


// ================= LOGIN =================

async function login(req, res) {

  try {

    const {
      loginIdOrEmail,
      password
    } = req.body;


    if (!loginIdOrEmail || !password) {

      return res.status(400).json({

        success: false,

        message:
          "Login ID/email and password are required"

      });

    }


    const result =
      await authService.login(
        loginIdOrEmail,
        password
      );


    res.status(200).json({

      success: true,

      message: "Login successful",

      token: result.token,

      user: result.user

    });

  } catch (error) {

    res.status(401).json({

      success: false,

      message: error.message

    });

  }

}


module.exports = {
  signup,
  login
};