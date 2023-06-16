const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000; // Replace with the desired port number

// Create the MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',  // Use 'localhost' for WampServer
  user: 'root',       // MySQL username
  password: '',       // MySQL password (leave blank for WampServer default)
  database: 'testdb'  // Name of the database you created
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }

  console.log('Connected to MySQL database as ID: ' + connection.threadId);
});

// Parse request bodies as JSON
app.use(bodyParser.json());

// Endpoint to save username and password
app.post('/login', (req, res) => {
  const { username, password } = req.body;


  const query = 'INSERT INTO Login (user_name, password) VALUES (?, ?)';
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      console.error('Error saving username and password:', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json({ message: 'Username and password saved successfully' });
    }
  });
});


app.get('/get-user', (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const skip = parseInt(req.query.skip) || 0; // Default skip is 0
  
    // Get users from the database
    const query = 'SELECT * FROM userdb LIMIT ? OFFSET ?';
    connection.query(query, [limit, skip], (error, results) => {
      if (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });
// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
