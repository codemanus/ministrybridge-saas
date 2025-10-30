import '@packages/ui-kit';
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@packages/ui-kit';

export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Base Module</h1>
      <nav className="flex gap-3 mb-4">
        <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
        <Link to="/about" className="text-blue-600 hover:underline">About</Link>
      </nav>
      <Routes>
        <Route index element={
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Base Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Manage core system settings and configurations</p>
                <div className="flex gap-2">
                  <Button variant="default">Primary Action</Button>
                  <Button variant="secondary">Secondary Action</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        } />
        <Route path="about" element={
          <Card>
            <CardHeader>
              <CardTitle>About Base Module</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Core system management and configuration module</p>
            </CardContent>
          </Card>
        } />
      </Routes>
    </div>
  );
}
