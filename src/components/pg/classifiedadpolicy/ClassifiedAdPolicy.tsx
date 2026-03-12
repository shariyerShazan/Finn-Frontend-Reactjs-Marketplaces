const ClassifiedAdPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Classified Ad Policy
        </h1>
        <p className="text-slate-500 mb-8">Last Updated: March 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              1. General Posting Rules
            </h2>
            <p>
              All classified advertisements posted on Finn must be accurate,
              honest, and relevant to the selected category. Users must ensure
              that all details provided in the advertisement are truthful and
              not misleading to potential buyers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              2. Prohibited Listings
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Illegal goods or services.</li>
              <li>Weapons, explosives, or dangerous materials.</li>
              <li>Counterfeit or stolen products.</li>
              <li>Adult, offensive, or inappropriate content.</li>
              <li>Ads that promote fraud or scams.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              3. Ad Content Requirements
            </h2>
            <p>
              Advertisements must include a clear title, accurate description,
              real images (if applicable), and correct pricing information.
              Duplicate or spam advertisements may be removed without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              4. Seller Responsibilities
            </h2>
            <p>
              Sellers are responsible for ensuring that the products or
              services listed in their ads are legitimate and available for
              sale. Sellers must communicate honestly with buyers and fulfill
              transactions as described in their listings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0064AE] mb-3">
              5. Platform Moderation
            </h2>
            <p>
              Finn reserves the right to review, edit, or remove any
              advertisement that violates our policies or harms the integrity
              of the marketplace. Repeated violations may lead to account
              suspension or removal.
            </p>
          </section>

          <section className="bg-slate-50 p-6 rounded-lg border-l-4 border-[#0064AE]">
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Need Help?
            </h2>
            <p>
              If you have questions regarding our Classified Ad Policy or need
              assistance with your listings, please contact our support team.
            </p>
            <p className="font-medium mt-2">Email: support@finnapp.com</p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ClassifiedAdPolicy;