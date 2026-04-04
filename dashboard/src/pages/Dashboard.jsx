import React, { useState } from 'react';
import { Settings, Shield, Activity, Database, LogOut } from 'lucide-react';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="section" style={{ padding: '0 2rem' }}>
        <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
          
          {/* Sidebar */}
          <aside className="dashboard-sidebar" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', height: 'fit-content', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <img src="https://cdn.discordapp.com/embed/avatars/0.png" alt="User Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary)' }}>AdminUser</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Nexus Architect</span>
              </div>
            </div>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                onClick={() => setActiveTab('overview')} 
                style={{ background: activeTab === 'overview' ? 'rgba(0,255,234,0.1)' : 'transparent', color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-dim)', border: 'none', padding: '10px 15px', borderRadius: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: '0.2s', fontWeight: 'bold' }}>
                <Activity size={18} /> Network Overview
              </button>
              <button 
                onClick={() => setActiveTab('automod')} 
                style={{ background: activeTab === 'automod' ? 'rgba(0,255,234,0.1)' : 'transparent', color: activeTab === 'automod' ? 'var(--primary)' : 'var(--text-dim)', border: 'none', padding: '10px 15px', borderRadius: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: '0.2s', fontWeight: 'bold' }}>
                <Shield size={18} /> Auto-Mod Settings
              </button>
              <button 
                onClick={() => setActiveTab('economy')} 
                style={{ background: activeTab === 'economy' ? 'rgba(0,255,234,0.1)' : 'transparent', color: activeTab === 'economy' ? 'var(--primary)' : 'var(--text-dim)', border: 'none', padding: '10px 15px', borderRadius: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: '0.2s', fontWeight: 'bold' }}>
                <Database size={18} /> Economy Control
              </button>
              <button 
                onClick={() => setActiveTab('config')} 
                style={{ background: activeTab === 'config' ? 'rgba(0,255,234,0.1)' : 'transparent', color: activeTab === 'config' ? 'var(--primary)' : 'var(--text-dim)', border: 'none', padding: '10px 15px', borderRadius: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: '0.2s', fontWeight: 'bold' }}>
                <Settings size={18} /> Guild Config
              </button>
            </nav>
            
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <button style={{ background: 'transparent', color: 'var(--accent)', border: 'none', padding: '10px 15px', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                <LogOut size={18} /> Sever Link
              </button>
            </div>
          </aside>
          
          {/* Main Dashboard Area */}
          <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', backdropFilter: 'blur(10px)' }}>
              <h2 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {activeTab === 'overview' && <><Activity size={24}/> Network Overview</>}
                {activeTab === 'automod' && <><Shield size={24}/> Auto-Mod Tuning</>}
                {activeTab === 'economy' && <><Database size={24}/> Economy Core</>}
                {activeTab === 'config' && <><Settings size={24}/> Global Variables</>}
              </h2>
              
              <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
                Modify your server sector parameters live. Changes bypass the Discord UI and synchronize directly to the primary cluster.
              </p>
              
              {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div className="card">
                     <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'white' }}>Server Status</h3>
                     <p style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 'bold' }}>ONLINE</p>
                   </div>
                   <div className="card">
                     <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'white' }}>Active Warnings</h3>
                     <p style={{ fontSize: '2rem', color: 'var(--accent)', fontWeight: 'bold' }}>3</p>
                   </div>
                   <div className="card" style={{ gridColumn: '1 / -1' }}>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'white' }}>Live Feed [MOCK]</h3>
                      <div className="terminal-container" style={{ padding: '0' }}>
                        <div className="terminal-header"><div className="terminal-label">NEXUS_EVENT_STREAM</div></div>
                        <div style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--primary)' }}>
                          <p>{`> [TELEMETRY] Auth signal linked to dashboard.`}</p>
                          <p>{`> [ECONOMY] Transaction: AdminUser requested network cache status.`}</p>
                        </div>
                      </div>
                   </div>
                </div>
              )}
              
              {activeTab === 'automod' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                      <div>
                        <h4>Advanced Spam Heuristics</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Automatically isolate fast-posters and botnets.</span>
                      </div>
                      <label className="switch" style={{ cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)', transform: 'scale(1.5)' }} />
                      </label>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                      <div>
                        <h4>Link Scanner</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Block unverified hyperlinks and phishing domains.</span>
                      </div>
                      <label className="switch" style={{ cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary)', transform: 'scale(1.5)' }} />
                      </label>
                   </div>
                </div>
              )}
              
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
