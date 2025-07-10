const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const { auth, adminAuth } = require('../middlewares/auth');
const {
  sendBookingConfirmationEmail,
  sendBookingConfirmationSMS,
  sendBookingStatusUpdate,
} = require('../services/notificationService');

// Get all bookings (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user').populate('service');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('service');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user').populate('service');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
router.post('/', auth, async (req, res) => {
  try {
    const { service, stylist, date, time } = req.body;
    
    // Get service details
    const serviceDetails = await Service.findById(service);
    if (!serviceDetails) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    const newBooking = new Booking({
      user: req.user._id,
      service,
      stylist,
      date,
      time,
    });
    
    await newBooking.save();
    await newBooking.populate('user service');
    
    // Prepare booking details for notifications
    const bookingDetails = {
      customerName: `${req.user.firstName} ${req.user.lastName}`,
      serviceName: serviceDetails.name,
      date: new Date(date).toLocaleDateString(),
      time,
      stylist,
      price: serviceDetails.price,
    };
    
    // Send confirmation email and SMS
    try {
      await sendBookingConfirmationEmail(req.user.email, bookingDetails);
      await sendBookingConfirmationSMS(req.user.phone, bookingDetails);
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't fail the booking if notifications fail
    }
    
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Update booking status (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user service');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Send status update notifications
    if (status && ['confirmed', 'cancelled', 'completed'].includes(status)) {
      const bookingDetails = {
        customerName: `${booking.user.firstName} ${booking.user.lastName}`,
        serviceName: booking.service.name,
        date: new Date(booking.date).toLocaleDateString(),
        time: booking.time,
        stylist: booking.stylist,
        price: booking.service.price,
      };
      
      try {
        await sendBookingStatusUpdate(
          booking.user.email,
          booking.user.phone,
          bookingDetails,
          status
        );
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }
    }
    
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Cancel booking (user can cancel their own booking)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user service');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Check if user owns the booking
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    // Send cancellation notification
    const bookingDetails = {
      customerName: `${booking.user.firstName} ${booking.user.lastName}`,
      serviceName: booking.service.name,
      date: new Date(booking.date).toLocaleDateString(),
      time: booking.time,
      stylist: booking.stylist,
      price: booking.service.price,
    };
    
    try {
      await sendBookingStatusUpdate(
        booking.user.email,
        booking.user.phone,
        bookingDetails,
        'cancelled'
      );
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete booking (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
