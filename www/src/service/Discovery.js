import constants from '../config/constants';

import { io } from "socket.io-client";

let instance; // used for singleton pattern

let socket;

class DiscoveryService {
  _isLoading = true;
  _isMaster = false;
  onlinePeers = [];

  constructor({
    onConnect,
    onNewText,
    onPeerReady
  }) {
    if (socket) {
      return instance;
    }

    instance = this;

    const { SOCKET_URL } = constants;
    console.log('Setting up peer');

    socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connection successful');
      onConnect();
      this._isLoading = false;
    });

    socket.on('disconnect', () => {
      console.log('Connection disconnected');
    });

    socket.on('connect_error', () => {
      console.log('error connecting to socket');
    });

    socket.on('CONNECTION_SUCCESSFUL', (data) => {
      if (!data || !Array.isArray(data.clients)) {
        console.log("Recvd malformed data");
        return;
      }

      this.onlinePeers = data.clients;

      // If there are no other peers we are the master,
      // and our scratchpad is the source of truth
      if (this.onlinePeers.length === 1) {
        console.log("No other clients - so this peer is the master");
        this._isMaster = true;
        onPeerReady && onPeerReady();
        return;
      }
      console.log("Connected Clients: ", this.onlinePeers);

      // Otherwise we ask the server to send us the latest text
      socket.send('REQUEST_TEXT');
    });

    socket.on('NEW_TEXT', (data) => {
      console.log('NEW_TEXT recvd', data);
      if (!data || !data.text) {
        console.log("Recvd malformed data");
        return;
      }

      onNewText(data.text);
      onPeerReady && onPeerReady();
    });

    socket.on('CLIENT_JOINED', (data) => {
      console.log('New client joined', data);
      if (!data || !data.address) {
        console.log('Malformed CLIENT_LEFT data');
        return;
      }

      if (!this.onlinePeers || !Array.isArray(this.onlinePeers)) {
        this.onlinePeers = [ data.address ];
        return;
      }

      this.onlinePeers.push(data.address);
    });

    socket.on('CLIENT_LEFT', (data) => {
      console.log('A client left', data);
      if (!data || !data.address) {
        console.log('Malformed CLIENT_LEFT data');
        return;
      }

      if (!this.onlinePeers || !Array.isArray(this.onlinePeers)) {
        console.log('No peers online');
        return;
      }

      const clientIdx = this.onlinePeers.indexOf(data.address);

      if (clientIdx <= -1) {
        console.log('Client not found');
        return;
      }

      this.onlinePeers.splice(clientIdx, 1);
    });
  }

  isLoading() {
    return this._isLoading;
  }

  setup() {
  }

  find() {
    console.log('Looking for peers...');
  }

  sendUpdates(text) {
    console.log('Sending updated text to peers', text);
  }

  kill() {
    // ignore if the socket has not been initialized
    if (!socket) {
      return;
    }

    console.log('Disconnecting...');
    socket.disconnect();
    socket = null;
  }
}
export default DiscoveryService;
