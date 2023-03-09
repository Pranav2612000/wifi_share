import { io } from "socket.io-client";
import constants from "../config/constants";

let instance; // used for singleton pattern

let socket;

class DiscoveryService {
  _isLoading = false;

  _isMaster = false;

  onlinePeers = [];

  text = "";

  onConnect = () => {
    return null;
  };

  onDisconnect = () => {
    return null;
  };

  onNewText = () => {
    return null;
  };

  onPeerReady = () => {
    return null;
  };

  onStateUpdate = () => {
    return null;
  };

  constructor({
    onConnect,
    onDisconnect,
    onNewText,
    onPeerReady,
    onStateUpdate,
  } = {}) {
    if (socket || instance?.isLoading() === true) {
      return instance;
    }

    instance = this;
    this._isLoading = true;

    onConnect && (this.onConnect = onConnect);
    onDisconnect && (this.onDisconnect = onDisconnect);
    onNewText && (this.onNewText = onNewText);
    onPeerReady && (this.onPeerReady = onPeerReady);
    onStateUpdate && (this.onStateUpdate = onStateUpdate);

    const { BFF_URL } = constants;

    fetch(BFF_URL)
      .then((res) => res.json())
      .then((res) => {
        const SOCKET_URL = res.socketUrl;
        console.log("Setting up peer using ", SOCKET_URL);

        socket = io(SOCKET_URL, {
          transports: ["websocket"],
        });

        socket.on("connect", () => {
          console.log("Connection successful");
          this.onConnect();
          this._isLoading = false;

          this.broadcastStateUpdate();
        });

        socket.on("disconnect", () => {
          console.log("Connection disconnected");

          this.onDisconnect();
          this.broadcastStateUpdate();
        });

        socket.on("connect_error", (err) => {
          console.log("error connecting to socket", err);
        });

        socket.on("CONNECTION_SUCCESSFUL", (data) => {
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
            this.onPeerReady && this.onPeerReady();
            return;
          }
          console.log("Connected Clients: ", this.onlinePeers);

          // Otherwise we ask the server to send us the latest text
          socket.emit("REQUEST_TEXT");
        });

        socket.on("NEW_TEXT", (data) => {
          console.log("NEW_TEXT recvd", data);
          if (!data || data.text === undefined || data.text === null) {
            console.log("Recvd malformed data");
            return;
          }

          this.onNewText(data.text);
          this.onPeerReady && this.onPeerReady();

          // Also update the current text value stored in DiscoverService's state
          this.text = data.text;

          this.broadcastStateUpdate();
        });

        socket.on("CLIENT_JOINED", (data) => {
          console.log("New client joined", data);
          if (!data || !data.address) {
            console.log("Malformed CLIENT_LEFT data");
            return;
          }

          if (!this.onlinePeers || !Array.isArray(this.onlinePeers)) {
            this.onlinePeers = [data.address];
            return;
          }

          this.onlinePeers.push(data.address);
        });

        socket.on("CLIENT_LEFT", (data) => {
          console.log("A client left", data);
          if (!data || !data.address) {
            console.log("Malformed CLIENT_LEFT data");
            return;
          }

          if (!this.onlinePeers || !Array.isArray(this.onlinePeers)) {
            console.log("No peers online");
            return;
          }

          const clientIdx = this.onlinePeers.indexOf(data.address);

          if (clientIdx <= -1) {
            console.log("Client not found");
            return;
          }

          this.onlinePeers.splice(clientIdx, 1);
        });

        socket.on("REQUEST_TEXT", (fn) => {
          fn({ text: this.text });
        });
      })
      .catch((err) => {
        this._isLoading = false;
        console.log(err);
      });
  }

  broadcastStateUpdate() {
    console.log("Broadcasting state update");
    this.onStateUpdate({
      loading: this._isLoading,
      text: this.text,
    });
  }

  isLoading() {
    return this._isLoading;
  }

  setup() {}

  find() {
    console.log("Looking for peers...");
  }

  async sendUpdates(text) {
    console.log("Sending updated text to peers", text, socket);
    return new Promise((resolve, reject) => {
      socket.emit(
        "UPDATE_TEXT",
        {
          text,
        },
        (resp) => {
          // Also store the latest updated text to serve to new peers which may join
          this.text = text;

          resolve(true);
        }
      );
    });
  }

  getText() {
    return this.text;
  }

  updateCallbacks({ onConnect, onNewText, onPeerReady } = {}) {
    onConnect && (this.onConnect = onConnect);
    onNewText && (this.onNewText = onNewText);
    onPeerReady && (this.onPeerReady = onPeerReady);
  }

  kill() {
    // ignore if the socket has not been initialized
    if (!socket) {
      return;
    }

    console.log("Disconnecting...");
    socket.disconnect();
    socket = null;
  }
}
export default DiscoveryService;
