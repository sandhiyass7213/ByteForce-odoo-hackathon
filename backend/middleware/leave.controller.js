const leaveService =
  require("../services/leave.service");


// CREATE LEAVE

async function createLeave(req, res) {

  try {

    const leave =
      leaveService.createLeave(
        req.user.userId,
        req.body
      );

    res.status(201).json({

      success: true,

      message: "Leave request submitted",

      leave

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }
}


// MY LEAVES

async function getMyLeaves(req, res) {

  try {

    const leaves =
      leaveService.getMyLeaves(
        req.user.userId
      );

    res.status(200).json({

      success: true,

      leaves

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }
}


// ALL LEAVES

async function getAllLeaves(req, res) {

  try {

    const leaves =
      leaveService.getAllLeaves();

    res.status(200).json({

      success: true,

      leaves

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }
}


// APPROVE / REJECT

async function updateLeaveStatus(
  req,
  res
) {

  try {

    const leave =
      leaveService.updateLeaveStatus(
        req.params.id,
        req.body.status
      );

    res.status(200).json({

      success: true,

      message: "Leave status updated",

      leave

    });

  } catch (error) {

    res.status(400).json({

      success: false,

      message: error.message

    });

  }
}


module.exports = {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
};