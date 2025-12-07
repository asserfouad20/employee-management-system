// Script to clean orphaned leave records (leaves without valid employee references)
import mongoose from 'mongoose';
import Leave from '../models/Leave.js';
import Employee from '../models/Employee.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanOrphanedLeaves = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Get all leaves
    const allLeaves = await Leave.find();
    console.log(`Total leaves found: ${allLeaves.length}`);

    let orphanedCount = 0;
    const orphanedLeaves = [];

    // Check each leave for valid employee reference
    for (const leave of allLeaves) {
      const employee = await Employee.findById(leave.employee);

      if (!employee) {
        orphanedCount++;
        orphanedLeaves.push({
          leaveId: leave._id,
          leaveType: leave.leaveType,
          reason: leave.reason,
          startDate: leave.startDate,
          endDate: leave.endDate,
          status: leave.status,
        });

        console.log(`\nOrphaned Leave Found:`);
        console.log(`  ID: ${leave._id}`);
        console.log(`  Type: ${leave.leaveType}`);
        console.log(`  Reason: ${leave.reason}`);
        console.log(`  Status: ${leave.status}`);
        console.log(`  Employee ID (not found): ${leave.employee}`);
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Total orphaned leaves: ${orphanedCount}`);

    if (orphanedCount > 0) {
      console.log('\nDeleting orphaned leave records...');

      for (const orphaned of orphanedLeaves) {
        await Leave.findByIdAndDelete(orphaned.leaveId);
        console.log(`Deleted leave: ${orphaned.leaveType} - ${orphaned.reason}`);
      }

      console.log(`\n✓ Successfully deleted ${orphanedCount} orphaned leave record(s)`);
    } else {
      console.log('\n✓ No orphaned leaves found. Database is clean!');
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);

  } catch (error) {
    console.error('Error cleaning orphaned leaves:', error);
    process.exit(1);
  }
};

cleanOrphanedLeaves();
