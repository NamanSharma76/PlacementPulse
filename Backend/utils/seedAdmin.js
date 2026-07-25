require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Admin = require("../models/Admin.model");

const adminData = {
  name: "Placement Admin",
  email: "namansharma9625@gmail.com",
  password: "Admin@Naman",
  designation: "Placement Coordinator",
};

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Delete existing admin
    await Admin.deleteMany({});

    // Create new admin
    const admin = await Admin.create(adminData);
    console.log("✅ Admin created successfully!");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${adminData.password}`);

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Seeder failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();