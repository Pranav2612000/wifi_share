const Scratchpad = () => {
  return (
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
  );
};
export default Scratchpad;
