import '@packages/ui-kit';
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Separator } from '@packages/ui-kit';

export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Groups Module</h1>
      <nav className="flex gap-3 mb-4">
        <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
        <Link to="/about" className="text-blue-600 hover:underline">About</Link>
      </nav>
      <Routes>
        <Route index element={
          <Card>
            <CardHeader>
              <CardTitle>Groups Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Badge>Active</Badge>
                <Badge variant="secondary">Onboarding</Badge>
              </div>
              <p className="text-gray-600 mb-4">Manage small groups and communities</p>
              <Separator className="my-3" />
              <div className="flex gap-2">
                <Button>Create Group</Button>
                <Button variant="secondary">Invite Members</Button>
              </div>
            </CardContent>
          </Card>
        } />
        <Route path="about" element={
          <Card>
            <CardHeader>
              <CardTitle>About Groups Module</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Small group management and community building</p>
            </CardContent>
          </Card>
        } />
      </Routes>
    </div>
  );
}
