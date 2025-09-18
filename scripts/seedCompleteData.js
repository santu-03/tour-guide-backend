// scripts/seedCompleteData.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Place } from '../models/Place.js';
import { Activity } from '../models/Activity.js';
import { User }   from '../models/User.js';
import { Booking } from '../models/Booking.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO = process.env.MONGO_URL;
if (!MONGO) {
  console.error('❌ MONGO_URL missing in .env');
  process.exit(1);
}

// -------------------- Sample Data --------------------
// NOTE: 'location' is set as GeoJSON Point. city/country remain at root.
const PLACES = [
  { id: '1', name: 'Victoria Memorial', category: 'cultural', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Iconic marble building and museum dedicated to Queen Victoria' },
  { id: '2', name: 'Howrah Bridge', category: 'cultural', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41'], description: 'Famous cantilever bridge over Hooghly River' },
  { id: '3', name: 'Prinsep Ghat', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Scenic riverside ghat with colonial architecture' },
  { id: '4', name: 'Marble Palace', category: 'art', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Neoclassical mansion with art collection' },
  { id: '5', name: 'Jorasanko Thakur Bari', category: 'cultural', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Birthplace of Rabindranath Tagore' },
  { id: '6', name: 'Indian Museum', category: 'art', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Oldest and largest museum in India' },
  { id: '7', name: 'Dakshineswar Kali Temple', category: 'spiritual', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Hindu temple dedicated to Goddess Kali' },
  { id: '8', name: 'Belur Math', category: 'spiritual', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Headquarters of Ramakrishna Mission' },
  { id: '9', name: 'College Street', category: 'cultural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Famous street of books and educational institutions' },
  { id: '10', name: 'Park Street', category: 'food', city: 'Kolkata', country: 'India', featured: true, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Popular street for restaurants and nightlife' },
  { id: '11', name: 'Metropolitan Building', category: 'cultural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Historic colonial-era building' },
  { id: '12', name: 'St. Paul\'s Cathedral', category: 'cultural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Anglican cathedral with Gothic architecture' },
  { id: '13', name: 'Town Hall', category: 'cultural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Historic building in Greek Revival style' },
  { id: '14', name: 'Writers\' Building', category: 'cultural', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Former office of the Chief Minister of West Bengal' },
  { id: '15', name: 'Kalighat Temple', category: 'spiritual', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Hindu temple dedicated to Goddess Kali' },
  { id: '16', name: 'Pareshnath Jain Temple', category: 'spiritual', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Beautiful Jain temple with intricate glasswork' },
  { id: '17', name: 'Armenian Church of Nazareth', category: 'spiritual', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Oldest Armenian church in Kolkata' },
  { id: '18', name: 'Academy of Fine Arts', category: 'art', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Premier art institution in Kolkata' },
  { id: '19', name: 'Nandan & Rabindra Sadan', category: 'entertainment', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Cultural complex for films and performances' },
  { id: '20', name: 'Birla Planetarium', category: 'entertainment', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Largest planetarium in Asia' },
  { id: '21', name: 'Science City', category: 'entertainment', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Science museum and educational center' },
  { id: '22', name: 'Kolkata Tram Ride', category: 'adventure', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Heritage tram ride through the city' },
  { id: '23', name: 'Maidan', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Large urban park in central Kolkata' },
  { id: '24', name: 'Botanical Garden (Shibpur)', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Botanical gardens with the Great Banyan Tree' },
  { id: '25', name: 'Alipore Zoo', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Oldest zoological park in India' },
  { id: '26', name: 'Eco Park (New Town)', category: 'nature', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Urban ecological park with recreational facilities' },
  { id: '27', name: 'Nicco Park', category: 'entertainment', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Amusement park with rides and attractions' },
  { id: '28', name: 'New Market', category: 'shopping', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Historic shopping destination' },
  { id: '29', name: 'Burrabazar', category: 'shopping', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'One of the largest wholesale markets in India' },
  { id: '30', name: 'Chinatown (Tiretta Bazaar & Tangra)', category: 'food', city: 'Kolkata', country: 'India', featured: false, images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'], description: 'Historic Chinese neighborhood with authentic cuisine' },
].map(({ id, category, featured, ...rest }) => ({
  ...rest, // name, city, country, images, description
  location: {
    type: 'Point',
    coordinates: [getRandomLongitude(), getRandomLatitude()], // [lng, lat]
  },
  tags: [category, ...(featured ? ['featured'] : [])],
  isActive: true,
}));

const ACTIVITIES = [
  {
    id: '1',
    title: 'Victoria Memorial Heritage Walk',
    category: 'cultural',
    price: 549,
    durationMinutes: 60,
    placeId: '1', // resolved later to 'place' (ObjectId)
    featured: false,
    isPublished: true,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
    description: 'Heritage Walk at the iconic Victoria Memorial',
  },
  // ...add the remaining activities...
].map(({ id, category, placeId, featured, isPublished, ...rest }) => ({
  ...rest,
  placeId, // keep for mapping to ObjectId later
  tags: [category],
  isActive: isPublished,
  maxGroupSize: 20,
}));

const USERS = [
  { id: '1', name: 'Abir Ghosh',   email: 'Srijon Karmakar',   role: 'guide', createdAt: new Date('2024-04-28'), avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: '2', name: 'Koushik Ghosh', email: 'koushik.ghosh@example.com', role: 'traveller', createdAt: new Date('2024-08-24'), avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
  { id: '2', name: 'Koushik Ghosh', email: 'admin@gmail.com', role: 'admin', createdAt: new Date('2024-08-24'), avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' }
  // ...add the remaining users...
].map(({ id, avatar, createdAt, ...rest }) => ({
  ...rest,
  password: 'admin@123', // will be hashed
  verified: true,
  isActive: true,
  status: 'active',
  avatarUrl: avatar,
}));

// -------------------- Helpers --------------------
function getRandomLongitude() {
  // Kolkata approx: 88.2–88.5
  return 88.2 + Math.random() * 0.3;
}

function getRandomLatitude() {
  // Kolkata approx: 22.45–22.7
  return 22.45 + Math.random() * 0.25;
}

// -------------------- Seed Runner --------------------
async function seedCompleteData() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGO);
  console.log('✅ Connected to MongoDB');

  try {
    // If you recently changed indexes, you can sync them (optional)
    // await Place.syncIndexes();
    // await Activity.syncIndexes();
    // await User.syncIndexes();
    // await Booking.syncIndexes();

    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Place.deleteMany({}),
      Activity.deleteMany({}),
      Booking.deleteMany({}),
    ]);

    // Users
    console.log('👥 Adding users...');
    const createdUsers = [];
    for (const userData of USERS) {
      const hash = await bcrypt.hash(userData.password, 12);
      const user = new User({ ...userData, password: hash });
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Added user: ${user.email} (${user.role})`);
    }

    // Places
    console.log('🏛️ Adding places...');
    const createdPlaces = [];
    const placeMap = new Map(); // old id -> new ObjectId
    for (const placeData of PLACES) {
      const place = new Place(placeData);
      await place.save();
      createdPlaces.push(place);
      // Store mapping by the original numeric string id if present
      if (placeData.id) placeMap.set(placeData.id, place._id);
      console.log(`✅ Added place: ${place.name}`);
    }

    // Activities
    console.log('🎯 Adding activities...');
    const createdActivities = [];
    for (const activityData of ACTIVITIES) {
      const placeObjectId = placeMap.get(activityData.placeId);
      if (!placeObjectId) {
        console.warn(`⚠️  Skipping activity "${activityData.title}" — unknown placeId: ${activityData.placeId}`);
        continue;
      }

      // Ensure images are strings (URLs). Your Activity model uses images: [String]
      const images = Array.isArray(activityData.images)
        ? activityData.images.map(String)
        : [];

      const activity = new Activity({
        title: activityData.title,
        description: activityData.description ?? '',
        category: activityData.category,
        price: Number(activityData.price) || 0,
        durationMinutes: Number(activityData.durationMinutes) || 60,
        place: placeObjectId, // ✅ actual ref field
        featured: !!activityData.featured,
        isPublished: !!activityData.isPublished,
        tags: Array.isArray(activityData.tags) ? activityData.tags : [],
        isActive: activityData.isActive !== false, // default true unless explicitly false
        maxGroupSize: Number(activityData.maxGroupSize) || 20,
        images,
      });

      await activity.save();
      createdActivities.push(activity);
      console.log(`✅ Added activity: ${activity.title}`);
    }

    // Bookings
    console.log('📅 Adding bookings...');
    const bookingStatuses = ['pending', 'confirmed', 'cancelled'];
    for (let i = 0; i < 50; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomActivity = createdActivities[Math.floor(Math.random() * createdActivities.length)];
      if (!randomActivity) break;

      const booking = new Booking({
        user: randomUser._id,
        activity: randomActivity._id,
        date: new Date(Date.now() + i * 3 * 24 * 60 * 60 * 1000),
        peopleCount: Math.floor(Math.random() * 5) + 1,
        status: bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)],
        notes: `Booking for ${randomActivity.title}`,
      });

      await booking.save();
      console.log(`✅ Added booking: ${randomUser.name} -> ${randomActivity.title}`);
    }

    console.log('\n🎉 Complete data seeding finished!');
    console.log('📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Places: ${createdPlaces.length}`);
    console.log(`   Activities: ${createdActivities.length}`);
    console.log(`   Bookings: ${50}`);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedCompleteData();
