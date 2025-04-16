const mongoose = require('mongoose');

// Function to create the events collection
async function up() {
  try {
    // Define Event Schema
    const EventSchema = new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    // Create the model
    const Event = mongoose.model('Event', EventSchema);
    
    console.log('Events collection created successfully');
    return true;
  } catch (error) {
    console.error('Error creating events collection:', error);
    return false;
  }
}

// Function to drop the events collection
async function down() {
  try {
    await mongoose.connection.dropCollection('events');
    console.log('Events collection dropped successfully');
    return true;
  } catch (error) {
    console.error('Error dropping events collection:', error);
    return false;
  }
}

module.exports = {
  up,
  down
}; 