import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

function BaseHome() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Base Module</h2>
      <p>This is the Base feature remote.</p>
      <ul>
        <li><Link to="about">About</Link></li>
      </ul>
    </div>
  );
}

function About() {
  return <div style={{ padding: 16 }}>About the Base module.</div>;
}

export default function App() {
  return (
    <Routes>
      <Route index element={<BaseHome />} />
      <Route path="about" element={<About />} />
    </Routes>
  );
}
