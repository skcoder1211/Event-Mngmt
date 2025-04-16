const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventmanagement';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

// Run migrations
async function runMigrations(action = 'up') {
  // Connect to the database
  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  // Get all migration files
  const migrationDir = path.join(__dirname);
  const migrationFiles = fs.readdirSync(migrationDir)
    .filter(file => file.endsWith('.js') && file !== 'migration-runner.js')
    .sort(); // Ensure migrations run in order

  console.log(`Found ${migrationFiles.length} migration files`);

  // Execute each migration
  for (const file of migrationFiles) {
    try {
      console.log(`Running migration: ${file}`);
      const migration = require(path.join(migrationDir, file));
      
      if (action === 'up') {
        await migration.up();
      } else if (action === 'down') {
        await migration.down();
      }
      
      console.log(`Completed migration: ${file}`);
    } catch (error) {
      console.error(`Failed to run migration ${file}:`, error);
      process.exit(1);
    }
  }

  // Close the database connection
  await mongoose.connection.close();
  console.log('All migrations completed successfully');
}

// Check command line arguments
const args = process.argv.slice(2);
const action = args[0] || 'up';

if (action !== 'up' && action !== 'down') {
  console.error('Invalid action. Use "up" or "down".');
  process.exit(1);
}

// Run migrations
runMigrations(action); 