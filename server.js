// ---------------------------------------------------------------------------
// Wings Travel Agency — server
// Plain Node.js, zero external dependencies (no npm install needed).
// Run with:  node server.js
// Then open: http://localhost:3000
// ---------------------------------------------------------------------------

// Load .env manually (no dotenv package available) — simple KEY=VALUE parser
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { URL } = require('url');

const ENV_PATH = path.join(__dirname, '.env');
if (fs.existsSync(ENV_PATH)) {
  const lines = fs.readFileSync(ENV_PATH, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

const provider = require('./server/providers');
const db = require('./server/db');

const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

console.log(`Demo Mode: ${provider.isDemoMode ? 'ON (using mock data)' : 'OFF (using real RateHawk)'}`);

// --- tiny helpers ----------------------------------------------------------

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function getCookie(req, name) {
  const header = req.headers.cookie;
  if (!header) return null;
  const match = header.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function ensureGuestId(req, res) {
  let guestId = getCookie(req, 'wings_guest');
  if (!guestId) {
    guestId = 'guest_' + crypto.randomBytes(8).toString('hex');
    res.setHeader('Set-Cookie', `wings_guest=${guestId}; Path=/; Max-Age=${60 * 60 * 24 * 365}`);
  }
  return guestId;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function serveStatic(req, res, pathname) {
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(PUBLIC_DIR, filePath);

  // Prevent path traversal outside /public
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 — הדף לא נמצא</h1>');
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

// --- API handlers ------------------------------------------------------

async function handleApi(req, res, url) {
  const guestId = ensureGuestId(req, res);
  const parts = url.pathname.split('/').filter(Boolean); // ['api', 'hotels', ...]

  try {
    // GET /api/hotels?destination=&checkin=&checkout=&guests=
    if (req.method === 'GET' && parts[1] === 'hotels' && !parts[2]) {
      const q = url.searchParams;
      const results = await provider.searchHotels({
        destination: q.get('destination') || '',
        checkin: q.get('checkin') || '',
        checkout: q.get('checkout') || '',
        guests: q.get('guests') || '2'
      });
      return sendJson(res, 200, { results, demoMode: provider.isDemoMode });
    }

    // GET /api/hotels/:id?checkin=&checkout=&guests=
    if (req.method === 'GET' && parts[1] === 'hotels' && parts[2]) {
      const q = url.searchParams;
      const hotel = await provider.getHotelDetails({
        hotelId: parts[2],
        checkin: q.get('checkin') || '',
        checkout: q.get('checkout') || '',
        guests: q.get('guests') || '2'
      });
      if (!hotel) return sendJson(res, 404, { error: 'Hotel not found' });
      return sendJson(res, 200, { hotel, demoMode: provider.isDemoMode });
    }

    // GET /api/quote?hotelId=&roomId=&checkin=&checkout=&guests=
    if (req.method === 'GET' && parts[1] === 'quote') {
      const q = url.searchParams;
      const quote = await provider.getQuote({
        hotelId: q.get('hotelId'),
        roomId: q.get('roomId'),
        checkin: q.get('checkin'),
        checkout: q.get('checkout'),
        guests: q.get('guests') || '2'
      });
      return sendJson(res, 200, { quote });
    }

    // POST /api/bookings
    if (req.method === 'POST' && parts[1] === 'bookings' && !parts[2]) {
      const body = await readBody(req);
      const { hotelId, roomId, checkin, checkout, guests, guestDetails, specialRequests, couponCode } = body;

      if (!hotelId || !roomId || !checkin || !checkout) {
        return sendJson(res, 400, { error: 'חסרים פרטי הזמנה (מלון/חדר/תאריכים)' });
      }
      if (!guestDetails || !guestDetails.firstName || !guestDetails.email) {
        return sendJson(res, 400, { error: 'חסרים פרטי אורח (שם/אימייל)' });
      }

      // Recompute the authoritative price server-side — never trust the client's price
      const quote = await provider.getQuote({ hotelId, roomId, checkin, checkout, guests });

      const customer = db.findOrCreateCustomer({
        firstName: guestDetails.firstName,
        lastName: guestDetails.lastName || '',
        email: guestDetails.email,
        phone: guestDetails.phone || '',
        guestId
      });

      // Simulated payment — no real charge is made in Demo Mode / this milestone
      const booking = db.createBooking({
        customerId: customer.id,
        guestId,
        hotelId: quote.hotelId,
        hotelName: quote.hotelName,
        hotelImage: quote.hotelImage,
        hotelLocation: quote.hotelLocation,
        roomId: quote.roomId,
        roomName: quote.roomName,
        checkin: quote.checkin,
        checkout: quote.checkout,
        guests: quote.guests,
        nights: quote.nights,
        pricePerNight: quote.pricePerNight,
        totalPrice: quote.totalPrice,
        currency: quote.currency,
        specialRequests,
        couponCode
      });

      return sendJson(res, 201, { booking });
    }

    // GET /api/bookings/:id
    if (req.method === 'GET' && parts[1] === 'bookings' && parts[2]) {
      const booking = db.getBooking(parts[2]);
      if (!booking) return sendJson(res, 404, { error: 'Booking not found' });
      return sendJson(res, 200, { booking });
    }

    // POST /api/bookings/:id/cancel
    if (req.method === 'POST' && parts[1] === 'bookings' && parts[2] && parts[3] === 'cancel') {
      const booking = db.cancelBooking(parts[2]);
      if (!booking) return sendJson(res, 404, { error: 'Booking not found' });
      return sendJson(res, 200, { booking });
    }

    // GET /api/my-bookings
    if (req.method === 'GET' && parts[1] === 'my-bookings') {
      const bookings = db.listBookingsByGuestId(guestId);
      return sendJson(res, 200, { bookings });
    }

    return sendJson(res, 404, { error: 'Unknown API route' });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: err.message || 'Server error' });
  }
}

// --- server ----------------------------------------------------------------

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.startsWith('/api/')) {
    return handleApi(req, res, url);
  }
  return serveStatic(req, res, url.pathname);
});

server.listen(PORT, () => {
  console.log(`Wings Travel Agency server running at http://localhost:${PORT}`);
});
