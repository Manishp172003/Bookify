import { Link } from "react-router-dom";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bookify-text text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-bookify-purple rounded-xl flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="font-[family-name:var(--font-heading)] font-bold text-xl">
                Book<span className="text-bookify-purple">ify</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">
              India's unified book marketplace. Buy, sell, rent, exchange, and donate books.
            </p>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[{ to: "/explore", label: "Explore Books" }, { to: "/categories", label: "Browse Categories" }, { to: "/explore?mode=sell", label: "Sell a Book" }, { to: "/explore?mode=rent", label: "Rent Books" }].map((link) => (
                <li key={link.to}><Link to={link.to} className="text-sm text-gray-400 hover:text-bookify-purple transition-colors">{link.label}</Link></li>
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
              <li className="flex items-center gap-2 text-sm text-gray-400"><Mail size={14} className="text-bookify-purple" />hello@bookify.com</li>
              <li className="flex items-center gap-2 text-sm text-gray-400"><Phone size={14} className="text-bookify-purple" />+91 98765 43210</li>
              <li className="flex items-start gap-2 text-sm text-gray-400"><MapPin size={14} className="text-bookify-purple mt-0.5" /><span>Pan-India Campus Network</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">&copy; 2026 Bookify. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
