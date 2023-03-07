const getIpAddress = (socket) => socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

module.exports = getIpAddress;
