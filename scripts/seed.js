// backend/scripts/seed.js
import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node.URL';

// Resolve project root so relative imports work regardless of CWD
const __filename = fileURLToPath(import.meta.URL);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// Import models (ESM paths)
const Place = (await import(path.join(root, 'models/Place.js'))).default;
const Activity = (await import(path.join(root, 'models/Activity.js'))).default;

// ---- Settings ----
const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/tour-guide';
const CITY = process.env.SEED_CITY || 'Kolkata';
const COUNTRY = process.env.SEED_COUNTRY || 'India';

// Build a stable placeholder image (picsum)
const slug = (s) => encodeURIComponent(String(s).toLowerCase().replace(/\s+/g, '-').slice(0, 60));
const pic = (seed, w = 1200, h = 800) => `https://picsum.photos/seed/${slug(seed)}/${w}/${h}`;

// ---- Data ----
const PLACES = [
  { name: 'Victoria Memorial', category: 'cultural' },
  { name: 'Howrah Bridge', category: 'cultural' },
  { name: 'Prinsep Ghat', category: 'nature' },
  { name: 'Marble Palace', category: 'art' },
  { name: 'Jorasanko Thakur Bari', category: 'cultural' },
  { name: 'Indian Museum', category: 'art' },
  { name: 'Metropolitan Building', category: 'cultural' },
  { name: 'St. Paul’s Cathedral', category: 'cultural' },
  { name: 'Town Hall', category: 'cultural' },
  { name: 'Writers’ Building', category: 'cultural' },
  { name: 'Dakshineswar Kali Temple', category: 'spiritual' },
  { name: 'Belur Math', category: 'spiritual' },
  { name: 'Kalighat Temple', category: 'spiritual' },
  { name: 'Pareshnath Jain Temple', category: 'spiritual' },
  { name: 'Armenian Church of Nazareth', category: 'spiritual' },
  { name: 'Academy of Fine Arts', category: 'art' },
  { name: 'Nandan & Rabindra Sadan', category: 'entertainment' },
  { name: 'Birla Planetarium', category: 'entertainment' },
  { name: 'Science City', category: 'entertainment' },
  { name: 'Kolkata Tram Ride', category: 'adventure' },
  { name: 'Maidan', category: 'nature' },
  { name: 'Botanical Garden (Shibpur)', category: 'nature' },
  { name: 'Alipore Zoo', category: 'nature' },
  { name: 'Eco Park (New Town)', category: 'nature' },
  { name: 'Nicco Park', category: 'entertainment' },
  { name: 'College Street', category: 'cultural' },
  { name: 'New Market', category: 'shopping' },
  { name: 'Park Street', category: 'food' },
  { name: 'Burrabazar', category: 'shopping' },
  { name: 'Chinatown (Tiretta Bazaar & Tangra)', category: 'food' },
];

// Each activity optionally references a place by name; we’ll resolve to placeId
const ACTIVITIES = [
  { title: 'Victoria Memorial Heritage Walk', category: 'cultural', price: 699,  durationMinutes: 90,  placeName: 'Victoria Memorial' },
  { title: 'Howrah Bridge Sunrise Photo Tour', category: 'cultural', price: 599,  durationMinutes: 75,  placeName: 'Howrah Bridge' },
  { title: 'Prinsep Ghat Sunset Boat Ride', category: 'nature',   price: 899,  durationMinutes: 60,  placeName: 'Prinsep Ghat' },
  { title: 'Marble Palace Art & Architecture Tour', category: 'art', price: 799, durationMinutes: 80, placeName: 'Marble Palace' },
  { title: 'College Street Book-Hunting with Chai', category: 'cultural', price: 499, durationMinutes: 90, placeName: 'College Street' },
  { title: 'Park Street Food Crawl', category: 'food', price: 999, durationMinutes: 120, placeName: 'Park Street' },
  { title: 'Kolkata Tram Heritage Ride', category: 'adventure', price: 399, durationMinutes: 45, placeName: 'Kolkata Tram Ride' },
  { title: 'Belur Math Spiritual Evening Aarti', category: 'spiritual', price: 549, durationMinutes: 60, placeName: 'Belur Math' },
  { title: 'Dakshineswar Temple Morning Darshan', category: 'spiritual', price: 549, durationMinutes: 60, placeName: 'Dakshineswar Kali Temple' },
  { title: 'Eco Park Cycling Loop', category: 'nature', price: 399, durationMinutes: 60, placeName: 'Eco Park (New Town)' },
  { title: 'Science City Curious Minds Tour', category: 'entertainment', price: 699, durationMinutes: 90, placeName: 'Science City' },
  { title: 'New Market Old-World Shopping Tour', category: 'shopping', price: 499, durationMinutes: 90, placeName: 'New Market' },
];

