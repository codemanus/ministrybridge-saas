import '@packages/ui-kit';
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Label } from '@packages/ui-kit';

export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Students Module</h1>
      <nav className="flex gap-3 mb-4">
        <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
        <Link to="/about" className="text-blue-600 hover:underline">About</Link>
      </nav>
      <Routes>
        <Route index element={
          <Card>
            <CardHeader>
              <CardTitle>Students Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage student records and information</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="first">First Name</Label>
                  <Input id="first" placeholder="Jane" />
                </div>
                <div>
                  <Label htmlFor="last">Last Name</Label>
                  <Input id="last" placeholder="Doe" />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button>Save</Button>
                <Button variant="secondary">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        } />
        <Route path="about" element={
          <Card>
            <CardHeader>
              <CardTitle>About Students Module</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Student management and record keeping</p>
            </CardContent>
          </Card>
        } />
      </Routes>
    </div>
  );
}
