const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database/connectDB');
const cors = require('cors');
const bodyParser = require('body-parser');
dotenv.config();

// remove later once I put controlls in seperate file
const pool = require('./database/configDB');

const app = express();

// connects to Postgres DB
connectDB();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.send(`Server for Esthetician backend is live!`);
});

// controller for getting client cards in marketplace
app.get('/api/marketplace/client-search', async (req, res) => {
  // parse params (destructure)
  const { title = 'Esthetician', page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // build query
  // join profile
  const queryText = `
        SELECT 
          u.*,
          b.business_id,
          b.title,
          b.location,
          b.cost
        FROM
          users AS u
        LEFT JOIN
          business AS b
        ON
          u.user_id = b.user_id
        WHERE
          role = $1 AND b.title = $2
        LIMIT $3
        OFFSET $4;
      `;

  const values = ['client', title, limit, offset];
  try {
    const result = await pool.query(queryText, values);

    const response = {
      success: true,
      status: 200,
      message: 'successful query',
      data: result.rows,
    };
    res.json(response);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
