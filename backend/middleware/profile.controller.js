const profileService =
  require("../services/profile.service");

async function getProfile(req, res) {

  try {

    const profile =
      profileService.getProfile(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      profile
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }
}


async function updateProfile(req, res) {

  try {

    const profile =
      profileService.updateProfile(
        req.user.userId,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
}


module.exports = {
  getProfile,
  updateProfile
};