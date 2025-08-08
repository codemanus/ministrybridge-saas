import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

const BaseApp = React.lazy(() => import('ui_base/App'));

function Home() {
  const [apiUrl, setApiUrl] = React.useState('http://localhost:4000');
  const [resp, setResp] = React.useState<any>(null);
  const [err, setErr] = React.useState('');

  const check = async () => {
    setErr(''); setResp(null);
    try { const r = await axios.get(`${apiUrl}/health`); setResp(r.data); }
    catch (e:any) { setErr(e.message || 'Request failed'); }
  };

  return (
    <div style={{padding:16}}>
      <h1>MinistryBridge SaaS (Shell)</h1>
      <div>
        API URL:&nbsp;
        <input style={{width:320}} value={apiUrl} onChange={e=>setApiUrl(e.target.value)} />
        <button onClick={check} style={{marginLeft:8}}>Check /health</button>
      </div>
      {resp && <pre>{JSON.stringify(resp,null,2)}</pre>}
      {err && <div style={{color:'crimson'}}>{err}</div>}
      <hr/>
      <nav style={{display:'flex',gap:12}}>
        <Link to="/">Home</Link>
        <Link to="/base">Base Module</Link>
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
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<App/>);
