const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
async function checkPassword(req, res) {
  try {
    const { password, userId } = req.body;
    //console.log("body",req.body);

    const user = await UserModel.findById(userId);
    //console.log(user);

    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(400).json({
        message: "Password Invalid",
        error: true,
      });
    }
    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECREAT_KEY, {
      expiresIn: "5h",
    });

    // Do not set cookie, just return token
    return res.status(200).json({
      message: "User login Successfully",
      token: token,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || error,
      error: true,
    });
  }
}

module.exports = checkPassword;