// ---- Seed helpers ----
async function upsertPlace(p) {
  const filter = {
    $and: [
      { $or: [{ title: p.name }, { name: p.name }] },
      { 'location.city': new RegExp(`^${CITY}$`, 'i') },
    ],
  };

  const doc = {
    title: p.name,
    name: p.name,
    description: `${p.name} — ${p.category} spot in ${CITY}.`,
    category: p.category,
    tags: [p.category, CITY, 'West Bengal', 'India'],
    location: { city: CITY, country: COUNTRY },
    images: [pic(p.name)],
    featured: true,
    approved: true,
    rating: { avg: 4.6, count: 12 },
  };

  const res = await Place.findOneAndUpdate(filter, { $set: doc }, { upsert: true, new: true, setDefaultsOnInsert: true });
  return res;
}

async function upsertActivity(a, placeId) {
  const filter = {
    $and: [
      { title: a.title },
      { 'location.city': new RegExp(`^${CITY}$`, 'i') },
    ],
  };

  const price = Number(a.price) || 0;

  const doc = {
    title: a.title,
    description: `${a.title} — guided experience in ${CITY}.`,
    category: a.category,
    tags: [a.category, CITY, 'Experience'],
    price,
    basePrice: price,
    capacity: 10,
    durationMinutes: a.durationMinutes || undefined,
    location: { city: CITY, country: COUNTRY },
    images: [pic(a.title)],
    featured: true,
    isPublished: true,
    placeId: placeId || undefined,
    rating: { avg: 4.7, count: 8 },
  };

  const res = await Activity.findOneAndUpdate(filter, { $set: doc }, { upsert: true, new: true, setDefaultsOnInsert: true });
  return res;
}

// ---- Main runner ----
async function run() {
  const reset = process.argv.includes('--reset') || process.argv.includes('--drop');

  console.log('⏳ Connecting MongoDB:', MONGO_URL);
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGO_URL, { autoIndex: true });
  console.log('✅ Connected');

  if (reset) {
    console.log('⚠️  Dropping current data (places, activities)…');
    await Activity.deleteMany({ 'location.city': new RegExp(`^${CITY}$`, 'i') });
    await Place.deleteMany({ 'location.city': new RegExp(`^${CITY}$`, 'i') });
  }

  // Ensure indexes (so search/filters are fast)
  await Place.syncIndexes();
  await Activity.syncIndexes();

  // Seed Places
  let placeCreated = 0, placeTouched = 0;
  const placeMap = new Map(); // name -> _id
  for (const p of PLACES) {
    const before = await Place.findOne({ $and: [{ $or: [{ title: p.name }, { name: p.name }] }, { 'location.city': new RegExp(`^${CITY}$`, 'i') }] }).lean();
    const res = await upsertPlace(p);
    if (before) placeTouched++; else placeCreated++;
    placeMap.set(p.name, res._id.toString());
  }

  // Seed Activities (link to placeId by name when possible)
  let actCreated = 0, actTouched = 0;
  for (const a of ACTIVITIES) {
    const before = await Activity.findOne({ $and: [{ title: a.title }, { 'location.city': new RegExp(`^${CITY}$`, 'i') }] }).lean();
    const pid = a.placeName ? placeMap.get(a.placeName) : undefined;
    await upsertActivity(a, pid);
    if (before) actTouched++; else actCreated++;
  }

  console.log('🎉 Seed complete');
  console.table([
    { collection: 'places', created: placeCreated, updated: placeTouched, city: CITY },
    { collection: 'activities', created: actCreated, updated: actTouched, city: CITY },
  ]);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (err) => {
  console.error('❌ Seed failed:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
