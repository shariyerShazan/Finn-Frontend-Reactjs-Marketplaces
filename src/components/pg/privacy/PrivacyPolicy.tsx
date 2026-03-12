// import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-slate-500 mb-8">Last Updated: March 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you use Finn, we collect information that you provide
              directly to us, such as when you create an account, post a
              classified ad, or communicate with other users. This includes your
              name, email address, phone number, and any location data related
              to your ads.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                To provide, maintain, and improve our classified services.
              </li>
              <li>To facilitate communication between buyers and sellers.</li>
              <li>
                To send you technical notices, updates, and security alerts.
              </li>
              <li>
                To prevent fraud and maintain a safe environment for all users.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              3. Information Sharing
            </h2>
            <p>
              We do not sell your personal data. However, certain information
              (like your city or phone number, if allowed by you in settings)
              will be visible to other users to facilitate transactions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              4. Cookies and Tracking
            </h2>
            <p>
              We use cookies to enhance your experience, remember your
              preferences, and analyze our traffic. You can disable cookies in
              your browser settings, but some features of the app may not
              function properly.
            </p>
          </section>

          <section className="bg-slate-50 p-6 rounded-lg border-l-4 border-[#0064AE]">
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <p className="font-medium mt-2">Email: privacy@finnapp.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
