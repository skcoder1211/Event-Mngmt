const Event = require('../models/Event');

class EventController {
  // Get all events (index)
  async index(req, res) {
    try {
      const events = await Event.find().sort({ date: 1 }).populate('attendees', 'name email');
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get single event (show)
  async show(req, res) {
    try {
      const event = await Event.findById(req.params.id).populate('attendees', 'name email');
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.json(event);
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Create new event (create)
  async create(req, res) {
    try {
      const newEvent = new Event(req.body);
      const event = await newEvent.save();
      res.status(201).json(event);
    } catch (err) {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Update event (update)
  async update(req, res) {
    try {
      const event = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('attendees', 'name email');
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.json(event);
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Event not found' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Delete event (delete)
  async delete(req, res) {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.json({ message: 'Event removed successfully' });
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Register for an event
  async register(req, res) {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Check if user is already registered
      if (event.attendees.includes(userId)) {
        return res.status(400).json({ message: 'User is already registered for this event' });
      }
      
      // Add user to attendees
      event.attendees.push(userId);
      await event.save();
      
      // Return the updated event with populated attendees
      const updatedEvent = await Event.findById(req.params.id).populate('attendees', 'name email');
      res.json(updatedEvent);
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Event or User not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new EventController(); 