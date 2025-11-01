import '@packages/ui-kit';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useCanAccess } from './permissions.js';
import axios from 'axios';

const BaseApp = React.lazy(() => import('ui_base/App'));
const CampusApp = React.lazy(() => import('ui_campus/App'));
const GroupsApp = React.lazy(() => import('ui_groups/App'));
const StudentsApp = React.lazy(() => import('ui_students/App'));
const TechProdApp = React.lazy(() => import('ui_tech_prod/App'));

function Home() {
  const [apiUrl, setApiUrl] = React.useState('http://localhost:4000');
  const [resp, setResp] = React.useState<any>(null);
  const [err, setErr] = React.useState('');
  const canCampus = useCanAccess('ui_campus');
  const canGroups = useCanAccess('ui_groups');
  const canStudents = useCanAccess('ui_students');
  const canTech = useCanAccess('ui_tech_prod');

  const check = async () => {
    setErr(''); setResp(null);
    try { const r = await axios.get(`${apiUrl}/health`); setResp(r.data); }
    catch (e:any) { setErr(e.message || 'Request failed'); }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">MinistryBridge SaaS (Shell)</h1>
      <div className="mb-4">
        API URL:&nbsp;
        <input className="w-80 border border-gray-300 rounded px-2 py-1" value={apiUrl} onChange={e=>setApiUrl(e.target.value)} />
        <button onClick={check} className="ml-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Check /health</button>
      </div>
      {resp && <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(resp,null,2)}</pre>}
      {err && <div className="text-red-600">{err}</div>}
      <hr className="my-4"/>
      <nav className="flex gap-3">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <Link to="/base" className="text-blue-600 hover:underline">Base Module</Link>
        {canCampus && <Link to="/campus" className="text-blue-600 hover:underline">Campus</Link>}
        {canGroups && <Link to="/groups" className="text-blue-600 hover:underline">Groups</Link>}
        {canStudents && <Link to="/students" className="text-blue-600 hover:underline">Students</Link>}
        {canTech && <Link to="/tech" className="text-blue-600 hover:underline">Tech & Production</Link>}
      </nav>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/base/*" element={<React.Suspense fallback="Loading…"><BaseApp/></React.Suspense>} />
        <Route path="/campus/*" element={<React.Suspense fallback="Loading…"><CampusApp/></React.Suspense>} />
        <Route path="/groups/*" element={<React.Suspense fallback="Loading…"><GroupsApp/></React.Suspense>} />
        <Route path="/students/*" element={<React.Suspense fallback="Loading…"><StudentsApp/></React.Suspense>} />
        <Route path="/tech/*" element={<React.Suspense fallback="Loading…"><TechProdApp/></React.Suspense>} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<App/>);
