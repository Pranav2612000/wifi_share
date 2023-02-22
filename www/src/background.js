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

const setValueInChromeStorage = async (key, value) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }).then(() => {
      resolve(true);
    });
  });
}

const getValueFromChromeStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key]).then((result) => {
      resolve(result[key]);
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

const initializeContextMenus = async (isAppEnabled) => {
  await removeAllContextMenus();
  await addContextMenus([
    {
      title: 'Switch ON',
      id: 'ON',
      visible: !isAppEnabled,
      enabled: !isAppEnabled
    },
    {
      title: 'Switch OFF',
      id: 'OFF',
      visible: isAppEnabled,
      enabled: isAppEnabled
    }
  ]);

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
      case 'OFF':
        killApp();
        break;
      case 'ON':
        initializeApp();
        break;
      default:
        break;
    }
  });

  console.log('Context Menus created successfully');
}

const toggleApp = async (data, tab) => {

  console.log('Callback called', data, tab);
  // fetch the current app state
  let enabled = await getValueFromChromeStorage('enabled');

  // toggle the state 
  enabled = !enabled;

  // redraw the contextMenus
  initializeContextMenus(enabled);

  // finally, update the state in chrome storage
  setValueInChromeStorage('enabled', enabled);
}

const initializeApp = async () => {
  console.log('Starting background service...');

  // fetch the current app state
  let enabled = await getValueFromChromeStorage('enabled');

  // if enabled is not defined ( first time after installing the app )
  // we set it to true by default
  if (enabled === undefined) {
    await setValueInChromeStorage('enabled', true);
    enabled = true;
  }

  initializeContextMenus(enabled);
};

const killApp = async () => {
  const enabled = false;

  // redraw the contextMenus
  initializeContextMenus(enabled);

  // finally, update the state in chrome storage
  setValueInChromeStorage('enabled', enabled);
}

initializeApp();
