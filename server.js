const express = require('express');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
