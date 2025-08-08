import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

export default function App() {
  return (
    <div style={{padding: 16}}>
      <h1>Campus Module</h1>
      <nav style={{display: 'flex', gap: 12, marginBottom: 16}}>
        <Link to="/">Dashboard</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route index element={<div>Campus Dashboard - Manage campus locations and settings</div>} />
        <Route path="about" element={<div>About Campus Module - Location management and campus configuration</div>} />
      </Routes>
    </div>
  );
}
