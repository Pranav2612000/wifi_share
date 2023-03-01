/*global chrome*/

import DiscoveryService from "./service/Discovery";
import {
  updateBadgeText,
  removeAllContextMenus,
  addContextMenus,
  updateContextMenu,
  setValueInChromeStorage,
  getValueFromChromeStorage,
  connectBackgroundWithScratchpad
} from "./service/Extension";

let communicationPort;


const sendStateToPopup = (message) => {
  // If no communication Port is set up. We don't need to send
  // the state update
  if (!communicationPort) {
    return;
  }

  communicationPort.postMessage({
    type: 'STATE',
    data: message
  });
}

const onBroadcastingChannelConnect = (port) => {
  communicationPort = port;

  const peer = new DiscoveryService();
  port.postMessage({
    type: 'STATE',
    data: {
      loading: peer.isLoading(),
      text: peer.getText()
    }
  });
}

const onBroadcastingChannelDisconnect = () => {
  communicationPort = null;
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
    },
    onStateUpdate: sendStateToPopup
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
}

const _startApp = async () => {
  console.log('Starting the app');

  await updateBadgeText('ON');

  // start the discovery service
  initializeDiscoveryService();
  connectBackgroundWithScratchpad(onBroadcastingChannelConnect, onBroadcastingChannelDisconnect);
}

initializeApp();
