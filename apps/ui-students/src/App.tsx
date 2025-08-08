import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

export default function App() {
  return (
    <div style={{padding: 16}}>
      <h1>Students Module</h1>
      <nav style={{display: 'flex', gap: 12, marginBottom: 16}}>
        <Link to="/">Dashboard</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route index element={<div>Students Dashboard - Manage student records and information</div>} />
        <Route path="about" element={<div>About Students Module - Student management and record keeping</div>} />
      </Routes>
    </div>
  );
}
