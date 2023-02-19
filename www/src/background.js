import DiscoveryService from "./service/Discovery";

console.log('Starting discovery service in background');
const peer = new DiscoveryService({
  onConnect: () => {
    console.log('Connection Succesful');
    return;
  },
  onPeerReady: () => {
    console.log('Peer ready to start work');
    return;
  },
  onNewText: (newText) => {
    console.log('New text received from a remote peer');
    return;
  }
});
console.log({ peer });
