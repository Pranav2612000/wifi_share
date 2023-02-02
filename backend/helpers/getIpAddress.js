const getIpAddress = (socket) => {
  return socket.request.connection.remoteAddress;
}

module.exports = getIpAddress;
