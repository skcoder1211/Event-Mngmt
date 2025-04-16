const mongoose = require('mongoose');

// Function to create the users collection
async function up() {
  try {
    // Define User Schema
    const UserSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
      },
      password: {
        type: String,
        required: true,
        minlength: 6
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
      }]
    });

    // Create the model
    const User = mongoose.model('User', UserSchema);
    
    console.log('Users collection created successfully');
    return true;
  } catch (error) {
    console.error('Error creating users collection:', error);
    return false;
  }
}

// Function to drop the users collection
async function down() {
  try {
    await mongoose.connection.dropCollection('users');
    console.log('Users collection dropped successfully');
    return true;
  } catch (error) {
    console.error('Error dropping users collection:', error);
    return false;
  }
}

module.exports = {
  up,
  down
}; 