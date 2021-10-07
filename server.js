const express = require('express');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');

const app = express();

const tasks = [];

app.use(cors());
app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (id) => {
    tasks.filter((task) => task.id !== id);
    socket.broadcast.emit('removeTask', id);
  });
  socket.on('editTask', (editedTask) => {
    tasks.map((task) => {
      task.id === editedTask.id ? (task.name = editedTask.name) : task;
    });
    socket.broadcast.emit('editTask', editedTask);
  });
});
