const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Service = require('../models/Service');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apsaloon', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@apsaloon.com',
      phone: '+91 98765 43210',
      passwordHash: adminPasswordHash,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created');

    // Create sample services
    const services = [
      // Hair Services
      {
        name: 'Classic Haircut',
        category: 'Hair',
        price: 1200,
        durationMinutes: 45,
        description: 'Professional haircut with styling',
      },
      {
        name: 'Premium Styling',
        category: 'Hair',
        price: 1800,
        durationMinutes: 60,
        description: 'Advanced styling with premium products',
      },
      {
        name: 'Hair Wash & Blow Dry',
        category: 'Hair',
        price: 800,
        durationMinutes: 30,
        description: 'Deep cleansing and professional blow dry',
      },
      {
        name: 'Hair Treatment',
        category: 'Hair',
        price: 2500,
        durationMinutes: 90,
        description: 'Nourishing hair treatment for damaged hair',
      },

      // Color Services
      {
        name: 'Full Hair Color',
        category: 'Color',
        price: 3500,
        durationMinutes: 120,
        description: 'Complete hair coloring with premium dyes',
      },
      {
        name: 'Highlights',
        category: 'Color',
        price: 2800,
        durationMinutes: 90,
        description: 'Professional highlights for a stunning look',
      },
      {
        name: 'Root Touch-up',
        category: 'Color',
        price: 1500,
        durationMinutes: 60,
        description: 'Root color touch-up service',
      },
      {
        name: 'Balayage',
        category: 'Color',
        price: 4500,
        durationMinutes: 150,
        description: 'Hand-painted highlights for natural look',
      },

      // Spa Services
      {
        name: 'Relaxing Massage',
        category: 'Spa',
        price: 2000,
        durationMinutes: 60,
        description: 'Full body relaxing massage',
      },
      {
        name: 'Aromatherapy',
        category: 'Spa',
        price: 2500,
        durationMinutes: 75,
        description: 'Therapeutic aromatherapy session',
      },
      {
        name: 'Hot Stone Therapy',
        category: 'Spa',
        price: 3000,
        durationMinutes: 90,
        description: 'Relaxing hot stone massage',
      },
      {
        name: 'Body Scrub',
        category: 'Spa',
        price: 1800,
        durationMinutes: 45,
        description: 'Exfoliating body scrub treatment',
      },

      // Bridal Services
      {
        name: 'Bridal Makeup',
        category: 'Bridal',
        price: 8000,
        durationMinutes: 180,
        description: 'Complete bridal makeup package',
      },
      {
        name: 'Pre-Bridal Package',
        category: 'Bridal',
        price: 15000,
        durationMinutes: 300,
        description: 'Complete pre-bridal beauty package',
      },
      {
        name: 'Bridal Hair Styling',
        category: 'Bridal',
        price: 3500,
        durationMinutes: 120,
        description: 'Professional bridal hair styling',
      },
      {
        name: 'Mehendi Design',
        category: 'Bridal',
        price: 2500,
        durationMinutes: 90,
        description: 'Traditional mehendi application',
      },

      // Nail Services
      {
        name: 'Classic Manicure',
        category: 'Nails',
        price: 800,
        durationMinutes: 45,
        description: 'Basic manicure with nail polish',
      },
      {
        name: 'Gel Manicure',
        category: 'Nails',
        price: 1200,
        durationMinutes: 60,
        description: 'Long-lasting gel manicure',
      },
      {
        name: 'Pedicure',
        category: 'Nails',
        price: 1000,
        durationMinutes: 60,
        description: 'Relaxing pedicure treatment',
      },
      {
        name: 'Nail Art',
        category: 'Nails',
        price: 1500,
        durationMinutes: 75,
        description: 'Creative nail art designs',
      },

      // Facial Services
      {
        name: 'Classic Facial',
        category: 'Facial',
        price: 1500,
        durationMinutes: 60,
        description: 'Deep cleansing facial treatment',
      },
      {
        name: 'Anti-Aging Facial',
        category: 'Facial',
        price: 2500,
        durationMinutes: 75,
        description: 'Advanced anti-aging treatment',
      },
      {
        name: 'Hydrating Facial',
        category: 'Facial',
        price: 2000,
        durationMinutes: 60,
        description: 'Moisturizing facial for dry skin',
      },
      {
        name: 'Acne Treatment',
        category: 'Facial',
        price: 1800,
        durationMinutes: 60,
        description: 'Specialized acne treatment facial',
      },
    ];

    await Service.insertMany(services);
    console.log('Services created');

    console.log('Database seeded successfully!');
    console.log('Admin credentials: admin@apsaloon.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
