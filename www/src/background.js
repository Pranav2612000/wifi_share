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

const removeAllContextMenus = async () => {
  return new Promise((resolve, reject) => {
    chrome.contextMenus.removeAll(() => {
      resolve(true);
    });
  });
}

const initializeApp = () => {
  console.log('Starting app...');
  console.log('Starting discovery service in background');
  const peer = new DiscoveryService({
    onConnect: () => {
      return;
    },
    onPeerReady: () => {
      return;
    },
    onNewText: (newText) => {
      return;
    }
  });
}

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
