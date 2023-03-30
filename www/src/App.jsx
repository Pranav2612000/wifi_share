import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Scratchpad from "./components/Scratchpad";
import { isExtension } from "./service/Extension";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Scratchpad />
      {!isExtension && (
        <section className="promote-extension banner">
          <h3>Want even quicker sharing?</h3>
          <a
            href="https://chrome.google.com/webstore/detail/wifi-share/kdjhpollblakokcnfhbgmallkelgncbn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download extension
          </a>
        </section>
      )}
      <Footer />
    </div>
  );
}

export default App;
