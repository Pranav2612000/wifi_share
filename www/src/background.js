/*global chrome*/

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

console.log({ chrome });
console.log("action", chrome.action);
chrome.action.setBadgeText(
  { text: "ON" },
  (err, resp) => { console.log({err, resp}) }
);

chrome.contextMenus.create(
  {
    title: 'Switch Off',
    id: 'SWITCH_OFF',
    contexts: ['all'],
    type: 'normal'
  },
  (err, resp) => { console.log('Context Menu created successfully', err, resp); }
);

chrome.action.onClicked.addListener(
  () => {
    console.log('Stopping the extension');
    chrome.action.setBadgeText(
      { text: "OFF" },
      (err, resp) => { console.log({err, resp}) }
    );
  }
)
