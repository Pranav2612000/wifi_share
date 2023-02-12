import { useCallback, useEffect, useState } from "react";

import Loader from './Loader.jsx';
import DiscoveryService from "../service/Discovery";
import debounce from "../service/Debounce.js";

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
  const [ loading, setLoading ] = useState(true);
  const [ updating, setUpdating ] = useState(false);
  const [ text, setText ] = useState('');

  useEffect(() => {
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
      peer.kill();
    }
  }, []);

  const debouncedOnTextUpdate = useCallback(debounce((e) => {
    onTextUpdate(e);
  }), []);

  const onTextUpdate = (e) => {

    setUpdating(true);

    const peer = new DiscoveryService({});

    peer.sendUpdates(e.target.value);

    /* To check if autosaving state updates are working as expected */
    setTimeout(() => {
      setUpdating(false);
    }, 2000);
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
