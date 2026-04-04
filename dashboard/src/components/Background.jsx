import React from 'react';

function Background() {
  return (
    <div className="nexus-bg">
        <canvas id="network-canvas"></canvas>
        <div className="grid-overlay"></div>
        <div className="scanline"></div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
    </div>
  );
}

export default Background;
