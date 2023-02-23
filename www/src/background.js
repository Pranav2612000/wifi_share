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
        stopApp();
        break;
      case 'ON':
        startApp();
        break;
      default:
        break;
    }
  });

  console.log('Context Menus created successfully');
}

const updateContextMenu = async (id, properties) => {
  return new Promise((resolve, reject) => {
    chrome.contextMenus.update(id, properties, () => {
      resolve(true);
    });
  });
}

const toggleAppState = async (oldState) => {

  // fetch the current app state if it isn't passed
  let enabled = oldState;
  if (enabled === undefined || enabled === null) {
    enabled = await getValueFromChromeStorage('enabled');
  }

  // toggle the state 
  enabled = !enabled;

  // update and redraw the contextMenus
  await Promise.all([
    updateContextMenu( 'ON', { visible: !enabled, enabled: !enabled }),
    updateContextMenu( 'OFF', { visible: enabled, enabled: enabled }),
  ]);

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

const stopApp = async () => {
  const enabled = false;

  // toggle the app enabled state
  await toggleAppState(true);

  // actions to perform for stopping the app
  console.log('App stopped successfully');
}

const startApp = async () => {
  const enabled = true;

  // toggle the app enabled state
  await toggleAppState(false);

  // actions to perform for starting the app
  console.log('App started successfully');
}

initializeApp();
