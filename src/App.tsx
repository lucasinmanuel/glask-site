import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Allocation from './pages/Allocation';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/allocation" element={<Allocation />} />
          {/* <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
