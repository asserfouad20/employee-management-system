// Backend/scripts/createEmployee.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";

const createEmployee = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Employee credentials
    const employeeData = {
      name: "Test Employee",
      email: "employee@gmail.com",
      password: "employee123",
      role: "employee",
    };

    // Check if employee user already exists
    let existingUser = await User.findOne({ email: employeeData.email });

    if (existingUser) {
      console.log("Employee user already exists. Updating password...");
      existingUser.password = employeeData.password;
      await existingUser.save();
      console.log("Employee password updated!");
    } else {
      // Create new employee user
      existingUser = await User.create(employeeData);
      console.log("Employee user created!");
    }

    // Check if we need to create an Employee record
    let employeeRecord = await Employee.findOne({ userId: existingUser._id });

    if (!employeeRecord) {
      // Get a department (create one if none exists)
      let department = await Department.findOne();

      if (!department) {
        department = await Department.create({
          dep_name: "IT Department",
          description: "Information Technology",
        });
        console.log("Created IT Department");
      }

      // Create employee record
      employeeRecord = await Employee.create({
        userId: existingUser._id,
        employeeId: "EMP001",
        dob: new Date("1990-01-15"),
        gender: "Male",
        maritalStatus: "Single",
        designation: "Software Developer",
        department: department._id,
        salary: 60000,
      });

      console.log("Employee record created!");
    } else {
      console.log("Employee record already exists");
    }

    console.log("\nEmail:", employeeData.email);
    console.log("Password:", employeeData.password);
    console.log("Employee ID:", employeeRecord.employeeId);
    console.log("\nYou can now log in as an employee!\n");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createEmployee();
