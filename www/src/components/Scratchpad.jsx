import { useEffect, useState } from "react";

import DiscoveryService from "../service/Discovery";

const Scratchpad = () => {
  const [ peer, setPeer ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const peer = new DiscoveryService({
      onConnect: () => {
        setLoading(false)
      }
    });
    setPeer(peer);

    return function cleanup() {
      peer.kill();
    }
  }, []);

  return (
    <>
      {
        loading ? (
          <p>Loading...</p>
        ) : (
          <main className='scratchpad-container'>
            <section className='input-container'>
              <textarea className='scratchpad-input text-md' placeholder='Paste something here'>
              </textarea>
            </section>
            <section className='controls-container'>
              <p className='text-sm status-label' data-status='default'>Paste your text here</p>
              <div>
                <button className='text-sm success'>Save</button>
                <button className='text-sm failure'>Clear</button>
              </div>
            </section>
          </main>
        )
      }
    </>
  );
};
export default Scratchpad;
