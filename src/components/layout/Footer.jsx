import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#171B3A] text-white">

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-5">

        {/* Brand */}
        <div className="lg:col-span-2">

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6C4BF4] font-bold">
              B
            </div>

            <span className="text-xl font-extrabold">
              BOOKIFY
            </span>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
            India's most trusted student marketplace.
            Buy, sell, rent and exchange books with fellow
            students.
          </p>

          {/* Social */}
          <div className="mt-6 flex gap-3">

            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#6C4BF4]">
              <Facebook size={16} />
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#6C4BF4]">
              <Instagram size={16} />
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#6C4BF4]">
              <Twitter size={16} />
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#6C4BF4]">
              <Linkedin size={16} />
            </button>

          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold">
            Quick Links
          </h3>

          <div className="mt-5 space-y-3 text-sm text-white/60">
            <Link className="block hover:text-white" to="/">
              Home
            </Link>

            <Link className="block hover:text-white" to="/explore">
              Explore
            </Link>

            <Link className="block hover:text-white" to="/sell">
              Sell a Book
            </Link>

            <Link className="block hover:text-white" to="/rent">
              Rent a Book
            </Link>

            <Link className="block hover:text-white" to="/exchange">
              Exchange
            </Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold">
            Support
          </h3>

          <div className="mt-5 space-y-3 text-sm text-white/60">
            <Link className="block hover:text-white" to="/help">
              Help Center
            </Link>

            <Link className="block hover:text-white" to="/safety">
              Safety Tips
            </Link>

            <Link className="block hover:text-white" to="/shipping">
              Shipping Info
            </Link>

            <Link className="block hover:text-white" to="/refund">
              Return Policy
            </Link>

            <Link className="block hover:text-white" to="/contact">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold">
            Company
          </h3>

          <div className="mt-5 space-y-3 text-sm text-white/60">
            <Link className="block hover:text-white" to="/about">
              About Us
            </Link>

            <Link className="block hover:text-white" to="/careers">
              Careers
            </Link>

            <Link className="block hover:text-white" to="/terms">
              Terms & Conditions
            </Link>

            <Link className="block hover:text-white" to="/privacy">
              Privacy Policy
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="text-center text-xs text-white/50">
            © 2024 BOOKIFY. All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
}

export default Footer;