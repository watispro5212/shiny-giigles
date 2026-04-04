import React, { useState } from 'react';
import { Server, Activity, ArrowUpRight, Cpu } from 'lucide-react';

function Status() {
  const [stats] = useState({
    shards: 3,
    latency: 42,
    guilds: 1450,
    uptime: "99.98%"
  });

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="section" style={{ padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-label">Real-Time</span>
            <h2 className="section-title">Network Status</h2>
            <p className="hero-desc">Global shard health and system metrics.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto', marginBottom: '4rem' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Server size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>Active Shards</h3>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{stats.shards}</span>
            </div>
            
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Activity size={40} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>Gateway Latency</h3>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{stats.latency}ms</span>
            </div>
            
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Cpu size={40} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>Connected Sectors</h3>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{stats.guilds}</span>
            </div>
            
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <ArrowUpRight size={40} color="#00FF88" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>Global Uptime</h3>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{stats.uptime}</span>
            </div>
        </div>

        <div className="terminal-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="terminal-header">
                <div className="terminal-dots">
                    <div className="dot red"></div>
                    <div className="dot yellow"></div>
                    <div className="dot green"></div>
                </div>
                <div className="terminal-label">SHARD_ROUTING_TABLE</div>
            </div>
            <div className="terminal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[0, 1, 2].map((id) => (
                    <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <div>
                            <span style={{ color: 'var(--primary)', fontFamily: 'monospace', fontWeight: 'bold' }}>SHARD_00{id}</span>
                            <span style={{ color: 'var(--text-dim)', marginLeft: '1rem', fontSize: '0.85rem' }}>AUTO-SCALED · EU_CENTRAL</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#00FF88', fontSize: '0.85rem', fontWeight: 'bold' }}>ONLINE</span>
                            <div className="dot green" style={{ boxShadow: '0 0 10px #00FF88', animation: 'pulse 2s infinite' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </main>
  );
}

export default Status;
