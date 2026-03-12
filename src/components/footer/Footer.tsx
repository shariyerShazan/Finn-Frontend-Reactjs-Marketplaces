/* eslint-disable @typescript-eslint/no-explicit-any */

import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAllCategoriesQuery } from "@/redux/fetures/admin/admin-category.api";
import bg from '../../assets/bg.jpg';

const Footer = () => {
  // কুইক লিংকের জন্য ক্যাটাগরি ডাটা ফেচ করা
  const { data: categoriesResponse } = useGetAllCategoriesQuery({
    page: 1,
    limit: 7,
  });
  const quickCategories = categoriesResponse?.data || [];

  return (
    <footer className="w-full relative">
      {/* Full-width background image */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Optional overlay for better text contrast */}
        <div className="w-full h-full bg-black/60"></div>
      </div>

      {/* Content container (constrained width) */}
      <div className="max-w-7xl mx-auto pt-12 pb-6 px-4 md:px-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* 1. Logo and App Downloads */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90">
              <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
                <span className="text-black p-3 rounded-md font-bold text-xs uppercase italic">
                  F
                </span>
              </div>
              <h1 className="text-sm font-black text-[#00B4FF] uppercase tracking-widest">
                Finn
              </h1>
            </Link>

            <div className="space-y-3">
              <p className="font-semibold">Download The Mobile App</p>
              <div className="flex flex-col gap-2">
                <a
                  href="#"
                  className="flex items-center bg-white text-black px-4 py-2 rounded-lg w-48 hover:opacity-80 transition"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Google Play"
                    className="h-8"
                  />
                </a>
                <a
                  href="#"
                  className="flex items-center bg-white text-black px-4 py-2 rounded-lg w-48 hover:opacity-80 transition"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                    alt="App Store"
                    className="h-8"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* 2. Company Section */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-[#00B4FF] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#00B4FF] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#00B4FF] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#00B4FF] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#00B4FF] transition-colors">
                  FAQ's
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Quick Links (Dynamic Categories) */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Quick Links</h4>
            <ul className="space-y-2">
              {quickCategories.slice(0, 4).map((cat: any) => (
                <li key={cat.id}>
                  <Link
                    to={`/search?search=${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-[#00B4FF] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              {quickCategories.length === 0 && (
                <li className="text-slate-300 text-sm italic">
                  No categories found
                </li>
              )}
            </ul>
          </div>

          {/* 4. Help & Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Help & Contact</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/classified" className="hover:text-[#00B4FF] transition-colors">
                  Classified Ad Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#00B4FF] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#00B4FF] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/fraud-prevention" className="hover:text-[#00B4FF] transition-colors">
                  Fraud Prevention
                </Link>
              </li>
            </ul>

            {/* Social Links */}
            <div className="pt-6 space-y-3">
              <p className="font-bold text-sm">Stay Connected:</p>
              <div className="flex gap-4 items-center text-white">
                <a href="#" className="hover:text-[#00B4FF] transition">
                  <Facebook size={18} />
                </a>
                <a href="#" className="hover:text-[#00B4FF] transition">
                  <Instagram size={18} />
                </a>
                <a href="#" className="hover:text-[#00B4FF] transition">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-400 mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-300">
          <p>© {new Date().getFullYear()} All rights are reserved by Finn</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white">
              Sitemap
            </Link>
            <Link to="/contact" className="hover:text-white">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;