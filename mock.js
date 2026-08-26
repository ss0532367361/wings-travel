// ---------------------------------------------------------------------------
// MOCK PROVIDER — Demo Mode
// Returns fake hotel/room/price data so the full booking flow works
// end-to-end before a real RateHawk API key is available.
//
// This file implements the exact same function signatures as
// providers/ratehawk.js. When RATEHAWK_API_KEY is set in the environment,
// providers/index.js automatically switches to the real provider instead
// of this one — no other code in the site needs to change.
// ---------------------------------------------------------------------------

const HOTELS = [
  {
    id: 'hilton-tlv',
    name: 'מלון הילטון תל אביב',
    stars: 5,
    country: 'ישראל',
    city: 'תל אביב',
    location: 'גורדון 205, חוף הים',
    distanceKm: 0.3,
    rating: 9.1,
    ratingLabel: 'מעולה',
    reviewCount: 312,
    badge: 'הכי פופולרי',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400'
    ],
    description: 'מלון יוקרתי הממוקם ישירות על קו החוף של תל אביב, במרחק הליכה קצר משוק הכרמל ורחוב שינקין. חדרים מרווחים עם נוף לים, בריכת גג פתוחה כל השנה, וספא מפנק.',
    amenities: ['Wi-Fi חינם', 'בריכת גג', 'ארוחת בוקר', 'חדר כושר', 'חניה', 'ספא', 'ידידותי לחיות מחמד', 'שירות חדרים 24/7'],
    rooms: [
      { id: 'deluxe-seaview', name: 'חדר דלקס עם נוף לים', sizeSqm: 25, bedType: 'מיטה זוגית', maxGuests: 2, tags: ['25 מ"ר', 'מיטה זוגית', 'עד 2 אורחים'], pricePerNight: 980, freeCancellation: true, breakfastIncluded: false },
      { id: 'junior-suite', name: "סוויטה ג'וניור", sizeSqm: 38, bedType: 'מיטה קינג', maxGuests: 3, tags: ['38 מ"ר', 'מיטה קינג', 'עד 3 אורחים', 'מרפסת'], pricePerNight: 1370, freeCancellation: true, breakfastIncluded: true },
      { id: 'standard', name: 'חדר סטנדרט', sizeSqm: 19, bedType: '2 מיטות יחיד', maxGuests: 2, tags: ['19 מ"ר', '2 מיטות יחיד', 'עד 2 אורחים'], pricePerNight: 780, freeCancellation: true, breakfastIncluded: false }
    ]
  },
  {
    id: 'david-intercontinental',
    name: 'מלון דיוויד אינטרקונטיננטל',
    stars: 5,
    country: 'ישראל',
    city: 'תל אביב',
    location: 'נמל תל אביב',
    distanceKm: 1.1,
    rating: 8.9,
    ratingLabel: 'מעולה',
    reviewCount: 204,
    badge: null,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    description: 'מלון עסקים ופנאי מוביל בסמוך לנמל תל אביב, עם גישה נוחה לטיילת ולמרינה.',
    amenities: ['Wi-Fi חינם', 'ספא', 'חניה', 'חדר כושר', 'מסעדה'],
    rooms: [
      { id: 'classic', name: 'חדר קלאסי', sizeSqm: 22, bedType: 'מיטה זוגית', maxGuests: 2, tags: ['22 מ"ר', 'עד 2 אורחים'], pricePerNight: 1170, freeCancellation: true, breakfastIncluded: false }
    ]
  },
  {
    id: 'rothschild-71',
    name: 'בוטיק הוטל רוטשילד 71',
    stars: 4,
    country: 'ישראל',
    city: 'תל אביב',
    location: 'רוטשילד',
    distanceKm: 0.6,
    rating: 8.5,
    ratingLabel: 'טוב מאוד',
    reviewCount: 156,
    badge: 'מחיר משתלם',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
    description: 'בוטיק הוטל אינטימי בלב שדרות רוטשילד, קרוב לבתי קפה ולחיי הלילה של העיר.',
    amenities: ['Wi-Fi חינם', 'ארוחת בוקר'],
    rooms: [
      { id: 'boutique-room', name: 'חדר בוטיק', sizeSqm: 18, bedType: 'מיטה זוגית', maxGuests: 2, tags: ['18 מ"ר', 'עד 2 אורחים'], pricePerNight: 620, freeCancellation: true, breakfastIncluded: true }
    ]
  },
  {
    id: 'norman-tlv',
    name: 'נורמן תל אביב',
    stars: 5,
    country: 'ישראל',
    city: 'תל אביב',
    location: 'נחלת בנימין',
    distanceKm: 0.8,
    rating: 9.4,
    ratingLabel: 'יוצא דופן',
    reviewCount: 98,
    badge: null,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    description: 'מלון בוטיק יוקרתי בבניין היסטורי משופץ, עם בריכת גג ומסעדת שף.',
    amenities: ['Wi-Fi חינם', 'בריכת גג', 'מסעדה', 'בר'],
    rooms: [
      { id: 'deluxe', name: 'חדר דלקס', sizeSqm: 28, bedType: 'מיטה קינג', maxGuests: 2, tags: ['28 מ"ר', 'עד 2 אורחים'], pricePerNight: 1550, freeCancellation: true, breakfastIncluded: true }
    ]
  }
];

function nightsBetween(checkin, checkout) {
  const a = new Date(checkin);
  const b = new Date(checkout);
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

function cheapestRoomPrice(hotel) {
  return Math.min(...hotel.rooms.map(r => r.pricePerNight));
}

// Simulated network delay so loading states feel real (kept tiny)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchHotels({ destination, checkin, checkout, guests } = {}) {
  await delay(120);
  const nights = nightsBetween(checkin || todayPlus(7), checkout || todayPlus(10));
  return HOTELS.map(h => ({
    id: h.id,
    name: h.name,
    stars: h.stars,
    location: h.location,
    distanceKm: h.distanceKm,
    rating: h.rating,
    ratingLabel: h.ratingLabel,
    badge: h.badge,
    image: h.image,
    amenities: h.amenities.slice(0, 4),
    pricePerNight: cheapestRoomPrice(h),
    totalPrice: cheapestRoomPrice(h) * nights,
    nights
  }));
}

async function getHotelDetails({ hotelId, checkin, checkout, guests } = {}) {
  await delay(120);
  const hotel = HOTELS.find(h => h.id === hotelId);
  if (!hotel) return null;
  const nights = nightsBetween(checkin || todayPlus(7), checkout || todayPlus(10));
  return {
    ...hotel,
    nights,
    rooms: hotel.rooms.map(r => ({
      ...r,
      totalPrice: r.pricePerNight * nights
    }))
  };
}

async function getQuote({ hotelId, roomId, checkin, checkout, guests } = {}) {
  await delay(80);
  const hotel = HOTELS.find(h => h.id === hotelId);
  if (!hotel) throw new Error('Hotel not found');
  const room = hotel.rooms.find(r => r.id === roomId);
  if (!room) throw new Error('Room not found');
  const nights = nightsBetween(checkin, checkout);
  const pricePerNight = room.pricePerNight;
  const totalPrice = pricePerNight * nights;
  return {
    hotelId: hotel.id,
    hotelName: hotel.name,
    hotelImage: hotel.image,
    hotelLocation: hotel.location,
    roomId: room.id,
    roomName: room.name,
    checkin,
    checkout,
    guests: guests || 2,
    nights,
    pricePerNight,
    totalPrice,
    currency: 'ILS',
    freeCancellation: room.freeCancellation
  };
}

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

module.exports = { searchHotels, getHotelDetails, getQuote };
