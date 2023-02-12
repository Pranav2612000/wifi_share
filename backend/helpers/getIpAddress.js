const getIpAddress = (socket) => {
  return socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
}

module.exports = getIpAddress;
