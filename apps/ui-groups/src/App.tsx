import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

export default function App() {
  return (
    <div style={{padding: 16}}>
      <h1>Groups Module</h1>
      <nav style={{display: 'flex', gap: 12, marginBottom: 16}}>
        <Link to="/">Dashboard</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route index element={<div>Groups Dashboard - Manage small groups and communities</div>} />
        <Route path="about" element={<div>About Groups Module - Small group management and community building</div>} />
      </Routes>
    </div>
  );
}
