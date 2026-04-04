import React, { useEffect } from 'react';

function CustomCursor() {
  useEffect(() => {
    // Only apply if not on mobile/touch
    if(window.matchMedia("(any-pointer: fine)").matches) {
      document.body.classList.add('custom-cursor-enabled');
      
      const dot = document.createElement('div');
      dot.className = 'cursor-dot';
      
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      
      document.body.appendChild(dot);
      document.body.appendChild(trail);
      
      const onMouseMove = (e) => {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        
        // Slight delay for trail
        setTimeout(() => {
          trail.style.left = `${e.clientX}px`;
          trail.style.top = `${e.clientY}px`;
        }, 50);
      };
      
      window.addEventListener('mousemove', onMouseMove);
      
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        if (document.body.contains(dot)) document.body.removeChild(dot);
        if (document.body.contains(trail)) document.body.removeChild(trail);
        document.body.classList.remove('custom-cursor-enabled');
      };
    }
  }, []);

  return null;
}

export default CustomCursor;
