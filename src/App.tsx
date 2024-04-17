import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Allocation from './pages/Allocation/Allocation';
import { WalletContextProvider } from './contexts/WalletContext';

function App() {
  if (typeof window !== 'undefined' && !window.Buffer) {
    window.Buffer = require('buffer').Buffer;
  }
  return (
    <WalletContextProvider>
      <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/allocation" element={<Allocation />} />
            {/* <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NoPage />} /> */}
        </Routes>
      </BrowserRouter>
    </WalletContextProvider>
  );
}

export default App;