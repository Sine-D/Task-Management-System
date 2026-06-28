const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      console.log('Seeding predefined admin user...');
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'AdminPassword123!',
        role: 'Admin',
      });
      console.log('Admin user seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};

module.exports = seedAdmin;
