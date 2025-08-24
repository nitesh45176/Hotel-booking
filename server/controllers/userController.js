import User from '../models/User.js';

// API to get user data
export const getUserData = async (req, res) => {
  try {
    // ✅ Get the full user document to access all fields
    const fullUser = await User.findById(req.user.userId).select("-password");

    if (!fullUser) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      _id: fullUser._id,  // ✅ Now this exists
      fullName: fullUser.fullName,  // ✅ Use fullName (from your schema)
      email: fullUser.email,
      image: fullUser.image,
      role: fullUser.role,
      recentSearchedCities: fullUser.recentSearchedCities || [],
    });

  } catch (error) {
    console.error("❌ Get user data error:", error);
    res.json({ success: false, message: "Failed to fetch user data" });
  }
};

// API to store recent searched cities  
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { city } = req.body;
    const userId = req.user.userId; // ✅ Fix this too - use userId instead of _id

    if (!city) {
      return res.json({ success: false, message: "City is required" });
    }

    // Find user and update recent searches
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Remove city if it already exists (to avoid duplicates)
    user.recentSearchedCities = user.recentSearchedCities.filter(
      existingCity => existingCity.toLowerCase() !== city.toLowerCase()
    );

    // Add new city at the beginning
    user.recentSearchedCities.unshift(city);

    // Keep only last 5 searches
    if (user.recentSearchedCities.length > 5) {
      user.recentSearchedCities = user.recentSearchedCities.slice(0, 5);
    }

    await user.save();

    console.log("✅ Updated recent searches for user:", user.email, "Cities:", user.recentSearchedCities);

    res.json({
      success: true,
      message: "Recent search updated successfully",
      recentSearchedCities: user.recentSearchedCities
    });

  } catch (error) {
    console.error("❌ Store recent search error:", error);
    res.json({ success: false, message: "Failed to update recent searches" });
  }
};