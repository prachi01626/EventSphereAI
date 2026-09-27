const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers for SRV lookups on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if custom dns servers cannot be set
}

let isUsingMock = false;

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/eventsphere_ai';

  // 1. Attempt Primary MongoDB URI (Atlas or custom)
  if (primaryUri) {
    try {
      console.log(`Connecting to MongoDB Atlas at ${primaryUri.split('@')[1] || primaryUri} (5s timeout)...`);
      await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Atlas Connected successfully: ${mongoose.connection.host}`);
      global.__MOCK_DB_ACTIVE__ = false;
      return;
    } catch (err) {
      console.warn(`⚠️ MongoDB Atlas connection error (${err.message}).`);
      if (err.message.includes('whitelist') || err.message.includes('IP')) {
        console.warn(`👉 Action needed: Whitelist your current IP address (or 0.0.0.0/0) in MongoDB Atlas Network Access.`);
      }
    }
  }

  // 2. Attempt Local MongoDB
  try {
    console.log(`Attempting Local MongoDB at ${localUri} (2s timeout)...`);
    await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ Local MongoDB Connected successfully: ${mongoose.connection.host}`);
    global.__MOCK_DB_ACTIVE__ = false;
    return;
  } catch (err) {
    console.warn(`⚠️ Local MongoDB not detected on port 27017.`);
  }

  // 3. Graceful In-Memory fallback for zero-downtime offline demonstrations
  console.log(`⚡ Activated EventSphere AI High-Speed In-Memory Database Engine (Zero Setup & Fast Startup).`);
  global.__MOCK_DB_ACTIVE__ = true;
  isUsingMock = true;
};

module.exports = connectDB;
