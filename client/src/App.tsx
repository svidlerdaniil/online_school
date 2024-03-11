import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Account from './pages/Account';
import './scss/index.scss';
import './scss/reset.scss';
import Timetable from './pages/Timetable';

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="*" element={<Navigate to="/account" />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
