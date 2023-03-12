import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Scratchpad from "./components/Scratchpad";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Scratchpad />
      <Footer />
    </div>
  );
}

export default App;
