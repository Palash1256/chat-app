async function logout(req, res) {
  try {
    return res.status(200).json({
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