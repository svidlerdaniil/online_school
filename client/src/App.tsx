import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Account from './pages/Account';
import './scss/index.scss';
import './scss/reset.scss';
import ManagersTimetable from './pages/ManagersTimetable';
import Header from './components/Header';
import Students from './pages/Students';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/students" element={<Students />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/timetable" element={<ManagersTimetable />} />
        <Route path="*" element={<Navigate to="/account" />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
