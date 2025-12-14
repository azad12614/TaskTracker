const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  if (req.cookies.jwt_token) {
    token = req.cookies.jwt_token;
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({
      message: "Not authorized, token failed or expired",
    });
  }
};

module.exports = { protect };
