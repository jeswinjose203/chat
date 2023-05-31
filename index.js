const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var mysql = require('mysql2');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

var connection = mysql.createConnection({
    host:'bx2o3pyafjmcpf1ks5ma-mysql.services.clever-cloud.com',
    user: 'ubs1ytxsd9bviegz',
    password: 'OWWeAYY0F3PW6oMjCoTB',
    database: 'bx2o3pyafjmcpf1ks5ma'
});

connection.connect(function(error){
    if (error) throw error;
    console.log("connected to the database successfully!")
});

// Serve static files
app.use(express.static(__dirname));


    
var i = 1;
// Set up the Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    io.emit('message', message);

    var query = 'INSERT INTO `new_schema.chat` (sr_no, text) VALUES (?, ?) ' +
            'ON DUPLICATE KEY UPDATE text = VALUES(text)';
var valuesToInsert = [i, message];

// Execute the INSERT query with ON DUPLICATE KEY UPDATE
connection.query(query, valuesToInsert, (error, results) => {
  if (error) {
    console.error('Error executing query: ' + error.stack);
  } else {
    console.log('Insertion or update successful');
    i++;
    if(i>100)
    {
        i =1 ;
    }
  }
});



  });


  socket.on('disconnect', () => {
    console.log('A user disconnected');
});


});


// Handle the '/messages' endpoint
app.get('/messages', (req, res) => {
  const query = 'SELECT * FROM `new_schema.chat`';

  // Execute the SELECT query
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      res.status(500).json({ error: 'Failed to fetch messages' });
    } else {
      const messages = results.map((row) => row.text);
      res.json(messages);
    }
  });
});


const port = 8080; // or any port you prefer
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});