// ---------------------------------------------------------------------------
// DATABASE — server-side, file-based (data/db.json)
//
// This is a real persisted store on the server's disk — not localStorage
// (which lives only in one browser). Every request reads/writes this same
// file, so bookings are visible from any device/browser once created.
//
// This is intentionally simple (no external DB engine) because this dev
// environment has no internet access to install one. When you deploy this
// site for real, swap this file for a real database (Postgres/MySQL/etc.) —
// every other file in the project calls only the functions exported here,
// so that swap will not require touching any other file.
// ---------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    const empty = { customers: [], bookings: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { customers: [], bookings: [] };
  }
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function findOrCreateCustomer({ firstName, lastName, email, phone, guestId }) {
  const db = readDb();
  let customer = db.customers.find(c => c.email === email);
  if (!customer) {
    customer = {
      id: 'cus_' + crypto.randomBytes(6).toString('hex'),
      firstName, lastName, email, phone,
      guestId,
      createdAt: new Date().toISOString()
    };
    db.customers.push(customer);
    writeDb(db);
  }
  return customer;
}

function generateConfirmationCode() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return 'WNG-' + num;
}

function createBooking({ customerId, guestId, hotelId, hotelName, hotelImage, hotelLocation, roomId, roomName, checkin, checkout, guests, nights, pricePerNight, totalPrice, currency, specialRequests, couponCode }) {
  const db = readDb();
  const booking = {
    id: 'bkg_' + crypto.randomBytes(6).toString('hex'),
    confirmationCode: generateConfirmationCode(),
    customerId,
    guestId,
    hotelId, hotelName, hotelImage, hotelLocation,
    roomId, roomName,
    checkin, checkout, guests, nights,
    pricePerNight, totalPrice, currency: currency || 'ILS',
    specialRequests: specialRequests || '',
    couponCode: couponCode || null,
    status: 'confirmed',
    paymentStatus: 'paid_demo', // simulated payment — no real charge
    createdAt: new Date().toISOString()
  };
  db.bookings.push(booking);
  writeDb(db);
  return booking;
}

function getBooking(id) {
  const db = readDb();
  return db.bookings.find(b => b.id === id || b.confirmationCode === id) || null;
}

function listBookingsByGuestId(guestId) {
  const db = readDb();
  return db.bookings
    .filter(b => b.guestId === guestId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function cancelBooking(id) {
  const db = readDb();
  const booking = db.bookings.find(b => b.id === id);
  if (!booking) return null;
  booking.status = 'cancelled';
  writeDb(db);
  return booking;
}

module.exports = {
  findOrCreateCustomer,
  createBooking,
  getBooking,
  listBookingsByGuestId,
  cancelBooking
};
