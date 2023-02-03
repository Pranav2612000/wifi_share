const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const onClientConnected = require('./helpers/onClientConnected');
const getIpAddress = require('./helpers/getIpAddress');

const port = process.env.PORT || 5000;

const app = express();
app.set('trust proxy', true);

app.get('/', (req, res) => {
  res.send({ status: 200 });
});

const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
  onClientConnected(io, socket);

  socket.on('disconnect', () => {
    console.log('user disconnected', getIpAddress(socket));
  });
});

server.listen(port, () => console.log(`App started on port ${port}`));
