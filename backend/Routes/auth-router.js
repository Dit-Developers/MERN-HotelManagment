const express = require("express");
const authenticateJWT = require('../Middlewares/authenticationMiddleware');
const authorizeRole = require('../Middlewares/authorizeMiddleware');
const router = express.Router();
const authController = require("../Controllers/auth-controller");


router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authenticateJWT, authController.profileData);
router.put("/profile", authenticateJWT, authController.updateOwnProfile);
router.put("/update/:id", authenticateJWT, authorizeRole('admin'), authController.update);
router.get("/get-all-users", authenticateJWT, authorizeRole('admin', 'manager', 'receptionist'), authController.getAllUsers);
router.get("/get-user/:id", authenticateJWT, authorizeRole('admin'), authController.getSingleUser);
router.put("/update-status/:id", authenticateJWT, authorizeRole('admin'), authController.updateUserStatus);
router.delete("/delete-user/:id", authenticateJWT, authorizeRole('admin'), authController.deleteUser);


module.exports = router;
