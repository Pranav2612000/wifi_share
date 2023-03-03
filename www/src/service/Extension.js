/*global chrome*/

export const isExtension = process.env.REACT_APP_TYPE === 'extension';

// Creates a async/await usable function to update badge text of the app
export async function updateBadgeText (text) {
  return new Promise((resolve, reject) => {
    chrome.action.setBadgeText(
      { text: text },
      () => { resolve(true) }
    );
  });
}

export async function removeAllContextMenus() {
  return new Promise((resolve, reject) => {
    chrome.contextMenus.removeAll(() => {
      resolve(true);
    });
  });
}

export async function addContextMenus (contextMenus) {
  return Promise.all(
    contextMenus.map((contextMenu) => {
      return new Promise((resolve, reject) => {
        chrome.contextMenus.create({
          title: contextMenu.title,
          id: contextMenu.id,
          contexts: contextMenu.contexts || ['all'],
          type: contextMenu.type || 'normal',
          visible: contextMenu.visible,
          enabled: contextMenu.enabled
        }, () => {
          resolve(true);
        });
      });
    })
  );
}

export async function updateContextMenu (id, properties) {
  return new Promise((resolve, reject) => {
    chrome.contextMenus.update(id, properties, () => {
      resolve(true);
    });
  });
}

export async function setValueInChromeStorage (key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }).then(() => {
      resolve(true);
    });
  });
}

export async function getValueFromChromeStorage (key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key]).then((result) => {
      resolve(result[key]);
    });
  });
}

export function connectBackgroundWithScratchpad(onConnect, onDisconnect) {
  const listener = (port) => {
    console.log('Connected to ', port.name);
    onConnect(port);

    port.onDisconnect.addListener(( port) => {
      console.log('Disconnected', port.name);
      onDisconnect();
    });
  };

  chrome.runtime.onConnect.removeListener(listener);
  chrome.runtime.onConnect.addListener(listener);
}

export function connectScratchpadStateWithBackground ({ setLoading, setText }) {
  // create a runtime connection port to communicate with background.js script
  const port = chrome.runtime.connect({ name: 'stateUpdates' });

  port.onMessage.addListener(function ({ type, data }) {
    if ( type === 'STATE' ) {
      setText(data.text);
      setLoading(data.loading);
    }
  });

  return {
    closeConnection: () => {
      console.log('Closing open state update port');
      port.disconnect()
    }
  }
}

export async function sendTextUpdateToBackground(text) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      type: 'TEXT_UPDATE',
      data: { text: text }
    }, (response) => {
      console.log('Response from text update', response);
      resolve(response);
    })
  });
}

export function listenForTextUpdatesFromPopup({ onNewText } = {}) {
  function listener (message, sender, sendResponse) {
    console.log('Text update received from popup', message);

    if (!message || message.type != 'TEXT_UPDATE') {
      sendResponse({
        status: 'FAILURE',
        reason: 'INVALID EVENT TYPE'
      });
      return true;
    }

    (async () => {
      try {
        if (onNewText && message.data && message.data.text) {
          await onNewText(message.data.text);
        }
        sendResponse({ status: 'SUCCESS' });
      } catch (err) {
        console.log(err);
        sendResponse({ status: 'FAILURE' });
      }
    })();
    return true;
  }

  chrome.runtime.onMessage.removeListener(listener);
  chrome.runtime.onMessage.addListener(listener);
}
