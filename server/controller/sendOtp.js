const nodemailer = require('nodemailer');
const otps = {};

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtp(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email required", success: false });
    }
    const otp = generateOtp();
    otps[email] = otp;

    // Send OTP via email
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Chat App',
            text: `Your OTP is: ${otp}`
        });

        return res.json({ message: "OTP sent", success: true });
    } catch (err) {
        console.error("Failed to send OTP email:", err);
        return res.status(500).json({ message: "Failed to send OTP", success: false });
    }
}

module.exports = sendOtp;
module.exports.otps = otps;
