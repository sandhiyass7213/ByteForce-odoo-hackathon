const attendanceService =
  require("../services/attendance.service");


// CHECK IN

async function checkIn(req, res) {

  try {

    const record =
      attendanceService.checkIn(
        req.user.userId
      );

    res.status(201).json({

      success: true,

      message: "Check-in successful",

      attendance: record

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }
}


// CHECK OUT

async function checkOut(req, res) {

  try {

    const record =
      attendanceService.checkOut(
        req.user.userId
      );

    res.status(200).json({

      success: true,

      message: "Check-out successful",

      attendance: record

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }
}


// MY ATTENDANCE

async function getMyAttendance(req, res) {

  try {

    const records =
      attendanceService.getMyAttendance(
        req.user.userId
      );

    res.status(200).json({

      success: true,

      attendance: records

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }
}


module.exports = {
  checkIn,
  checkOut,
  getMyAttendance
};