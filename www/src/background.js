/*global chrome*/
/*global onload*/

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

const addContextMenus = async (contextMenus) => {
  return Promise.all(
    contextMenus.map((contextMenu) => {
      return new Promise((resolve, reject) => {
        chrome.contextMenus.create({
          title: contextMenu.title,
          id: contextMenu.id,
          contexts: contextMenu.contexts || ['all'],
          type: contextMenu.type || 'normal'
        }, () => {
          resolve(true);
        });
      });
    })
  );
}

const setValueInChromeStorage = async (key, value) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ key: value }).then(() => {
      console.log("Value is set to " + value);
      resolve(true);
    });
  });
}

const getValueFromChromeStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key).then((result) => {
      resolve(result.key);
    });
  });
}

const initializeDiscoveryService = () => {
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

const initializeContextMenus = async () => {
  await removeAllContextMenus();
  await addContextMenus([
    {
      title: 'Switch ON',
      id: 'ON'
    },
    {
      title: 'Switch OFF',
      id: 'OFF'
    }
  ]);
  console.log('Context Menus created successfully');
}

const initializeApp = () => {
  console.log('Starting background service...');
  initializeContextMenus();
};

initializeApp();
