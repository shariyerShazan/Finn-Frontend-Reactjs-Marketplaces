// import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Terms & Conditions
        </h1>
        <p className="text-slate-500 mb-8">Effective Date: March 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Finn platform, you agree to be bound by
              these Terms and Conditions and all applicable laws and
              regulations. If you do not agree, you are prohibited from using
              this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              2. User Accounts
            </h2>
            <p>
              To post ads, you must create an account. You are responsible for
              maintaining the confidentiality of your account and password. Finn
              reserves the right to terminate accounts that violate our
              community standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              3. Posting Rules
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Users must provide accurate information in their listings.
              </li>
              <li>
                Prohibited items (illegal goods, scams, etc.) are strictly
                forbidden.
              </li>
              <li>Duplicate postings for the same item are not allowed.</li>
              <li>
                Finn reserves the right to remove any ad without prior notice.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              4. Limitation of Liability
            </h2>
            <p>
              Finn is a marketplace platform. We do not own the items sold and
              are not responsible for transactions between users. Users are
              encouraged to meet in safe locations and verify items before
              payment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              5. Modifications
            </h2>
            <p>
              We may revise these terms at any time. By continuing to use Finn
              after changes are made, you agree to be bound by the updated
              version.
            </p>
          </section>

          <div className="pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-sm">
              © 2026 Finn. All rights reserved by Finn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
