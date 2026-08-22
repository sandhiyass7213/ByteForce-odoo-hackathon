const dashboardService =
  require("../services/dashboard.service");


async function getDashboard(req, res) {

  try {

    const dashboard =
      dashboardService.getDashboard(req.user);

    res.status(200).json({

      success: true,

      dashboard

    });

  } catch (error) {

    res.status(403).json({

      success: false,

      message: error.message

    });

  }

}


module.exports = {
  getDashboard
};