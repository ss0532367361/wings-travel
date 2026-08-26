// Chooses which provider the whole site uses.
// Demo Mode (default): mock.js — fake data, works immediately.
// Once RATEHAWK_API_KEY + RATEHAWK_API_KEY_ID are set in .env: switches to
// the real ratehawk.js automatically. Nothing else in the app needs to change.

const isConfigured = !!(process.env.RATEHAWK_API_KEY && process.env.RATEHAWK_API_KEY_ID);

const provider = isConfigured ? require('./ratehawk') : require('./mock');

module.exports = provider;
module.exports.isDemoMode = !isConfigured;
