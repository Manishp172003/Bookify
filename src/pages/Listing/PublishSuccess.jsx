import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PublishSuccess() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Generate random Listing ID on mount
  const listingIdRef = useRef("BKFY-" + Math.floor(100000 + Math.random() * 900000));
  const listingId = listingIdRef.current;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    const colors = ['#6C4BF4', '#FF8A3D', '#10B981', '#3B82F6', '#EC4899', '#F59E0B'];
    const particles = Array.from({ length: 130 }).map(() => {
      // Explode from bottom center
      const angle = (Math.random() * Math.PI / 3) + Math.PI / 3; // roughly upward
      const speed = Math.random() * 18 + 12;
      return {
        x: canvas.width / 2,
        y: canvas.height * 0.8,
        r: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.08 + 0.03,
        tiltAngle: 0,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.sin(angle) * speed,
      };
    });

    let animationFrameId;
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += p.vy;
        p.x += p.vx;
        
        // physics
        p.vy += 0.45; // gravity
        p.vx *= 0.98; // drag
        p.tilt = Math.sin(p.tiltAngle) * 12;

        // Keep rendering if at least one particle is within screen bounds
        if (p.y <= canvas.height && p.x >= 0 && p.x <= canvas.width) {
          active = true;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      if (active) {
        animationFrameId = requestAnimationFrame(update);
      }
    };

    update();
    
    window.addEventListener('resize', setCanvasSize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <div className="relative max-w-xl mx-auto py-12 px-4">
      {/* Absolute overlay canvas for confetti */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none z-50"
      />

      <div className="bg-cards p-8 md:p-12 rounded-3xl border border-gray-200/50 shadow-md text-center relative z-10 animate-bounceIn">
        
        {/* Animated Check Circle */}
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs border border-green-200/40">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-text-main mb-3 font-poppins">
          Your book is live!
        </h1>
        <p className="text-gray-500 font-inter text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          Students at your campus can now discover and purchase your textbook. Keep an eye on your messages!
        </p>

        {/* Listing ID Box */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl py-4 px-6 mb-8 inline-block">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-inter">
            Listing ID
          </span>
          <span className="text-lg font-mono font-bold text-primary tracking-wider">
            {listingId}
          </span>
        </div>

        {/* Button Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/listings')}
            className="bg-cta hover:bg-cta/90 text-white font-bold py-3.5 px-8 rounded-xl text-sm transition cursor-pointer font-inter shadow-xs"
          >
            View My Listings
          </button>
          <button
            onClick={() => navigate('/sell')}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-6 rounded-xl text-sm transition cursor-pointer font-inter"
          >
            List Another Book
          </button>
        </div>

      </div>
    </div>
  );
}
