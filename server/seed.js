const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Temple = require('./models/Temple');
const DarshanSlot = require('./models/DarshanSlot');

const temples = [
    {
        name: 'Siddhivinayak Temple',
        description: 'Shree Siddhivinayak Ganapati Mandir is a Hindu temple dedicated to Lord Ganesha. It is located in Prabhadevi, Mumbai, Maharashtra. It is one of the richest temples in Mumbai and most visited religious sites in Maharashtra.',
        location: { city: 'Mumbai', state: 'Maharashtra', address: 'SK Bole Marg, Prabhadevi, Mumbai - 400028' },
        images: [
              "/my-temple.png",
              "/my-temple2.png",
        ],
        deity: 'Lord Ganesha',
        category: 'Hindu',
        openTime: '05:30',
        closeTime: '22:00',
        entryFee: 25,
        specialDarshanFee: 250,
        rating: 4.8,
        reviewCount: 12500,
        facilities: ['Prasad Shop', 'Locker Facility', 'Wheelchair Access', 'Parking'],
    },
    {
        name: 'Tirupati Balaji Temple',
        description: 'Tirumala Venkateswara Temple is a vaishnavite temple situated in Tirumala, Tirupati. It is dedicated to Venkateswara, a form of Vishnu. The temple is believed to be the richest temple in the world in terms of donations received.',
        location: { city: 'Tirupati', state: 'Andhra Pradesh', address: 'Tirumala, Tirupati - 517504' },
        images: [
            "/my-temple3.png",
            "/my-temple1.jpg",
        ],
        deity: 'Lord Venkateswara',
        category: 'Hindu',
        openTime: '03:00',
        closeTime: '23:00',
        entryFee: 0,
        specialDarshanFee: 300,
        rating: 4.9,
        reviewCount: 85000,
        facilities: ['Prasad Shop', 'Accommodation', 'Kalyan Katta', 'E-Darshan', 'Parking'],
    },
    {
        name: 'Kashi Vishwanath Temple',
        description: 'Kashi Vishwanath Temple is a famous Hindu temple dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh, India. It is one of the twelve Jyotirlingas, the holiest of Shiva temples.',
        location: { city: 'Varanasi', state: 'Uttar Pradesh', address: 'Lahori Tola, Varanasi - 221001' },
        images: [
            "/my-temple4.png",
            "/my-temple5.png",
            "/my-temple6.png",
        ],
        deity: 'Lord Shiva',
        category: 'Hindu',
        openTime: '04:00',
        closeTime: '23:00',
        entryFee: 0,
        specialDarshanFee: 100,
        rating: 4.9,
        reviewCount: 45000,
        facilities: ['Prasad Shop', 'Security Lockers', 'Guide Service', 'Aarti Schedule'],
    },
    {
        name: 'Vaishno Devi Temple',
        description: 'Vaishno Devi Temple is a Hindu temple dedicated to the Hindu goddess Vaishno Devi, and is one of the 108 Shakti Peethas of the goddess Shakti. The cave shrine is located at an elevation of 5,200 feet in the Trikuta Mountains.',
        location: { city: 'Katra', state: 'Jammu & Kashmir', address: 'Trikuta Hills, Katra - 182301' },
        images: [
            "/my-temple7.png",
            "/my-temple8.png",
        ],
        deity: 'Mata Vaishno Devi',
        category: 'Hindu',
        openTime: '05:00',
        closeTime: '22:00',
        entryFee: 100,
        specialDarshanFee: 500,
        rating: 4.8,
        reviewCount: 67000,
        facilities: ['Helicotper Service', 'Battery Cars', 'Prasad Shop', 'Accommodation', 'Medical Aid'],
    },
    {
        name: 'Meenakshi Amman Temple',
        description: 'Meenakshi Amman Temple is a historic Hindu temple located on the southern bank of Vaigai River in Madurai, Tamil Nadu. It is dedicated to Parvati (known as Meenakshi) and her consort, Shiva (known as Sundareswarar).',
        location: { city: 'Madurai', state: 'Tamil Nadu', address: 'Madurai Main, Madurai - 625001' },
        images: [
            "/my-temple9.jpg",
            "/my-temple10.jpg",
        ],
        deity: 'Goddess Meenakshi',
        category: 'Hindu',
        openTime: '05:00',
        closeTime: '21:30',
        entryFee: 50,
        specialDarshanFee: 200,
        rating: 4.7,
        reviewCount: 38000,
        facilities: ['Museum', 'Prasad Shop', 'Guide Service', 'Photography Permitted'],
    },
    {
        name: 'Somnath Temple',
        description: 'Somnath temple is a Hindu temple located in Prabhas Patan, near Veraval in Saurashtra, Gujarat. It is one of the most sacred pilgrimage sites in Hinduism and the first among the twelve Jyotirlinga shrines of Lord Shiva.',
        location: { city: 'Veraval', state: 'Gujarat', address: 'Triveni Sangam, Prabhas Patan, Veraval - 362268' },
        images: [
            "/my-temple11.jpg",
        ],
        deity: 'Lord Shiva',
        category: 'Hindu',
        openTime: '06:00',
        closeTime: '22:00',
        entryFee: 0,
        specialDarshanFee: 150,
        rating: 4.7,
        reviewCount: 29000,
        facilities: ['Light & Sound Show', 'Beach View', 'Prasad Shop', 'Parking'],
    },
    {
        name: 'Jagannath Temple',
        description: 'The Jagannath Temple is an important Hindu temple dedicated to Jagannath, a form of Vishnu, in Puri in the state of Odisha on the eastern coast of India. The temple is famous for its annual Ratha Yatra.',
        location: { city: 'Puri', state: 'Odisha', address: 'Grand Road, Puri - 752001' },
        images: [
            "/my-temple12.png",
            "/my-temple13.png",
        ],
        deity: 'Lord Jagannath',
        category: 'Hindu',
        openTime: '05:00',
        closeTime: '23:00',
        entryFee: 0,
        specialDarshanFee: 200,
        rating: 4.8,
        reviewCount: 34000,
        facilities: ['Mahaprasad Hall', 'Locker Facility', 'Shoe Stand', 'Restrooms'],
    },
    {
        name: 'Golden Temple',
        description: 'Sri Harmandir Sahib, also known as the Golden Temple, is the holiest Gurdwara and the most important pilgrimage site of Sikhism, located in the city of Amritsar, Punjab, India.',
        location: { city: 'Amritsar', state: 'Punjab', address: 'Golden Temple Road, Amritsar - 143006' },
        images: [
            "/my-temple14.png",
        ],
        deity: 'Guru Granth Sahib',
        category: 'Sikh',
        openTime: '04:00',
        closeTime: '23:45',
        entryFee: 0,
        specialDarshanFee: 0,
        rating: 4.9,
        reviewCount: 92000,
        facilities: ['Langar Hall', 'Accommodation', 'Information Center', 'Locker Rooms'],
    },
    {
        name: 'Kedarnath Temple',
        description: 'Kedarnath Temple is a Hindu temple dedicated to Shiva. Located on the Garhwal Himalayan range near the Mandakini river, Kedarnath is located in the state of Uttarakhand, India.',
        location: { city: 'Kedarnath', state: 'Uttarakhand', address: 'Rudraprayag District, Kedarnath - 246445' },
        images: [
            "/my-temple15.png",
            "/my-temple16.png",
        ],
        deity: 'Lord Shiva',
        category: 'Hindu',
        openTime: '04:00',
        closeTime: '21:00',
        entryFee: 0,
        specialDarshanFee: 300,
        rating: 4.9,
        reviewCount: 51000,
        facilities: ['Medical Aid', 'Helipad Access', 'Pony/Palki Booking', 'Accommodation'],
    },
    {
        name: 'Konark Sun Temple',
        description: 'The Konark Sun Temple is a 13th-century CE Sun temple at Konark in the state of Odisha, India. Shaped like a monumental chariot for the Sun God, Surya, it features 24 intricately carved stone wheels and is recognized as a UNESCO World Heritage Site.',
        location: { city: 'Konark', state: 'Odisha', address: 'Konark, Puri District, Odisha - 752110' },
        images: [
            "/my-temple17.png",
            "/my-temple18.png",
        ],
        deity: 'Lord Surya',
        category: 'Hindu',
        openTime: '06:00',
        closeTime: '20:00',
        entryFee: 40,
        specialDarshanFee: 0,
        rating: 4.8,
        reviewCount: 31000,
        facilities: ['Guide Service', 'Drinking Water', 'Garden Park', 'Information Desk'],
    },
    {
        name: 'Brihadeeswara Temple',
        description: 'Brihadishvara Temple, also called Rajarajesvaram, is an iconic Hindu temple dedicated to Lord Shiva located on the south bank of the Cauvery river in Thanjavur, Tamil Nadu. Built by Chola king Raja Raja Chola I, it is one of the largest temples in India and a supreme example of Dravidian architecture.',
        location: { city: 'Thanjavur', state: 'Tamil Nadu', address: 'Membalam Rd, Balaganpathy Nagar, Thanjavur - 613007' },
        images: [
            "/my-temple19.png",
            "/my-temple20.png",
        ],
        deity: 'Lord Shiva',
        category: 'Hindu',
        openTime: '06:00',
        closeTime: '21:00',
        entryFee: 0,
        specialDarshanFee: 150,
        rating: 4.9,
        reviewCount: 42000,
        facilities: ['Museum', 'Prasad Counter', 'Shoe Stand', 'Restrooms'],
    },
    {
        name: 'Sri Kukkuteswara Swamy Temple',
        description: 'Sri Kukkuteswara Swamy Temple is an ancient and highly sacred Hindu temple complex located in Pithapuram, Andhra Pradesh. Dedicated to Lord Shiva as Kukkuteswara Swamy, it features a self-manifested Swayambhu Linga and encompasses the holy Puruhutika Devi shrine, which is recognized as one of the Ashta Dasa Shakti Peethas.',
        location: { city: 'Pithapuram', state: 'Andhra Pradesh', address: 'Upamaka Road, Pithapuram, East Godavari - 533450' },
        images: [
            "/my-temple21.png",
            "/my-temple22.png",
        ],
        deity: 'Lord Kukkuteswara Swamy',
        category: 'Hindu',
        openTime: '05:30',
        closeTime: '21:00',
        entryFee: 0,
        specialDarshanFee: 100,
        rating: 4.7,
        reviewCount: 8500,
        facilities: ['Annadanam Hall', 'Prasad Shop', 'Locker Facility', 'Kalyana Mandapam'],
    }
];

