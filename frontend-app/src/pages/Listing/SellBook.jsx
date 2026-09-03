import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SellBook() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Sell, Rent, Exchange or Donate',
      description: 'Choose how you want to list your book. Set your own terms: sell for cash, rent by semester, swap, or donate.',
      badge: 'Flexible Options',
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      title: 'Safe & Secure Transactions',
      description: 'Meet safely on campus or choose secure payments and trackable shipping options with student buyer protection.',
      badge: '100% Secure',
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Reach Verified Students',
      description: 'Your listings are shown directly to students at your university, verified using their official campus emails.',
      badge: 'Campus Network',
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Best Prices & Great Deals',
      description: 'By bypassing traditional bookstore middlemen, you get maximum value back while offering students affordable prices.',
      badge: 'Top Value',
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-2">
      
      {/* Hero Banner - Single Seamless Container with Image Background */}
      <div 
        className="relative overflow-hidden rounded-[24px] shadow-lg min-h-[380px] lg:h-[400px] mb-10 flex items-center bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: 'url("/hero_banner.png")' }}
      >
        {/* Overlay Content placed in the left-side empty area */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md pl-6 md:pl-20 py-8 flex flex-col justify-center items-start text-left select-none">
          <span className="inline-block bg-white/20 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
            Bookify Marketplace
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[46px] font-extrabold tracking-tight mb-4 font-poppins text-white leading-tight">
            Sell Your Book
          </h1>
          <p className="text-base text-white/85 mb-8 font-inter leading-relaxed">
            List your books in minutes and reach thousands of students.
          </p>
          <button
            onClick={() => navigate('/sell/isbn')}
            className="bg-cta hover:bg-cta/90 hover:scale-[1.02] active:scale-98 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md shadow-cta/25 transition duration-200 transform cursor-pointer font-inter"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-main mb-2 font-poppins">Why Sell on Bookify?</h2>
        <p className="text-gray-500 font-inter text-sm">Join the largest student peer-to-peer textbook marketplace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-cards p-6 rounded-2xl border border-gray-200/50 shadow-xs hover:shadow-md transition duration-200 flex gap-4 items-start"
          >
            <div className="p-3 bg-primary/10 rounded-xl shrink-0">
              {feature.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h3 className="font-bold text-text-main text-lg font-poppins leading-tight">
                  {feature.title}
                </h3>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {feature.badge}
                </span>
              </div>
              <p className="text-gray-500 font-inter text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
