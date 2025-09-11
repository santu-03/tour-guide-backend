// scripts/createAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO = process.env.MONGO_URL;
if (!MONGO) {
  console.error('❌ MONGO_URL missing in .env');
  process.exit(1);
}

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@123'; // change later
const ADMIN_NAME = process.env.ADMIN_NAME || 'Super Admin';

const preview = (s) => (typeof s === 'string' ? s.slice(0, 20) + '...' : '—');

async function ensureAdmin() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGO);
  console.log('✅ Connected to MongoDB');

  const flags = {
    role: 'admin',
    verified: true,
    isVerified: true,
    isActive: true,
    status: 'active',
  };

  console.log(`\n🔍 Checking for existing admin with email: ${ADMIN_EMAIL}`);
  let admin = await User.findByEmail(ADMIN_EMAIL); // now exists

  if (!admin) {
    console.log('🆕 Creating admin…');
    admin = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // pre-save will hash
      ...flags,
    });
  } else {
    console.log('⚠️ Admin exists. Updating & resetting password…');
    admin.name = ADMIN_NAME;
    admin.password = ADMIN_PASSWORD; // force reset so login works now
    Object.assign(admin, flags);
  }

  await admin.save();

  // sanity check
  const ok =
    (typeof admin.compare === 'function' && (await admin.compare(ADMIN_PASSWORD))) ||
    (typeof admin.comparePassword === 'function' && (await admin.comparePassword(ADMIN_PASSWORD))) ||
    (typeof admin.matchPassword === 'function' && (await admin.matchPassword(ADMIN_PASSWORD))) ||
    null;

  console.log('\n📊 Final admin:');
  console.log('   ID:', admin._id?.toString());
  console.log('   Email:', admin.email);
  console.log('   Role:', admin.role);
  console.log('   Verified:', admin.verified || admin.isVerified);
  console.log('   Active:', admin.isActive, `(${admin.status})`);
  console.log('   Password Hash:', preview(admin.password));
  console.log('🧪 Password test:', ok === null ? 'ℹ️ no compare method' : ok ? '✅ PASS' : '❌ FAIL');
}

ensureAdmin()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    try { await mongoose.disconnect(); } catch {}
    console.log('🔌 Disconnected from MongoDB');
  });
