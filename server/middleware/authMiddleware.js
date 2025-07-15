const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.cookies.token; // Retrieve token from the cookie

  if (!token) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
