import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import { ROLES } from "../config/constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO = process.env.MONGO_URL;
if (!MONGO) {
  console.error("❌ MONGO_URL missing in .env (looked at ../.env)");
  process.exit(1);
}

const createOrUpdateAdmin = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO);
    console.log("✅ Connected to MongoDB");

    const adminData = {
      name: "Super Admin",
      email: "admin@gmail.com",
      password: "admin@123", // This will be hashed by the pre-save hook
      role: "admin",
      verified: true,
      isActive: true
    };

    console.log(`\n🔍 Checking for existing admin with email: ${adminData.email}`);
    
    // Use the static method we defined
    let admin = await User.findByEmail(adminData.email);

    if (admin) {
      console.log("⚠️ Admin already exists. Updating info...");
      console.log("📋 Current admin data:", {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        verified: admin.verified,
        isActive: admin.isActive,
        hasPassword: !!admin.password
      });

      // Update admin details
      admin.name = adminData.name;
      admin.password = adminData.password; // This will trigger the pre-save hook to hash
      admin.role = adminData.role;
      admin.verified = adminData.verified;
      admin.isActive = adminData.isActive;
      
      await admin.save();
      console.log("🔄 Admin updated successfully!");
    } else {
      console.log("🆕 Creating new admin...");
      admin = new User(adminData);
      await admin.save();
      console.log("🎉 Admin created successfully!");
    }

    console.log("\n📊 Final admin details:");
    console.log("   ID:", admin._id);
    console.log("   Name:", admin.name);
    console.log("   Email:", admin.email);
    console.log("   Role:", admin.role);
    console.log("   Verified:", admin.verified);
    console.log("   Active:", admin.isActive);
    console.log("   Password Hash:", admin.password.substring(0, 20) + "...");

    console.log("\n👉 Login credentials:");
    console.log("   Email:", adminData.email);
    console.log("   Password:", adminData.password);

    // Test password comparison
    console.log("\n🧪 Testing password validation...");
    try {
      const isPasswordCorrect = await admin.compare(adminData.password);
      console.log("   Password verification test:", isPasswordCorrect ? "✅ PASS" : "❌ FAIL");
      
      if (!isPasswordCorrect) {
        console.log("❌ PASSWORD VALIDATION FAILED!");
        console.log("   This indicates an issue with password hashing or comparison.");
        console.log("   Check your User model's pre-save hook and compare method.");
      }
    } catch (compareError) {
      console.error("❌ Password comparison error:", compareError);
    }

    // Test user retrieval
    console.log("\n🔍 Testing user retrieval...");
    const testUser = await User.findByEmail(adminData.email);
    console.log("   User retrieval test:", testUser ? "✅ PASS" : "❌ FAIL");
    
    if (testUser) {
      console.log("   Retrieved user ID:", testUser._id);
      console.log("   Can login:", testUser.canLogin);
    }

    console.log("\n✨ Admin setup completed successfully!");

  } catch (err) {
    console.error("❌ Error creating/updating admin:");
    console.error(err);
    
    // Provide more specific error information
    if (err.name === 'ValidationError') {
      console.error("📋 Validation errors:");
      Object.values(err.errors).forEach(error => {
        console.error(`   - ${error.path}: ${error.message}`);
      });
    }
    
    if (err.code === 11000) {
      console.error("📋 Duplicate key error - email might already exist with different casing");
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

// Add some additional test users for different roles
const createTestUsers = async () => {
  const testUsers = [
    {
      name: "Demo Traveller",
      email: "demo@traveller.com",
      password: "demo123",
      role: "traveller",
      verified: true
    },
    {
      name: "Demo Guide", 
      email: "demo@guide.com",
      password: "demo123",
      role: "guide",
      verified: true
    },
    {
      name: "Demo Instructor",
      email: "demo@instructor.com", 
      password: "demo123",
      role: "instructor",
      verified: true
    }
  ];

  console.log("\n👥 Creating demo users...");
  for (const userData of testUsers) {
    try {
      const existing = await User.findByEmail(userData.email);
      if (!existing) {
        await User.create(userData);
        console.log(`   ✅ Created ${userData.role}: ${userData.email}`);
      } else {
        console.log(`   ⚠️ ${userData.role} already exists: ${userData.email}`);
      }
    } catch (error) {
      console.error(`   ❌ Failed to create ${userData.role}:`, error.message);
    }
  }
};

// Main execution
const main = async () => {
  await createOrUpdateAdmin();
  
  // Uncomment the line below if you want to create demo users too
  // await createTestUsers();
};

main();