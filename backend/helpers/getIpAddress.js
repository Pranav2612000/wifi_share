const getIpAddress = (socket) => {
  console.log("Headers", socket.handshake.headers);
  return socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
}

module.exports = getIpAddress;
