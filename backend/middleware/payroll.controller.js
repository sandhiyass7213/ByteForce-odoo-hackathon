const payrollService =
  require("../services/payroll.service");


// CREATE PAYROLL

async function createPayroll(req, res) {

  try {

    const payroll =
      payrollService.createPayroll(
        req.body
      );

    res.status(201).json({

      success: true,

      message: "Payroll created successfully",

      payroll

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }
}


// MY PAYROLL

async function getMyPayroll(req, res) {

  try {

    const payroll =
      payrollService.getMyPayroll(
        req.user.userId
      );

    res.status(200).json({

      success: true,

      payroll

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }
}


// ALL PAYROLL

async function getAllPayroll(req, res) {

  try {

    const payroll =
      payrollService.getAllPayroll();

    res.status(200).json({

      success: true,

      payroll

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }
}


module.exports = {
  createPayroll,
  getMyPayroll,
  getAllPayroll
};