import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bookify-text text-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-flex items-center group py-1">
              <img
                src="/logo-transparent.png"
                alt="Athenura Logo"
                className="h-10 sm:h-11 w-auto max-w-[190px] object-contain brightness-0 invert opacity-95 transition-all duration-200 group-hover:opacity-100 group-hover:scale-105"
              />
            </Link>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">
              India's unified book marketplace. Buy, sell, rent, exchange, and donate books.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 mt-5">
              <a
                href="https://www.instagram.com/athenura.in/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#E1306C] hover:border-[#E1306C] transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              <a
                href="https://x.com/athenura_in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                title="Twitter / X"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black hover:border-black transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/company/athenura/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: "/explore", label: "Explore Books" },
                { to: "/categories", label: "Browse Categories" },
                { to: "/sell", label: "Sell a Book" },
                { to: "/explore?mode=rent", label: "Rent Books" },
                { to: "/want-board", label: "Want Board" },
                { to: "/author/login", label: "Author Portal" },
                { to: "/admin/login", label: "Admin Login" }
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-gray-400 hover:text-bookify-purple transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-semibold mb-4">Top Categories</h4>
            <ul className="space-y-2">
              {["Computer Science", "Competitive Exams", "Fiction", "Engineering", "Science"].map((cat) => (
                <li key={cat}><Link to="/categories" className="text-sm text-gray-400 hover:text-bookify-purple transition-colors">{cat}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} className="text-bookify-purple shrink-0" />
                <a href="mailto:official@athenura.in" className="hover:text-bookify-purple transition-colors">
                  official@athenura.in
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={14} className="text-bookify-purple shrink-0" />
                <a href="tel:+919835051934" className="hover:text-bookify-purple transition-colors">
                  +91 98350 51934
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={14} className="text-bookify-purple mt-0.5 shrink-0" />
                <span>Pan-India Campus Network</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-center md:text-left">&copy; 2026 Bookify. All rights reserved.</p>
          
          <p className="text-center text-gray-400 font-medium">
            Develop and Design by <span className="text-white font-semibold">Athenura</span>
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/explore" className="text-gray-500 hover:text-gray-300 transition-colors">Marketplace</Link>
            <Link to="/author/login" className="text-gray-500 hover:text-gray-300 transition-colors">Authors</Link>
            <Link to="/admin/login" className="text-gray-400 hover:text-bookify-purple transition-colors font-semibold">Admin Portal</Link>
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
