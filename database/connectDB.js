const pool = require('./configDB');

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to DB');
    client.release();
  } catch (err) {
    console.error('Error connecting to DB', err.stack);
    process.exit(1);
  }
};

module.exports = connectDB;
