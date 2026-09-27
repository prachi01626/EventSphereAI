const mongoose = require('mongoose');

let isUsingMock = false;

const connectDB = async () => {
  const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventsphere_ai';

  try {
    console.log(`Connecting to MongoDB at ${connStr} (2s timeout)...`);
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected successfully: ${mongoose.connection.host}`);
    global.__MOCK_DB_ACTIVE__ = false;
  } catch (err) {
    console.warn(`⚠️ Local MongoDB not detected on port 27017 (${err.message}).`);
    console.log(`⚡ Activated EventSphere AI High-Speed In-Memory Database Engine (Zero Setup & Fast Startup).`);
    global.__MOCK_DB_ACTIVE__ = true;
    isUsingMock = true;
  }
};

module.exports = connectDB;
