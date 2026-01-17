const express = require("express");
const authenticateJWT = require('../Middlewares/authenticationMiddleware');
const authorizeRole = require('../Middlewares/authorizeMiddleware');
const router = express.Router();
const authController = require("../Controllers/auth-controller");


// use them for testing purpose
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authController.profileData);
router.put("/update/:id", authController.update);
router.get("/get-all-users", authController.getAllUsers);
router.get("/get-user/:id", authController.getSingleUser);
router.put("/update-status/:id", authController.updateUserStatus);
router.delete("/delete-user/:id", authController.deleteUser);

// Add this line with other routes:
// router.post("/logout", authenticateJWT, authController.logout);



// Use them for production purpose
// router.post("/register", authController.register);
// router.post("/login", authController.login);
// router.get("/profile", authenticateJWT, (authController.profileData));
// router.put("/update/:id", authenticateJWT, authorizeRole('admin'), (authController.update));
// router.get("/get-all-users", authenticateJWT, authorizeRole('admin'), (authController.getAllUsers));
// router.get("/get-user/:id", authenticateJWT, authorizeRole('admin'), (authController.getSingleUser));
// router.put("/update-status/:id", authenticateJWT, authorizeRole('admin'), (authController.updateUserStatus));
// router.delete("/delete-user/:id", authenticateJWT, authorizeRole('admin'), (authController.deleteUser));

module.exports = router;
