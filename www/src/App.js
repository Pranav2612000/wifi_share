import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Scratchpad from './components/Scratchpad.jsx';
import './App.css';
import DiscoveryService from './service/Discovery';

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
