const User = require('../models/User');

class UserController {
  // Get all users
  async index(req, res) {
    try {
      const users = await User.find().select('-password').populate('events', 'title date location');
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get single user
  async show(req, res) {
    try {
      const user = await User.findById(req.params.id)
        .select('-password')
        .populate('events', 'title date location');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Create new user
  async create(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      user = new User({
        name,
        email,
        password // In a real app, hash the password before saving
      });

      await user.save();
      const userToReturn = await User.findById(user._id).select('-password');
      res.status(201).json(userToReturn);
    } catch (err) {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Update user
  async update(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not found' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Delete user
  async delete(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'User removed successfully' });
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new UserController(); 