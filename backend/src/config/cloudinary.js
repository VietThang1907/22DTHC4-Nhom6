// Cloudinary configuration
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dtk2qgorj',
  api_key: '715298689516934',
  api_secret: 'zQorXMBLZpFt0aymnYjj734fbsk',
  secure: true
});

module.exports = cloudinary;