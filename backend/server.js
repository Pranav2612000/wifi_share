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

const io = new Server(server, {
  cors: {
    origin: true
  }
});

io.on('connection', (socket) => {
  onClientConnected(io, socket);

  socket.on('disconnect', () => {
    const address = getIpAddress(socket);
    console.log('user disconnected', address);

    socket.to(address).emit('CLIENT_LEFT', {
      address: address
    });
  });

  // Triggered when some client is asking for text
  socket.on('REQUEST_TEXT', async (data, client) => {

    // Kept here for testing. To be deleted later.
    console.log('Client ', client, 'called REQUEST_TEXT with data', data);

    const address = getIpAddress(socket);
    const clientSockets = await io.in(address).fetchSockets();

    // If no other sockets exist return empty text back
    if (!Array.isArray(clientSockets) || clientSockets.length <= 1) {
      socket.emit('NEW_TEXT', {
        text: ""
      });
      return;
    }

    // Otherwise fetch the latest text from the first client and use that
    io.to(clientSockets[0].id).timeout(5000).emit('REQUEST_TEXT', 'test', function (err, resp) {
      console.log('Response from a client', resp);
      // If there's an error in getting data we send back empty string
      if(!resp || !resp.text) {
        console.log("Recvd malformed data");
        socket.emit('NEW_TEXT', {
          text: ""
        });
        return;
      }

      socket.emit('NEW_TEXT', {
        text: resp.text
      });
    });
  });

  socket.on('UPDATE_TEXT', async (data) => {
    if(!data || !data.text) {
      console.log("Recvd malformed data. Doing nothing");
      return;
    }

    const address = getIpAddress(socket);
    socket.to(address).emit('NEW_TEXT', {
      text: data.text
    });
  });
});

server.listen(port, () => console.log(`App started on port ${port}`));
