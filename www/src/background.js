/*global chrome*/

import DiscoveryService from "./service/Discovery";


// Creates a async/await usable function to update badge text of the app
const updateBadgeText = async (text) => {
  return new Promise((resolve, reject) => {
    chrome.action.setBadgeText(
      { text: text },
      () => { resolve(true) }
    );
  });
};

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
