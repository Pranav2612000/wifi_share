import { useCallback, useEffect, useState } from "react";

import Loader from './Loader.jsx';
import DiscoveryService from "../service/Discovery";
import debounce from "../service/Debounce.js";
import { isExtension } from "../service/Extension";

const getStatusElement = (isUpdating) => {
  if (isUpdating) {
    return (
      <p className='text-sm status-label' data-status='default'>Autosaving...</p>
    )
  }
  return (
    <p className='text-sm status-label' data-status='default'>Paste your text here</p>
  )
};

const Scratchpad = () => {
  const [ loading, setLoading ] = useState(false);
  const [ updating, setUpdating ] = useState(false);
  const [ text, setText ] = useState('');

  useEffect(() => {

    // If we are running this from an extension, we've already completed our connection
    // in our background script and so don't need to initialize DiscoveryService here
    if (isExtension) {
      return;
    }

    const peer = new DiscoveryService({
      onConnect: () => {
        return;
      },
      onPeerReady: () => {
        setLoading(false);
      },
      onNewText: (newText) => {
        setText(newText);
      }
    });

    return function cleanup() {
      // If we are running this inside an extension, the background.js will handle everything
      // we don't want to kill the peer right now.
      if (isExtension) {
        return;
      }

      peer.kill();
    }
  }, []);

  const debouncedOnTextUpdate = useCallback(debounce((e) => {
    onTextUpdate(e);
  }), []);

  const onTextUpdate = async (e) => {

    setUpdating(true);

    const peer = new DiscoveryService({});

    await peer.sendUpdates(e.target.value);
    setUpdating(false);
  };

  return (
    <main className='scratchpad-container'>
      {loading ? (
        <Loader/>
      ) : (
        <>
          <section className='input-container'>
            <textarea
              className='scratchpad-input text-md'
              placeholder='Paste something here'
              value={text}
              onKeyUp={(e) => debouncedOnTextUpdate(e)}
              onChange={(e) => setText(e.target.value)}
            >
            </textarea>
          </section>
          <section className='controls-container'>
            {getStatusElement(updating)}
            <div>
              <button className='text-sm success'>Save</button>
              <button className='text-sm failure'>Clear</button>
            </div>
          </section>
        </>
      )}
    </main>
  );
};
export default Scratchpad;
