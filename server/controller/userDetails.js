const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
async function userDetails(req, res) {
  try {
    // console.log(req.cookies);
    const token = req.cookies.token || "";

    const user = await getUserDetailsFromToken(token);

    return res.status(200).json({
      message: "User Details",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      place: "userDetails",
    });
  }
}

module.exports = userDetails;
