/*global chrome*/

import DiscoveryService from "./service/Discovery";
import {
  updateBadgeText,
  removeAllContextMenus,
  addContextMenus,
  updateContextMenu,
  setValueInChromeStorage,
  getValueFromChromeStorage
} from "./service/Extension";

let communicationPort;

const initializeDiscoveryService = () => {
  console.log('Starting discovery service in background');
  const peer = new DiscoveryService({
    onConnect: () => {
      return;
    },
    onPeerReady: () => {
      console.log('PR', communicationPort);
      communicationPort.postMessage('PEER_READY');
      return;
    },
    onNewText: (newText) => {
      return;
    }
  });

  return peer;
}

const terminateDiscoveryService = () => {
  console.log('Stopping discovery service');

  // get reference to the connected peer
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

  // and kill it
  peer.kill();

  return true;
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

  await initializeContextMenus(enabled);

  // We do nothing if the app is in OFF state
  if (enabled === false) {
    return;
  }

  // otherwise
  await _startApp();
};

const stopApp = async () => {
  const enabled = false;

  // toggle the app enabled state
  await toggleAppState(true);

  await updateBadgeText('OFF');

  terminateDiscoveryService();

  // actions to perform for stopping the app
  console.log('App stopped successfully');
}

const startApp = async () => {
  const enabled = true;

  // toggle the app enabled state
  await toggleAppState(false);

  // actions to perform for starting the app
  console.log('App started successfully');

  await _startApp();

  chrome.runtime.onConnect.addListener(function (port) {
    console.log("Port name", port.name);
    communicationPort = port;
    port.onDisconnect.addListener(( port ) => { console.log('Disconnected', port); });
  });
}

const _startApp = async () => {
  console.log('Starting the app');

  await updateBadgeText('ON');

  // start the discovery service
  initializeDiscoveryService();
}

initializeApp();
