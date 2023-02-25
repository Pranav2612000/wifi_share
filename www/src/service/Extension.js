/*global chrome*/

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
