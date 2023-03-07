const getIpAddress = require('./getIpAddress');

const onClientConnected = async (io, socket) => {
  // get the ip address of the client to join him to the room
  // that matches his ip address
  const address = getIpAddress(socket);
  console.log('User connected: ', address);

  socket.join(address);

  // get the current number of clients in the room and return
  // this data back to the client
  const clientSockets = await io.in(address).fetchSockets();
  const clientIps = clientSockets.map((clientSocket) => getIpAddress(clientSocket));

  // Kept here for testing. To be deleted later.
  console.log({ clientIps });

  socket.emit('CONNECTION_SUCCESSFUL', {
    clients: clientIps,
  });

  socket.to(address).emit('CLIENT_JOINED', {
    address,
  });
};

module.exports = onClientConnected;
