const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");

async function updateUserDetails(req, res) {
    try {
        console.log(req.body)
        // Get token from Authorization header: "Bearer <token>"
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

        const user = await getUserDetailsFromToken(token);

        const { name, profile_pic } = req.body;
        const updateUser = await UserModel.updateOne({ _id: user._id }, {
            name,
            profile_pic
        })

        const userInformation = await UserModel.findById(user._id);

        return res.json({
            message: "User Update Successfully",
            data: userInformation,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = updateUserDetails;