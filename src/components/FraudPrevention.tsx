const FraudPrevention = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Fraud Prevention
        </h1>
        <p className="text-slate-500 mb-8">Last Updated: March 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              1. How to Identify Fraud
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Suspiciously low prices compared to market value.</li>
              <li>Requests for payment outside our platform or via unverified methods.</li>
              <li>Unclear or misleading descriptions of products or services.</li>
              <li>Users refusing to provide verifiable contact information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              2. Reporting Suspicious Activity
            </h2>
            <p>
              If you encounter an ad or user that seems fraudulent, please use
              our reporting system immediately. Providing details helps us
              investigate and prevent scams effectively.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Click the "Report" button on the ad or user profile.</li>
              <li>Provide a brief description of the suspicious behavior.</li>
              <li>Attach screenshots or evidence if possible.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              3. Platform Protection Measures
            </h2>
            <p>
              Finn actively monitors listings and user behavior to prevent fraud.
              Measures include:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Automated detection of suspicious listings and accounts.</li>
              <li>Manual review of reported ads or users.</li>
              <li>Account suspension or removal for users violating fraud policies.</li>
              <li>Secure payment processing and buyer protection guidelines.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              4. User Responsibilities
            </h2>
            <p>
              Users play a key role in keeping the platform safe. Always:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Verify sellers before making a purchase.</li>
              <li>Never share sensitive information outside our platform.</li>
              <li>Report any suspicious behavior immediately.</li>
            </ul>
          </section>

          <section className="bg-slate-50 p-6 rounded-lg border-l-4 border-[#0064AE]">
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Need Help?
            </h2>
            <p>
              For assistance with reporting or if you suspect fraud, contact our support team. 
              We take all reports seriously and investigate promptly.
            </p>
            <p className="font-medium mt-2">Email: support@finnapp.com</p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default FraudPrevention;