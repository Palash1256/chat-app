async function logout(req, res) {
  try {

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    };
    return res.cookie("token", '', cookiesOption).status(200).json({
      message: "Session Out",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true
    })
  }
}

module.exports = logout;