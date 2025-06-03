const otps = require("./sendOtp").otps;

async function verifyOtp(req, res) {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP required", success: false });
    }
    // Debug log for troubleshooting
    // console.log("Verifying OTP:", { email, otp, stored: otps[email] });

    if (otps[email] && otps[email] === otp) {
        delete otps[email];
        return res.json({ message: "OTP verified", success: true });
    }
    return res.status(400).json({ message: "Invalid OTP", success: false });
}

module.exports = verifyOtp;
