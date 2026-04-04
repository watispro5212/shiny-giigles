import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <main>
      <section className="home-hero-wrap" aria-label="Introduction">
          <div className="home-hero">
              <div className="home-hero-copy">
                  <div className="badge reveal">Protocol v7.0 · Nexus Architecture</div>
                  <h1 className="hero-title reveal home-hero-title">
                      <span className="text-gradient">Complete integration</span><br />
                      <span className="home-hero-title-line2">without limits.</span>
                  </h1>
                  <p className="hero-desc reveal home-hero-lead">Global heuristic moderation, cross-sector dynamic economies, interactive dashboard controls, and real-time telemetry powered by an elevated neural stack.</p>
                  <div className="btn-group reveal">
                      <a href="#" className="btn btn-primary">Add to Discord</a>
                      <Link to="/commands" className="btn btn-outline">Browse commands</Link>
                  </div>
                  <p className="home-hero-note reveal">Now streaming on a high-availability Vite + React web interface.</p>
              </div>
              <aside className="home-hero-panel reveal" aria-hidden="true">
                  <div className="home-hero-panel-glow"></div>
                  <div className="home-hero-panel-inner">
                      <div className="home-hero-panel-top">
                          <span className="home-mono-tag">NEXUS_CORE</span>
                          <span className="home-mono-ver">v7.0.0</span>
                      </div>
                      <div className="home-terminal-lines">
                          <p><span className="home-term-prompt">›</span> <span className="home-term-ok">oauth2_sync</span> <span className="home-term-dim">............</span> <span className="home-term-ok">READY</span></p>
                          <p><span className="home-term-prompt">›</span> <span className="home-term-ok">memory_cache</span> <span className="home-term-dim">.........</span> <span className="home-term-val">ONLINE</span></p>
                          <p><span className="home-term-prompt">›</span> <span className="home-term-ok">shard_cluster</span> <span className="home-term-dim">........</span> <span className="home-term-val">ACTIVE</span></p>
                          <p><span className="home-term-prompt">›</span> <span className="home-term-ok">companion_app</span> <span className="home-term-dim">........</span> <span className="home-term-val">MOUNTED</span></p>
                      </div>
                      <div className="home-progress">
                          <div className="home-progress-label"><span>Routing Efficiency</span><span className="home-term-ok">100%</span></div>
                          <div className="home-progress-bar" role="presentation"><span className="home-progress-fill" style={{width: '100%'}}></span></div>
                      </div>
                  </div>
              </aside>
          </div>

          <div className="stats-grid home-stats reveal">
              <div className="stat-item">
                  <span className="stat-number">In-Memory</span>
                  <span className="stat-label">Caching Layer</span>
              </div>
              <div className="stat-item">
                  <span className="stat-number">Live</span>
                  <span className="stat-label">Dashboard UI</span>
              </div>
              <div className="stat-item">
                  <span className="stat-number">Dynamic</span>
                  <span className="stat-label">Heuristics</span>
              </div>
              <div className="stat-item">
                  <span className="stat-number">Global</span>
                  <span className="stat-label">Economy Sync</span>
              </div>
          </div>
      </section>

      <section className="section home-signal-section" id="features">
          <div className="section-header reveal">
              <span className="section-label">Capabilities</span>
              <h2 className="section-title">Systems online</h2>
              <p className="hero-desc home-section-lead">Everything is modular and now controllable via the web dashboard.</p>
          </div>
          <div className="home-features-grid feature-grid">
              <article className="card reveal card-home-featured">
                  <div className="card-home-featured-inner">
                      <div className="card-home-featured-visual" aria-hidden="true">💎</div>
                      <div className="card-home-featured-copy">
                          <h3>Advanced Economy</h3>
                          <p>Cross-server leaderboards, dynamic inflation loops, and quest skill trees that actually feel rewarding.</p>
                      </div>
                  </div>
              </article>
              <article className="card reveal">
                  <div className="card-icon">🛡️</div>
                  <h3>Auto-Mod 2.0</h3>
                  <p>Escalating warning strikes, dynamic filtering, and interactive mod logs for staff.</p>
              </article>
              <article className="card reveal">
                  <div className="card-icon">⚡</div>
                  <h3>Telemetry Feed</h3>
                  <p>Live stream of server security events and command usage straight to your browser.</p>
              </article>
          </div>
      </section>
    </main>
  );
}

export default Home;
