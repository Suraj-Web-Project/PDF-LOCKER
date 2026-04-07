import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Builder from './components/Builder';
import Admin from './components/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Builder />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;