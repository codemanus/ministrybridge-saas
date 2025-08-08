import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

export default function App() {
  return (
    <div style={{padding: 16}}>
      <h1>Tech & Production Module</h1>
      <nav style={{display: 'flex', gap: 12, marginBottom: 16}}>
        <Link to="/">Dashboard</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route index element={<div>Tech & Production Dashboard - Manage technical operations and production workflows</div>} />
        <Route path="about" element={<div>About Tech & Production Module - Technical operations and production management</div>} />
      </Routes>
    </div>
  );
}
