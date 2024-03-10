import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Account from './pages/Account';

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
