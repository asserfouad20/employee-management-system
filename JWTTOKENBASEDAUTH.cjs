const express = require("express");
const jwt = require("jsonwebtoken");

// Create the app instance
const app = express();

//Middleware to authenticate the token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Verify the attendance of the token
  if (!token) {
    return res.sendStatus(401);
  }
  // Verify the token
  jwt.verify(token, "supersecretkey", (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next(); // The guard ,Middleware, passed the visitor
  });
}

// Middleware: authorize the role (Who are you)
function authorizeRole(requiredRole) {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).send("You do not have the permission to enter");
    }
    next();
  };
}

// Route to start the server
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Run the server
app.listen(3000, () => console.log("The server is running on port 3000"));