import constants from '../config/constants';

import { io } from "socket.io-client";

let instance; // used for singleton pattern

let socket;

class DiscoveryService {
  _isLoading = true;
  _isMaster = false;
  onlinePeers = [];

  constructor({
    onConnect
  }) {
    if (instance) {
        return this;
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

      if (this.onlinePeers.length === 1) {
        this._isMaster = true;
      }
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

  kill() {
    // ignore if the socket has not been initialized
    if (!this.socket) {
      return;
    }

    console.log('Disconnecting...');
    this.socket.disconnect();
  }
}
export default DiscoveryService;
