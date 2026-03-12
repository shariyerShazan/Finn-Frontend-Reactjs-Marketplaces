// import React from "react";
import { CheckCircle2, Users, ShieldCheck, Zap } from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: <Zap className="text-[#0064AE]" />,
      title: "Fast Listings",
      desc: "Post your ads in less than 2 minutes and reach thousands of buyers.",
    },
    {
      icon: <ShieldCheck className="text-[#0064AE]" />,
      title: "Secure Trading",
      desc: "Verified sellers and robust safety guidelines for your peace of mind.",
    },
    {
      icon: <Users className="text-[#0064AE]" />,
      title: "Community Driven",
      desc: "Connecting local buyers and sellers in a trusted marketplace environment.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-50 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tight">
            We Connect <span className="text-[#0064AE]">Buyers & Sellers</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Finn is Bangladesh's fastest-growing classifieds platform. Our
            mission is to make local trade easier, faster, and more secure for
            everyone.
          </p>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">
                {f.title}
              </h3>
              <p className="text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-slate-900 text-white px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-slate-400 mb-4">
              Founded in 2026, Finn started with a simple idea: why should
              buying or selling used goods be complicated? We built a platform
              that removes the friction of traditional classifieds.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#0064AE]" /> Top notch
                fraud prevention
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#0064AE]" />{" "}
                User-friendly mobile experience
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#0064AE]" /> Localized
                search by distance
              </li>
            </ul>
          </div>
          <div className="bg-[#0064AE]/10 p-8 rounded-2xl border border-[#0064AE]/20 text-center">
            <span className="text-6xl font-black text-[#0064AE]">Finn</span>
            <p className="mt-4 text-slate-300 italic">
              "The Ultimate Marketplace for Everyone"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
