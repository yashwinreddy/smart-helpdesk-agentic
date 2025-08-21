const mongoose = require('mongoose');

const connectMongo = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('✅ Mongo connected');
};

module.exports = { connectMongo };
