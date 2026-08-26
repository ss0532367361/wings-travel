// ---------------------------------------------------------------------------
// RATEHAWK PROVIDER — real API connection (NOT YET ACTIVE)
//
// This file implements the exact same function signatures as
// providers/mock.js: searchHotels(), getHotelDetails(), getQuote().
// providers/index.js switches to THIS file automatically as soon as
// RATEHAWK_API_KEY is set in the .env file — no other code changes needed.
//
// HOW TO ACTIVATE:
//   1. Get your RateHawk API credentials (key_id + api_key, Net Price model
//      as discussed).
//   2. Fill them into the .env file at the project root:
//         RATEHAWK_API_KEY_ID=your_key_id
//         RATEHAWK_API_KEY=your_api_key
//   3. Fill in the three TODOs below with RateHawk's actual endpoint URLs
//      and request/response format, from their official API docs
//      (you'll get access to these docs once your account is approved).
//   4. Restart the server. Demo Mode turns off automatically.
// ---------------------------------------------------------------------------

const API_KEY_ID = process.env.RATEHAWK_API_KEY_ID;
const API_KEY = process.env.RATEHAWK_API_KEY;

function assertConfigured() {
  if (!API_KEY_ID || !API_KEY) {
    throw new Error(
      'RateHawk API credentials are not set. Add RATEHAWK_API_KEY_ID and ' +
      'RATEHAWK_API_KEY to your .env file, or keep using Demo Mode.'
    );
  }
}

async function searchHotels({ destination, checkin, checkout, guests } = {}) {
  assertConfigured();
  // TODO: call RateHawk's hotel search endpoint here.
  // Map their response into the same shape mock.js returns:
  //   [{ id, name, stars, location, distanceKm, rating, ratingLabel,
  //      badge, image, amenities, pricePerNight, totalPrice, nights }]
  throw new Error('RateHawk searchHotels() not implemented yet — fill in the TODO in providers/ratehawk.js');
}

async function getHotelDetails({ hotelId, checkin, checkout, guests } = {}) {
  assertConfigured();
  // TODO: call RateHawk's hotel details / room list endpoint here.
  // Map their response into the same shape mock.js returns.
  throw new Error('RateHawk getHotelDetails() not implemented yet — fill in the TODO in providers/ratehawk.js');
}

async function getQuote({ hotelId, roomId, checkin, checkout, guests } = {}) {
  assertConfigured();
  // TODO: call RateHawk's "prebook" / rate-check endpoint here to confirm
  // the room and price are still available right before booking.
  // Map their response into the same shape mock.js returns.
  throw new Error('RateHawk getQuote() not implemented yet — fill in the TODO in providers/ratehawk.js');
}

module.exports = { searchHotels, getHotelDetails, getQuote };
