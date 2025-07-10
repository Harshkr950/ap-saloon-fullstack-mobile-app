const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'apsaloon@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

// Twilio configuration (only initialize if credentials are provided)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendBookingConfirmationEmail = async (userEmail, bookingDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'apsaloon@gmail.com',
    to: userEmail,
    subject: 'Booking Confirmation - AP Saloon',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #d4af37; color: white; padding: 20px; text-align: center;">
          <h1>AP SALOON</h1>
          <h2>Booking Confirmation</h2>
        </div>
        
        <div style="padding: 20px; background-color: #f8f8f8;">
          <h3>Dear ${bookingDetails.customerName},</h3>
          <p>Your appointment has been confirmed! Here are the details:</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Service:</strong> ${bookingDetails.serviceName}</p>
            <p><strong>Date:</strong> ${bookingDetails.date}</p>
            <p><strong>Time:</strong> ${bookingDetails.time}</p>
            <p><strong>Stylist:</strong> ${bookingDetails.stylist}</p>
            <p><strong>Price:</strong> ₹${bookingDetails.price}</p>
          </div>
          
          <p>Please arrive 10 minutes before your appointment time.</p>
          <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <p><strong>Contact Information:</strong></p>
            <p>Phone: +91 98765 43210</p>
            <p>Email: info@apsaloon.com</p>
          </div>
          
          <p>Thank you for choosing AP Saloon!</p>
        </div>
        
        <div style="background-color: #333; color: white; padding: 10px; text-align: center;">
          <p>&copy; 2024 AP Saloon. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

const sendBookingConfirmationSMS = async (phoneNumber, bookingDetails) => {
  if (!twilioClient) {
    console.log('Twilio not configured, skipping SMS');
    return { success: false, error: 'Twilio not configured' };
  }

  const message = `
AP Saloon Booking Confirmed!
Service: ${bookingDetails.serviceName}
Date: ${bookingDetails.date}
Time: ${bookingDetails.time}
Stylist: ${bookingDetails.stylist}
Price: ₹${bookingDetails.price}

Please arrive 10 minutes early.
Contact: +91 98765 43210
  `.trim();

  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
      to: phoneNumber,
    });
    console.log('Booking confirmation SMS sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error.message };
  }
};

const sendBookingStatusUpdate = async (userEmail, phoneNumber, bookingDetails, newStatus) => {
  const statusMessages = {
    confirmed: 'Your booking has been confirmed!',
    cancelled: 'Your booking has been cancelled.',
    completed: 'Thank you for visiting AP Saloon! We hope you enjoyed your service.',
  };

  const message = statusMessages[newStatus] || 'Your booking status has been updated.';

  // Send email update
  const emailOptions = {
    from: process.env.EMAIL_USER || 'apsaloon@gmail.com',
    to: userEmail,
    subject: `Booking Update - AP Saloon`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #d4af37; color: white; padding: 20px; text-align: center;">
          <h1>AP SALOON</h1>
          <h2>Booking Update</h2>
        </div>
        
        <div style="padding: 20px; background-color: #f8f8f8;">
          <h3>${message}</h3>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Service:</strong> ${bookingDetails.serviceName}</p>
            <p><strong>Date:</strong> ${bookingDetails.date}</p>
            <p><strong>Time:</strong> ${bookingDetails.time}</p>
            <p><strong>Status:</strong> ${newStatus.toUpperCase()}</p>
          </div>
          
          <p>If you have any questions, please contact us at +91 98765 43210.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(emailOptions);
    console.log('Status update email sent successfully');
  } catch (error) {
    console.error('Error sending status update email:', error);
  }

  // Send SMS update
  if (twilioClient) {
    const smsMessage = `AP Saloon: ${message} Service: ${bookingDetails.serviceName}, Date: ${bookingDetails.date}, Status: ${newStatus.toUpperCase()}. Contact: +91 98765 43210`;

    try {
      await twilioClient.messages.create({
        body: smsMessage,
        from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
        to: phoneNumber,
      });
      console.log('Status update SMS sent successfully');
    } catch (error) {
      console.error('Error sending status update SMS:', error);
    }
  } else {
    console.log('Twilio not configured, skipping SMS update');
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingConfirmationSMS,
  sendBookingStatusUpdate,
};