const generateSlots = (templeId, days = 14) => {
    const slots = [];
    const slotTypes = [
        { type: 'General', times: [['06:00', '07:30'], ['08:00', '09:30'], ['10:00', '11:30'], ['15:00', '16:30'], ['17:00', '18:30']], capacity: 50, price: 50 },
        { type: 'VIP', times: [['07:30', '08:00'], ['09:30', '10:00'], ['16:30', '17:00']], capacity: 20, price: 250 },
        { type: 'Special Pooja', times: [['05:30', '06:00'], ['19:00', '20:00']], capacity: 10, price: 500 },
    ];

    for (let d = 0; d < days; d++) {
        const date = new Date();
        date.setDate(date.getDate() + d);
        date.setHours(0, 0, 0, 0);

        slotTypes.forEach(({ type, times, capacity, price }) => {
            times.forEach(([startTime, endTime]) => {
                slots.push({
                    temple: templeId,
                    date,
                    startTime,
                    endTime,
                    totalCapacity: capacity,
                    bookedCount: 0,
                    price,
                    slotType: type,
                });
            });
        });
    }
    return slots;
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Temple.deleteMany({});
        await DarshanSlot.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@darshan.com',
            password: 'Admin@123',
            role: 'ADMIN',
            phone: '9999999999',
        });
        console.log('👤 Admin created: admin@darshan.com / Admin@123');

        // Create organizer
        await User.create({
            name: 'Organizer',
            email: 'organizer@darshan.com',
            password: 'Org@123',
            role: 'ORGANIZER',
            phone: '8888888888',
        });

        // Create test user
        await User.create({
            name: 'Test User',
            email: 'user@darshan.com',
            password: 'User@123',
            role: 'USER',
            phone: '7777777777',
        });
        console.log('👤 Test user: user@darshan.com / User@123');

        // Create temples
        const createdTemples = await Temple.insertMany(
            temples.map((t) => ({ ...t, createdBy: adminUser._id }))
        );
        console.log(`⛩️  Created ${createdTemples.length} temples`);

        // Create slots for each temple
        let totalSlots = 0;
        for (const temple of createdTemples) {
            const slots = generateSlots(temple._id);
            await DarshanSlot.insertMany(slots);
            totalSlots += slots.length;
        }
        console.log(`🕐 Created ${totalSlots} darshan slots`);

        console.log('\n✅ Database seeded successfully!');
        console.log('📋 Login credentials:');
        console.log('   ADMIN:     admin@darshan.com     / Admin@123');
        console.log('   ORGANIZER: organizer@darshan.com / Org@123');
        console.log('   USER:      user@darshan.com      / User@123');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
};

seed();
