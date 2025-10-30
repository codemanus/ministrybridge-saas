import '@packages/ui-kit';
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, CardContent, Tooltip, TooltipTrigger, TooltipContent, Separator } from '@packages/ui-kit';

export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tech & Production Module</h1>
      <nav className="flex gap-3 mb-4">
        <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
        <Link to="/about" className="text-blue-600 hover:underline">About</Link>
      </nav>
      <Routes>
        <Route index element={
          <Card>
            <CardHeader>
              <CardTitle>Tech & Production Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage technical operations and production workflows</p>
              <Separator className="my-3" />
              <Tooltip>
                <TooltipTrigger>
                  <Button>Run Checklists</Button>
                </TooltipTrigger>
                <TooltipContent>Execute pre-event checklists</TooltipContent>
              </Tooltip>
              <Button variant="secondary" className="ml-2">Manage Equipment</Button>
            </CardContent>
          </Card>
        } />
        <Route path="about" element={
          <Card>
            <CardHeader>
              <CardTitle>About Tech & Production Module</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Technical operations and production management</p>
            </CardContent>
          </Card>
        } />
      </Routes>
    </div>
  );
}
