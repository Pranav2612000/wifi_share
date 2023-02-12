const getIpAddress = (socket) => {
  console.log("Headers", socket.handshake.headers);
  return socket.request.connection.remoteAddress;
}

module.exports = getIpAddress;
