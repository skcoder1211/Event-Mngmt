const Event = require('../models/Event');
const User = require('../models/User');

class RegistrationController {
  /**
   * Register a user for an event
   * Updates both the event attendees and user events
   */
  async register(req, res) {
    try {
      const { userId } = req.body;
      const eventId = req.params.id;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      // Find the event and user
      const event = await Event.findById(eventId);
      const user = await User.findById(userId);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if user is already registered
      if (event.attendees.includes(userId)) {
        return res.status(400).json({ message: 'User is already registered for this event' });
      }
      
      // Add user to event attendees
      event.attendees.push(userId);
      await event.save();
      
      // Add event to user's events
      if (!user.events.includes(eventId)) {
        user.events.push(eventId);
        await user.save();
      }
      
      // Return the updated event with populated attendees
      const updatedEvent = await Event.findById(eventId).populate('attendees', 'name email');
      res.json({
        message: 'Registration successful',
        event: updatedEvent
      });
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Event or User not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }

  /**
   * Cancel a user's registration for an event
   * Updates both the event attendees and user events
   */
  async cancel(req, res) {
    try {
      const { userId } = req.body;
      const eventId = req.params.id;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      // Find the event and user
      const event = await Event.findById(eventId);
      const user = await User.findById(userId);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if user is registered
      if (!event.attendees.includes(userId)) {
        return res.status(400).json({ message: 'User is not registered for this event' });
      }
      
      // Remove user from event attendees
      event.attendees = event.attendees.filter(
        attendee => attendee.toString() !== userId.toString()
      );
      await event.save();
      
      // Remove event from user's events
      user.events = user.events.filter(
        userEvent => userEvent.toString() !== eventId.toString()
      );
      await user.save();
      
      res.json({ message: 'Registration cancelled successfully' });
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Event or User not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }

  /**
   * Get all events a user is registered for
   */
  async getUserEvents(req, res) {
    try {
      const userId = req.params.userId;
      
      const user = await User.findById(userId)
        .populate('events', 'title description date location');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user.events);
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new RegistrationController(); 