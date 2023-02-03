const getIpAddress = require('./getIpAddress');

const onClientConnected = (io, socket) => {
  // get the ip address of the client to join him to the room
  // that matches his ip address
  const address = getIpAddress(socket);
  console.log('User connected: ', address);

  socket.join(address);

  // get the current number of clients in the room and return
  // this data back to the client
  const numberOfClients = io.sockets.adapter.rooms.get(address)?.size ?? 0;
  socket.emit('CONNECTION_SUCCESSFUL', {
    numberOfClients: numberOfClients
  });
};

module.exports = onClientConnected;
