const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Process payment for a booking
router.post('/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
  const { cardName, cardNumber, expiry, cvc } = req.body;

  // Validate required fields
  if (!cardName || !cardNumber || !expiry || !cvc) {
    return res.status(400).json({ message: 'Missing payment details' });
  }

  // Basic validation for card details
  if (cardNumber.length < 16 || cardNumber.length > 19) {
    return res.status(400).json({ message: 'Invalid card number' });
  }

  if (cvc.length < 3 || cvc.length > 4) {
    return res.status(400).json({ message: 'Invalid CVC' });
  }

  try {
    // Find the booking
    const booking = await Booking.findById(bookingId).populate('service');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if payment is already completed
    if (booking.paymentStatus === 'Completed') {
      return res.status(400).json({ message: 'Payment already completed for this booking' });
    }

    // Simulate payment processing (this could later be replaced with a real service e.g., Stripe)
    // For demo purposes, we'll simulate a 95% success rate
    const isPaymentSuccessful = Math.random() > 0.05; // 95% success rate
    const simulatedTransactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);

    if (isPaymentSuccessful) {
      booking.paymentStatus = 'Completed';
      booking.transactionId = simulatedTransactionId;
      booking.paymentDate = new Date();
      booking.status = 'confirmed'; // Update booking status to confirmed after payment
      await booking.save();

      // TODO: Trigger notification service here
      // const notificationService = require('../services/notificationService');
      // await notificationService.sendBookingConfirmation(booking);

      return res.status(200).json({ 
        message: 'Payment processed successfully', 
        transactionId: simulatedTransactionId,
        booking: {
          id: booking._id,
          service: booking.service.name,
          date: booking.date,
          time: booking.time,
          stylist: booking.stylist,
          paymentStatus: booking.paymentStatus,
          status: booking.status
        }
      });
    } else {
      booking.paymentStatus = 'Failed';
      await booking.save();
      return res.status(400).json({ message: 'Payment failed. Please try again or use a different payment method.' });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({ message: 'Server error processing payment' });
  }
});

// Get payment status for a booking
router.get('/:bookingId/status', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      paymentStatus: booking.paymentStatus,
      transactionId: booking.transactionId,
      paymentDate: booking.paymentDate
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
