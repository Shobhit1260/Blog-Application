const sendtoken = (statusCode, user, res) => {
  const token = user.generateToken();
  const options = {
    // cookie expiry (7 days)
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res
    .status(statusCode)
    .cookie('Token', token, options)
    .json({
      success: true,
      message: 'User logged in Successfully',
      token,
    });
};
module.exports=sendtoken;