import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
        <div className="footer-content">
            <div className="footer-left">
                <div className="logo">
                    <svg className="logo-icon" viewBox="0 0 24 24" fill="var(--primary)">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <span>NEXUS</span>
                </div>
                <p className="footer-tagline">Sharded Discord ops · Neural economy · Companion web & API</p>
            </div>
            <div className="footer-links">
                <Link to="/commands">Commands</Link>
                <Link to="/wiki">Wiki</Link>
                <Link to="/faq">FAQ</Link>
                <Link to="/changelog">Changelog</Link>
                <Link to="/status">Network</Link>
                <a href="https://discord.gg/VgPETfTun2" target="_blank" rel="noreferrer">Uplink Support</a>
            </div>
        </div>
        <div className="footer-bottom">
            &copy; 2026 Nexus Protocol. All Rights Reserved.
        </div>
    </footer>
  );
}

export default Footer;
