// ================================
// SEED DATA SCRIPT
// backend/scripts/seedData.js
// Run: node backend/scripts/seedData.js
// ================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    console.log('🗑️  Old data cleared');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash('password123', salt);

    // ================================
    // USERS
    // ================================
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@fourwheels.pk',
        password: hashedPass,
        role: 'admin',
        city: 'Lahore',
        phone: '0300-1234567',
      },
      {
        name: 'Ahmed Seller',
        email: 'ahmed@fourwheels.pk',
        password: hashedPass,
        role: 'seller',
        city: 'Karachi',
        phone: '0321-9876543',
      },
      {
        name: 'Sara Seller',
        email: 'sara@fourwheels.pk',
        password: hashedPass,
        role: 'seller',
        city: 'Islamabad',
        phone: '0333-5555555',
      },
      {
        name: 'Ali Buyer',
        email: 'ali@fourwheels.pk',
        password: hashedPass,
        role: 'buyer',
        city: 'Lahore',
        phone: '0311-1111111',
      },
    ]);

    console.log(`👤 ${users.length} users created`);

    const seller1 = users[1]._id;
    const seller2 = users[2]._id;

    // ================================
    // VEHICLES
    // ================================
    const vehicles = await Vehicle.insertMany([
      {
        title: 'Toyota Corolla 2021 GLi',
        description: 'Excellent condition Toyota Corolla GLi 2021. Single owner, original paint, all documents clear. Engine and gearbox in perfect condition. AC works perfectly. New tyres installed. Ready for transfer.',
        price: 4200000,
        city: 'Lahore',
        category: 'car',
        images: [],
        seller: seller1,
        status: 'approved',
        views: 142,
      },
      {
        title: 'Honda City 2020 Aspire',
        description: 'Well-maintained Honda City Aspire 2020. Company maintained, all original parts. Push start, back camera, cruise control. Mileage 38,000 km only. Non-accident vehicle.',
        price: 3800000,
        city: 'Karachi',
        category: 'car',
        images: [],
        seller: seller1,
        status: 'approved',
        views: 98,
      },
      {
        title: 'Suzuki Alto VXR 2022',
        description: 'Brand new condition Suzuki Alto VXR 2022. Only 12,000 km driven. Keyless entry, power windows, airbags. Perfect for city use. First owner, no accidents. Available for immediate transfer.',
        price: 2100000,
        city: 'Islamabad',
        category: 'car',
        images: [],
        seller: seller2,
        status: 'approved',
        views: 215,
      },
      {
        title: 'Honda CD 70 2023',
        description: 'Honda CD 70 2023 model, 100% genuine. Mileage 8,000 km only. Engine mint condition, no repair history. All genuine parts. Registration done. Best for daily commute and fuel efficiency.',
        price: 145000,
        city: 'Lahore',
        category: 'bike',
        images: [],
        seller: seller1,
        status: 'approved',
        views: 67,
      },
      {
        title: 'Yamaha YBR 125G 2022',
        description: 'Yamaha YBR 125G 2022 model. Excellent offroad and city bike. Self-start, disc brakes, digital meter. Only 25,000 km run. All paperwork complete. Price slightly negotiable.',
        price: 310000,
        city: 'Rawalpindi',
        category: 'bike',
        images: [],
        seller: seller2,
        status: 'approved',
        views: 54,
      },
      {
        title: 'Isuzu D-Max 2019',
        description: 'Isuzu D-Max 2019, double cabin pickup truck. 4x4 turbo diesel engine. Heavy duty cargo capacity. Used for construction purposes. Well-maintained, diesel engine serviced recently. All documents complete.',
        price: 6500000,
        city: 'Faisalabad',
        category: 'truck',
        images: [],
        seller: seller1,
        status: 'approved',
        views: 31,
      },
      {
        title: 'Toyota Fortuner 2020 Sigma 4',
        description: 'Toyota Fortuner Sigma 4 2020, 2800cc diesel. 4x4 drive system, sunroof, leather seats. Mileage 65,000 km. Company maintained, full service history available. Immaculate condition inside and out.',
        price: 9800000,
        city: 'Karachi',
        category: 'car',
        images: [],
        seller: seller2,
        status: 'approved',
        views: 187,
      },
      {
        title: 'Suzuki Mehran VX 2019',
        description: 'Suzuki Mehran VX 2019, running condition. Good for learners and city use. AC installed (non-genuine). Minor scratches on body, engine fully OK. Token paid. Budget car at best price.',
        price: 780000,
        city: 'Multan',
        category: 'car',
        images: [],
        seller: seller1,
        status: 'approved',
        views: 423,
      },
      {
        title: 'Honda 125 CG Deluxe 2023',
        description: 'Honda 125 CG Deluxe 2023, latest model. Self-start, alloy rims, digital speedometer. Only 5,000 km. Showroom condition. Full genuine, first owner. Best economical bike available.',
        price: 220000,
        city: 'Sialkot',
        category: 'bike',
        images: [],
        seller: seller2,
        status: 'approved',
        views: 89,
      },
      {
        title: 'Hino Dutro Truck 2018',
        description: 'Hino Dutro mini truck 2018. 3 ton cargo capacity. Diesel engine, excellent fuel consumption. Used for goods delivery. Engine fully overhauled 6 months ago. Tyres 70%. Documents complete.',
        price: 3200000,
        city: 'Gujranwala',
        category: 'truck',
        images: [],
        seller: seller1,
        status: 'approved',
        views: 19,
      },
    ]);

    console.log(`🚗 ${vehicles.length} vehicles created`);

    console.log('\n========================================');
    console.log('✅ Seed data inserted successfully!');
    console.log('========================================');
    console.log('\n📧 Test Accounts:');
    console.log('  Admin  → admin@fourwheels.pk   / password123');
    console.log('  Seller → ahmed@fourwheels.pk   / password123');
    console.log('  Seller → sara@fourwheels.pk    / password123');
    console.log('  Buyer  → ali@fourwheels.pk     / password123');
    console.log('\n🚗 10 sample vehicles inserted (all approved)');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
