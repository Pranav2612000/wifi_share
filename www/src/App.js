import { useEffect } from "react";
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Scratchpad from './components/Scratchpad.jsx';
import './App.css';
import {isExtension, getValueFromChromeStorage} from './service/Extension';

function App() {

  useEffect(() => {
    const getAppState = async () => {
      if (isExtension) {
        const enabled = await getValueFromChromeStorage('enabled');
        console.log({ enabled });
      }
    };

    getAppState();
  }, []);

  return (
    <div className="App">
      <Header />
      <Scratchpad />
      <Footer />
    </div>
  );
}

export default App;
