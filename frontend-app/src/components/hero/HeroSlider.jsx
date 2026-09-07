import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Shield, Users } from 'lucide-react';
import './HeroSlider.css';

const slides = [
  {
    image: '/images/banners/slide1.png',
    tag: 'CAMPUS TO COMMUNITY',
    title: 'Give Your Books a Second Life, or Discover Your Next Great Read',
    desc: "India's ultimate campus-to-community marketplace. Buy, sell, rent, or swap pre-owned semester books securely.",
    btn1: { label: 'SHOP NOW', icon: true, path: '/explore' },
    btn2: { label: 'EXPLORE COLLECTION', path: '/categories' },
    stats: [
      { icon: 'truck', label: 'FREE SHIPPING', desc: 'On orders over \u20B9499' },
      { icon: 'shield', label: 'SECURE ESCROW', desc: 'Your money is safe with us' },
      { icon: 'users', label: 'VERIFIED SELLERS', desc: 'Quality books from trusted students' }
    ]
  },
  {
    image: '/images/banners/slide2.png',
    tag: 'SEMESTER RENTALS',
    title: 'Discounts Up To 70% OFF on Semester Rentals',
    desc: 'Save big on textbooks and academic books. Rent smarter, study better.',
    btn1: { label: 'BROWSE RENTALS', icon: true, path: '/explore?mode=rent' },
    btn2: { label: 'LIST A BOOK', path: '/sell' },
    stats: [
      { icon: 'truck', label: 'Best Prices', desc: 'Save up to 70%' },
      { icon: 'shield', label: 'Quality Assured', desc: 'Checked by students' },
      { icon: 'users', label: 'Quick & Easy', desc: 'Hassle-free rentals' }
    ]
  },
  {
    image: '/images/banners/slide3.png',
    tag: 'FOR AUTHORS',
    title: 'Are You an Independent Author?',
    desc: 'Bypass distributor margins, keep more from every sale, and build lasting connections with readers.',
    btn1: { label: 'EXPLORE AUTHOR PACKAGES', path: '/author' },
    btn2: { label: 'SUBMIT MANUSCRIPT', path: '/author/submit-book' },
    stats: [
      { icon: 'truck', label: 'Bypass Margins', desc: 'Keep more from every sale' },
      { icon: 'shield', label: 'Submit & Publish', desc: 'Easy manuscript submission' },
      { icon: 'users', label: 'Targeted Ads', desc: 'Reach active readers' }
    ]
  },
  {
    image: '/images/banners/slide4.png',
    tag: 'SAFE TRADING',
    title: 'Direct Campus Swapping & Safe Escrow Protection',
    desc: 'Chat instantly on socket. Keep your phone number private. 48-hour protection you can trust.',
    btn1: { label: 'START SWAPPING', icon: true, path: '/explore?mode=exchange' },
    btn2: { label: 'LEARN ABOUT ESCROW', path: '#trust-section' },
    stats: [
      { icon: 'truck', label: 'Instant Chat', desc: 'Socket-based messaging' },
      { icon: 'shield', label: 'Hidden Numbers', desc: 'Privacy guaranteed' },
      { icon: 'users', label: '48-Hour Escrow', desc: 'Secure delivery protection' }
    ]
  }
];

function StatIcon({ type }) {
  if (type === 'truck') return <Truck size={18} />;
  if (type === 'shield') return <Shield size={18} />;
  return <Users size={18} />;
}

export default function HeroSlider() {
  const navigate = useNavigate();
  var _s = useState(0);
  var index = _s[0];
  var setIndex = _s[1];
  var _h = useState(false);
  var hovering = _h[0];
  var setHovering = _h[1];

  // Touch swipe handling for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 45;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }
  };

  const handleButtonClick = (path) => {
    if (!path) return;
    if (path.startsWith('#')) {
      const el = document.querySelector(path);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  var next = useCallback(function() {
    setIndex(function(prev) { return (prev + 1) % slides.length; });
  }, []);

  var prev = useCallback(function() {
    setIndex(function(prev) { return (prev - 1 + slides.length) % slides.length; });
  }, []);

  useEffect(function() {
    if (hovering) return;
    var id = setTimeout(next, 5000);
    return function() { clearTimeout(id); };
  }, [hovering, index, next]);

  return (
    <div
      className="hero-slider"
      onMouseEnter={function() { setHovering(true); }}
      onMouseLeave={function() { setHovering(false); }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="hero-slider-track"
        style={{ transform: 'translateX(-' + (index * 100) + '%)' }}
      >
        {slides.map(function(s, i) {
          return (
            <div
              key={i}
              className={'hero-slide' + (i === index ? ' active' : '')}
              style={{ backgroundImage: 'url(' + s.image + ')' }}
            >
              <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 w-full flex items-center py-8 sm:py-12">
                <div className="hero-slide-content">
                  <span className="hero-slide-tag">{s.tag}</span>
                  <h1 className="hero-slide-title">{s.title}</h1>
                  <p className="hero-slide-desc">{s.desc}</p>
                  <div className="hero-slide-btns">
                    <button 
                      onClick={() => handleButtonClick(s.btn1.path)}
                      className="hero-btn-primary cursor-pointer"
                    >
                      <span>{s.btn1.label}</span>
                      {s.btn1.icon && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                    <button 
                      onClick={() => handleButtonClick(s.btn2.path)}
                      className="hero-btn-secondary cursor-pointer"
                    >
                      {s.btn2.label}
                    </button>
                  </div>

                  {/* Bullet Stats inside the slide */}
                  <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/15 grid grid-cols-2 sm:flex sm:flex-wrap gap-x-4 sm:gap-x-8 gap-y-3">
                    {s.stats.map(function(st, idx) {
                      return (
                        <div key={idx} className={`flex items-center gap-2.5 text-white/95 ${idx === 2 ? 'col-span-2 sm:col-span-1' : ''}`}>
                          <div className="text-white shrink-0 p-1 sm:p-1.5 bg-white/10 backdrop-blur-xs rounded-lg">
                            <StatIcon type={st.icon} />
                          </div>
                          <div>
                            <div className="text-[11px] sm:text-xs font-bold leading-tight">{st.label}</div>
                            <div className="text-[9px] sm:text-[10px] text-white/70 leading-tight mt-0.5">{st.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hero-slider-controls hidden md:flex">
        <button className="hero-slider-btn" onClick={prev} aria-label="Previous">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button className="hero-slider-btn" onClick={next} aria-label="Next">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="hero-slider-dots">
        {slides.map(function(_, i) {
          return (
            <button
              key={i}
              className={'hero-dot' + (i === index ? ' active' : '')}
              onClick={function() { setIndex(i); }}
              aria-label={'Slide ' + (i + 1)}
            />
          );
        })}
      </div>
    </div>
  );
}
