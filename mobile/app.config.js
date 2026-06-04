const fs = require('fs');
const path = require('path');
// load dotenv if present to allow local .env files
try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
} catch (e) {
  // ignore if dotenv isn't installed; reading process.env will still work
}

const appJson = require('./app.json');

const extras = Object.assign({}, appJson.expo.extra || {});

extras.SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || extras.SUPABASE_URL || '';
extras.SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || extras.SUPABASE_ANON_KEY || '';
extras.SCHOOL_LOGO_URI = process.env.SCHOOL_LOGO_URI || extras.SCHOOL_LOGO_URI || '';

module.exports = ({ config }) => {
  return Object.assign({}, config, {
    extra: extras,
  });
};
