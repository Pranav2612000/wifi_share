import { React, useCallback, useEffect, useState } from "react";

import Loader from "./Loader";
import DiscoveryService from "../service/Discovery";
import debounce from "../service/Debounce";
import {
  isExtension,
  getValueFromChromeStorage,
  connectScratchpadStateWithBackground,
  sendTextUpdateToBackground,
} from "../service/Extension";
import { wait } from "../service/Utils";
import constants from "../config/constants";

const { SCRATCHPAD_STATUS } = constants;

const getStatusElement = (status) => {
  if (status === SCRATCHPAD_STATUS.SAVING) {
    return (
      <p className="text-sm status-label" data-status="default">
        Autosaving...
      </p>
    );
  }

  if (status === SCRATCHPAD_STATUS.SAVED) {
    return (
      <p className="text-sm status-label" data-status="saved">
        Saved
      </p>
    );
  }
  return (
    <p className="text-sm status-label" data-status="default">
      Paste your text here
    </p>
  );
};

function Scratchpad() {
  const [enabled, setIsEnabled] = useState(true);
  const [enabledLoading, setIsEnabledLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [status, setStatus] = useState(SCRATCHPAD_STATUS.IDLE);

  const setExtensionState = async () => {
    const isExtensionEnabled = await getValueFromChromeStorage("enabled");
    setIsEnabled(isExtensionEnabled);
    setIsEnabledLoading(false);
  };

  useEffect(() => {
    // If we are running this from an extension, we've already completed our connection
    // in our background script and so don't need to initialize DiscoveryService here
    if (isExtension) {
      setExtensionState();
      return () => {};
    }

    new DiscoveryService({
      onConnect: () => {},
      onDisconnect: () => {
        setLoading(true);
      },
      onPeerReady: () => {
        setLoading(false);
      },
      onNewText: (newText) => {
        setText(newText);
      },
    });

    return function cleanup() {
      // If we are running this inside an extension, the background.js will handle everything
      // we don't want to kill the peer right now.
      if (isExtension) {
        return;
      }

      DiscoveryService.kill();
    };
  }, []);

  useEffect(() => {
    if (enabledLoading === true || enabled === false) {
      return () => {};
    }

    const { closeConnection } = connectScratchpadStateWithBackground({
      setLoading,
      setText,
    });

    return function cleanup() {
      closeConnection();
    };
  }, [enabledLoading]);

  const onTextUpdate = async (newText) => {
    setStatus(SCRATCHPAD_STATUS.SAVING);

    let updateTextPromise;
    if (isExtension) {
      updateTextPromise = sendTextUpdateToBackground(newText);
    } else {
      const peer = new DiscoveryService();
      updateTextPromise = peer.sendUpdates(newText);
    }

    // Sometimes the update completes almost immediately and the 'Autosaving...' text
    // is shown for a very short duration. To give the impression that we are doing something
    // behind the screens we are waiting for 1500ms before hiding the message. The following code
    // is a hacky way which allows us to do this
    await Promise.all([updateTextPromise, wait(1500)]);

    setStatus(SCRATCHPAD_STATUS.SAVED);

    setTimeout(() => {
      setStatus(SCRATCHPAD_STATUS.IDLE);
    }, 3000);
  };

  const debouncedOnTextUpdate = useCallback(
    debounce((currentText) => {
      onTextUpdate(currentText);
    }),
    []
  );

  const onTextClear = () => {
    setText("");
    debouncedOnTextUpdate("");
  };

  if (isExtension && !enabled) {
    return (
      <p className="text-md" data-enabled={enabled}>
        {" "}
        Please switch ON the app to start sharing text{" "}
      </p>
    );
  }

  return (
    <main className="scratchpad-container">
      {loading ? (
        <Loader />
      ) : (
        <>
          <section className="input-container">
            <textarea
              className="scratchpad-input text-md"
              placeholder="Paste something here"
              value={text}
              onKeyUp={(e) => debouncedOnTextUpdate(e.target.value)}
              onChange={(e) => setText(e.target.value)}
            />
          </section>
          <section className="controls-container">
            {getStatusElement(status)}
            <div>
              <button
                type="button"
                className="text-sm success"
                onClick={() => onTextUpdate(text)}
              >
                Save
              </button>
              <button
                type="button"
                className="text-sm failure"
                onClick={onTextClear}
              >
                Clear
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
export default Scratchpad;
