const getIpAddress = (socket) => {
  const ips = socket.handshake.headers['x-forwarded-for'];

  if (!ips || ips.length === 0) {
    return socket.request.connection.remoteAddress;
  }
  return ips.split(', ')[0];
};

module.exports = getIpAddress;
