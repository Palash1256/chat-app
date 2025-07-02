const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");

async function updatePassword(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and new password are required",
                success: false,
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashpassword = await bcryptjs.hash(password, salt);

        await UserModel.updateOne({ email }, { password: hashpassword });

        return res.json({
            message: "Password updated successfully",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
        });
    }
}

module.exports = updatePassword;
