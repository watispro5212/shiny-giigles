import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
        <div className="nav-container">
            <Link to="/" className="logo">
                <svg className="logo-icon" viewBox="0 0 24 24" fill="var(--primary)">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>NEXUS</span>
            </Link>
            <button className="hamburger" aria-label="Menu">
                <span></span><span></span><span></span>
            </button>
            <div className="nav-links">
                <Link to="/" className="active">Home</Link>
                <Link to="/commands">Commands</Link>
                <Link to="/features">Features</Link>
                <Link to="/dashboard">Dashboard</Link>
                <a href="https://discord.com/api/oauth2/authorize" className="btn btn-primary btn-sm">Initialize</a>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;
