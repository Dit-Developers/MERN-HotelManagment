const userModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const activeUserStatus = "active";
const inactiveUserStatus = "inactive";


//  AUTHENTICATION API 
//  USER REGISTRATION API - BY DEFAULT INACTIVE
const register = async (req, res) => {
  try {
    const { fullName, username, phone, email, password, role } = req.body;

    const userExists = await userModel.findOne({ email: email });
    if (userExists) { 
      return res.status(400).json({ message: "User already exists" }); 
    }

    const newUser = await userModel.create({
      fullName: fullName,
      username: username,
      phone: phone,
      email: email,
      password: password,
      role: role,
      status: "inactive"
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    if (newUser) { 
      return res.status(201).json({ 
        message: "User has been created successfully",
        token,
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          status: newUser.status
        }
      }); 
    }
  } catch (error) {
    console.log("An error occurred", error.message);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

// AUTHENTICATION API
// LOGIN API
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) { return res.status(404).json({ message: "Invalid credentials" }); }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) { return res.status(401).json({ message: "Invalid credentials" }); }

    if (user.status === inactiveUserStatus) { 
      return res.status(403).json({ message: "Your account is inactive" }); 
    }
    
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // FIX: Return user data along with token
    return res.json({ 
      message: "User logged in successfully", 
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      }
    });
    
  } catch (error) {
    console.log("An error occurred in login API", error.message);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

// AUTHENTICATION API
// PROFILE API
const profileData = async (req, res) => {
  try {
    console.log("🔍 Profile API called");
    console.log("📝 Headers:", req.headers);
    console.log("👤 req.user:", req.user);
    console.log("👤 req.user._id:", req.user?._id);

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      console.log("❌ No user ID found in request");
      return res.status(401).json({ 
        message: "Unauthorized. Please login first.",
        error: "User not authenticated"
      });
    }

    // Find user by ID
    const findUser = await userModel.findById(req.user._id);
    console.log("🔎 Found user in DB:", findUser ? "Yes" : "No");
    
    if (!findUser) {
      console.log("❌ User not found in database");
      return res.status(404).json({ 
        message: "User not found",
        error: "User does not exist in database"
      });
    }

    // Check if user is active
    console.log("📊 User status:", findUser.status);
    if (findUser.status !== "active") {
      console.log("⚠️ User is not active");
      return res.status(403).json({ 
        message: `Your account is ${findUser.status}. Please contact administrator.`,
        error: `Account is ${findUser.status}`
      });
    }

    // Prepare user data (remove sensitive information)
    const userData = {
      _id: findUser._id,
      fullName: findUser.fullName,
      email: findUser.email,
      username: findUser.username,
      phone: findUser.phone,
      role: findUser.role,
      status: findUser.status
    };

    console.log("✅ Sending user data:", userData.email);
    
    return res.status(200).json({ 
      success: true,
      message: "Profile data retrieved successfully", 
      user: userData  // Changed to 'user' for consistency
    });
    
  } catch (error) {
    console.log("❌ An error occurred in profile API:", error.message);
    console.log("📋 Error stack:", error.stack);
    console.log("🔧 Error details:", error);
    
    return res.status(500).json({ 
      success: false,
      message: "Internal server error", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// USER MANAGEMENT API
// Update USER API 
const update = async (req, res) => {
  try {
    const updateUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updateUser) {
      return res.json({ message: "An error occurred while updating data." });
    }

    return res.json({ message: "Records updated successfully", updateUser });
  } catch (error) {
    console.log("An error occurred in update API", error.message);
    return res.json({ message: "An error occurred", error });
  }
};


// USER MANAGEMENT API
// GET ALL USERS API FOR ADMIN
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find();
    if (!allUsers) { return res.status(404).json({ message: "No users found" }); }
    return res.status(200).json({ message: "Here are all the users", allUsers });

  }
  catch (error) {
    console.error("Server error", error);
    return res.status(404).json({ message: "Server error", error });
  }
}


// USER MANAGEMENT API
// GET SINGLE USER API FOR ADMIN
const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) { return res.status(404).json({ message: "Incorrect user id" }); }
    const singleUser = await userModel.findOne({ _id: userId });
    if (!singleUser) { return res.status(404).json({ message: "User not found" }); }

    return res.status(200).json({ message: "Here is the user data", singleUser });

  } catch (error) {
    console.error("Server error", error);
    return res.json({ message: "Server error", error });
  }
}

// USER MANAGEMENT API
// Update user status API for admin
const updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    const findUser = await userModel.findOne({ _id: userId });
    if (!findUser) { return res.status(404).json({ message: "User not found" }); }
    const currentStatus = findUser.status;
    if (currentStatus === status) { return res.status(400).json({ message: `User is already ${currentStatus}` }); }

    if (currentStatus !== status) {
      const updateStatus = await userModel.findByIdAndUpdate(userId, { status: status }, { new: true });
      return res.status(200).json({ message: `User is now ${status}`, updateStatus });
    }

  } catch (error) {
    console.error("Server error", error);
    return res.status(400).json({ message: "Server error", error });
  }
}

// USER MANAGEMENT API
// Delete user API for admin - NOT FOR USE
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const findUser = await userModel.findOne({ _id: userId });
    if(!findUser){ return res.status(404).json({ message: "User not found" }); }
    const deleteUser = await userModel.findByIdAndDelete(userId); 
    return res.status(200).json({ message: "User deleted successfully" });
    
  } catch (error) {
    console.error("Server error", error);
    return res.status(400).json({message:"Server error", error});
  }
}


// const logout = useCallback(async () => {
//   if (isLoggingOutRef.current) {
//     return;
//   }
  
//   isLoggingOutRef.current = true;
  
//   try {
//     // Clear local state
//     setUser(null);
//     setIsAuthenticated(false);
//     setError('');
    
//     // Clear localStorage
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('rememberEmail');
    
//     // Remove axios auth header
//     delete axios.defaults.headers.common['Authorization'];
    
//     // Optional: Call logout API if it exists
//     try {
//       await axios.post('/api/auth/logout', {}, {
//         timeout: 3000,
//         headers: { 'X-Skip-Interceptor': 'true' }
//       });
//     } catch (apiError) {
//       // If API doesn't exist, just log and continue
//       console.log('Logout API not available, proceeding with client-side logout');
//     }
//   } catch (error) {
//     console.error('Logout error:', error);
//   } finally {
//     navigate('/login', { replace: true });
//     setTimeout(() => {
//       isLoggingOutRef.current = false;
//     }, 100);
//   }
// }, [navigate]);
module.exports = { register, login,  profileData, update, getAllUsers, getSingleUser, updateUserStatus , deleteUser};
