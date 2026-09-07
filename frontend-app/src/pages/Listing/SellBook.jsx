import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Repeat, 
  BookOpen, 
  Wallet, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  Check, 
  Zap, 
  Camera, 
  HeartHandshake 
} from 'lucide-react';

export default function SellBook() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { value: '₹1.5M+', label: 'Earned by Students', desc: 'Direct cash & semester rentals' },
    { value: '48 Hours', label: 'Average Sale Speed', desc: 'Fast campus handoffs' },
    { value: '100% Escrow', label: 'Buyer & Seller Safe', desc: 'Funds held securely until inspection' },
    { value: '₹0 Fees', label: 'Direct Campus Pickup', desc: 'No commission on peer swaps' }
  ];

  const steps = [
    {
      step: '01',
      title: 'Scan or Enter ISBN',
      desc: 'Type the 13-digit ISBN or book title. We automatically auto-fill author, edition, publisher, and standard MRP.',
      icon: BookOpen
    },
    {
      step: '02',
      title: 'Set Condition & Price',
      desc: 'Grade your book condition honestly, upload real photos, and pick whether you want to Sell, Rent, Swap, or Donate.',
      icon: TagIcon
    },
    {
      step: '03',
      title: 'Meet or Ship & Get Paid',
      desc: 'Chat via direct messages, hand over the book at campus library, and get payment released instantly to your wallet.',
      icon: Wallet
    }
  ];

  const modes = [
    {
      title: 'Sell for Cash',
      desc: 'List your pre-owned semester books and pocket cash directly without textbook store markdown cuts.',
      tag: 'Most Popular',
      color: 'border-purple-200 bg-purple-50/50 text-[#6C4BF4]',
      badgeBg: 'bg-[#6C4BF4] text-white',
      icon: Wallet
    },
    {
      title: 'Semester Rentals',
      desc: 'Rent textbooks to juniors for a term. Keep ownership of your books and earn passive semester income.',
      tag: 'Recurring Income',
      color: 'border-blue-200 bg-blue-50/50 text-blue-600',
      badgeBg: 'bg-blue-600 text-white',
      icon: Clock
    },
    {
      title: 'Direct Campus Swap',
      desc: 'Trade last semester’s books for the ones you need next semester with verified students at zero cost.',
      tag: 'Zero Cost',
      color: 'border-amber-200 bg-amber-50/50 text-amber-600',
      badgeBg: 'bg-amber-600 text-white',
      icon: Repeat
    },
    {
      title: 'Free Book Donation',
      desc: 'Give study guides and reference materials a second life by gifting them to juniors who need them most.',
      tag: 'Community Goodwill',
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-600',
      badgeBg: 'bg-emerald-600 text-white',
      icon: HeartHandshake
    }
  ];

  const faqs = [
    {
      q: 'How does Bookify Escrow protect me as a seller?',
      a: 'When a buyer places an order, the money is securely pre-authorized and held in Bookify Escrow. Once you meet on campus and the buyer confirms receipt (or after 48-hour delivery inspection), the payout is immediately released to your wallet.'
    },
    {
      q: 'Can I sell non-academic or competitive exam books?',
      a: 'Yes! You can list university textbooks, NEET/JEE/GATE prep guides, UPSC references, novels, and children’s literature.'
    },
    {
      q: 'How do I hand over the book to a buyer?',
      a: 'You can choose between "Campus Handshake" (meet at a library, canteen, or campus landmark with zero shipping fee) or "Doorstep Delivery" with tracked courier packaging.'
    },
    {
      q: 'What if the buyer cancels or does not show up?',
      a: 'If a buyer misses a confirmed campus meetup, your listing automatically remains active. If they paid online and fail to show, our dispute team resolves it within 24 hours.'
    }
  ];

  function TagIcon(props) {
    return <Sparkles {...props} />;
  }

  return (
    <div className="bg-[#F8F7FF] min-h-screen py-8">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 space-y-12">
        
        {/* Hero Banner Container */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4A2EC7] via-[#6C4BF4] to-[#8B6FF5] text-white p-8 md:p-14 shadow-xl">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading, Value Prop, CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white">
                <Sparkles size={14} className="text-[#FFD166]" />
                <span>India's Student Marketplace</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-[family-name:var(--font-heading)] leading-tight text-white">
                Turn Your Used Textbooks Into Cash in Minutes
              </h1>

              <p className="text-base md:text-lg text-white/90 max-w-xl leading-relaxed">
                Connect with thousands of students on your campus. List your books for sale, semester rentals, or peer-to-peer textbook swaps safely.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/sell/isbn')}
                  className="inline-flex items-center gap-2 bg-white text-[#6C4BF4] hover:bg-gray-100 font-extrabold text-sm md:text-base px-8 py-4 rounded-2xl shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  List a Book Now <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => navigate('/want-board')}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm px-6 py-4 rounded-2xl transition cursor-pointer"
                >
                  Browse Student Requests
                </button>
              </div>

              {/* Security Pill */}
              <div className="flex items-center gap-3 pt-2 text-xs text-white/80 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={16} className="text-[#22C55E]" /> 100% Escrow Protection
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Zap size={16} className="text-[#FFD166]" /> Fast 2-Minute Listing
                </span>
                <span>•</span>
                <span>Verified Campus Network</span>
              </div>
            </div>

            {/* Right Column: Visual Feature Highlights Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 text-white space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80">Quick Seller Preview</span>
                  <span className="bg-[#22C55E] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    Live Escrow
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 bg-white/10 p-3 rounded-2xl">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <BookOpen size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Auto ISBN Metadata</h4>
                      <p className="text-[11px] text-white/75 mt-0.5">Author, edition & MRP populated in 1 click.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/10 p-3 rounded-2xl">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Users size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Campus Buyer Matching</h4>
                      <p className="text-[11px] text-white/75 mt-0.5">Direct messaging with nearby students.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/10 p-3 rounded-2xl">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Wallet size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Instant Wallet Payouts</h4>
                      <p className="text-[11px] text-white/75 mt-0.5">Transfer directly to UPI, Bank, or Paytm.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/sell/isbn')}
                  className="w-full text-center py-3 bg-white text-[#6C4BF4] font-bold text-xs rounded-xl hover:bg-white/90 transition cursor-pointer"
                >
                  Start Listing in 3 Steps →
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((st, i) => (
            <div key={i} className="bg-white border border-bookify-border/70 rounded-2xl p-5 md:p-6 shadow-xs text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-[#6C4BF4] font-[family-name:var(--font-heading)]">
                {st.value}
              </div>
              <div className="text-xs font-bold text-[#17152A] mt-1">{st.label}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{st.desc}</div>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#6C4BF4] bg-[#EEEAFE] px-3.5 py-1.5 rounded-full inline-block mb-2">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#17152A] font-[family-name:var(--font-heading)]">
              How Listing Works on Bookify
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              From scanning your book cover to receiving instant payouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st, i) => {
              const IconComp = st.icon;
              return (
                <div key={i} className="bg-white border border-bookify-border/70 rounded-3xl p-6 md:p-8 shadow-xs relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#EEEAFE] text-[#6C4BF4] flex items-center justify-center font-bold">
                        <IconComp size={22} />
                      </div>
                      <span className="text-3xl font-extrabold text-gray-200 font-mono">{st.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#17152A] mb-2">{st.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Transaction Modes */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#6C4BF4] bg-[#EEEAFE] px-3.5 py-1.5 rounded-full inline-block mb-2">
              Flexible Listing Modes
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#17152A] font-[family-name:var(--font-heading)]">
              Choose How You Want to Share Your Books
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modes.map((m, i) => {
              const ModeIcon = m.icon;
              return (
                <div key={i} className="bg-white border border-bookify-border/70 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-2xl border ${m.color}`}>
                        <ModeIcon size={20} />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${m.badgeBg}`}>
                        {m.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#17152A] mb-1.5">{m.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white border border-bookify-border/70 rounded-3xl p-8 md:p-12 shadow-xs space-y-6 max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-[#17152A] font-[family-name:var(--font-heading)]">
              Frequently Asked Seller Questions
            </h2>
            <p className="text-xs text-gray-500 mt-1">Everything you need to know about selling on Bookify</p>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-gray-200/80 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm text-[#17152A] hover:bg-gray-50 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-gray-500 leading-relaxed bg-[#F8F7FF]/50 border-t border-gray-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl bg-[#17152A] text-white p-8 md:p-12 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold font-[family-name:var(--font-heading)]">
            Ready to Clear Your Bookshelf?
          </h2>
          <p className="text-xs md:text-sm text-gray-400 max-w-lg mx-auto">
            Join thousands of students turning old semester textbooks into spending money today.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/sell/isbn')}
              className="bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-extrabold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-[#6C4BF4]/30 transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              Start Listing Your Book →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
