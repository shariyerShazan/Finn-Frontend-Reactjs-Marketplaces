import { useState } from "react";

const FAQs = () => {
  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "Click on the 'Register' button in the top-right corner, fill in your details, and verify your email to create an account.",
    },
    {
      question: "How can I post a classified ad?",
      answer:
        "Once logged in, go to 'Post Ad', select the appropriate category, fill in the details, upload images, and submit your listing.",
    },
    {
      question: "How do I report a suspicious ad or user?",
      answer:
        "Use the 'Report' button on any ad or user profile. Provide details about the suspicious behavior and attach screenshots if possible.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "We support payments through Stripe, including credit/debit cards. Never pay outside the platform for safety reasons.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "Go to your account settings and click 'Edit Profile' to update your personal information, contact details, and profile picture.",
    },
    {
      question: "What happens if I violate platform rules?",
      answer:
        "Violations of our policies may lead to ad removal, warnings, or account suspension depending on the severity and repetition.",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes, you can request account deletion through the account settings or contact support for assistance. Please note this action is irreversible.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index:any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">FAQs</h1>
        <p className="text-slate-500 mb-8">Frequently Asked Questions about using Finn</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-4 bg-slate-100 hover:bg-slate-200 flex justify-between items-center font-medium"
              >
                <span>{faq.question}</span>
                <span>{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="p-4 bg-white text-slate-700">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>

        <section className="bg-slate-50 p-6 rounded-lg border-l-4 border-[#0064AE] mt-8">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Need More Help?</h2>
          <p>If your question isn’t listed above, feel free to reach out to our support team.</p>
          <p className="font-medium mt-2">Email: support@finnapp.com</p>
        </section>
      </div>
    </div>
  );
};

export default FAQs;