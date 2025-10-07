import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How long does implementation take?",
      answer: "Most organizations are up and running within 1-2 weeks. Our team provides dedicated onboarding support, data migration assistance, and training for your board members. Enterprise clients receive white-glove implementation services."
    },
    {
      question: "Can we migrate data from our existing systems?",
      answer: "Yes! We support data migration from spreadsheets, BoardEffect, Diligent, and other board management platforms. Our team handles the entire migration process to ensure a smooth transition with zero data loss."
    },
    {
      question: "What kind of support do you provide?",
      answer: "All plans include email support. Professional plans get priority support with 4-hour response times. Enterprise clients receive dedicated account management, 24/7 phone support, and custom training sessions."
    },
    {
      question: "Is my data secure and compliant?",
      answer: "Absolutely. We're SOC 2 Type II certified, GDPR compliant, and HIPAA ready. All data is encrypted at rest and in transit using 256-bit encryption. We maintain 99.9% uptime with daily backups and disaster recovery protocols."
    },
    {
      question: "Can I customize the platform for my organization?",
      answer: "Professional plans include custom branding (logo, colors). Enterprise plans offer white-label solutions, custom integrations, API access, and the ability to add custom fields and workflows to match your exact processes."
    },
    {
      question: "What happens if I need to cancel?",
      answer: "You can cancel anytime with no penalties. We offer a 30-day money-back guarantee on all plans. Upon cancellation, you'll receive a complete export of all your data in standard formats (CSV, PDF)."
    },
    {
      question: "Do you offer training for board members?",
      answer: "Yes! All plans include access to our video tutorial library and documentation. Professional and Enterprise plans include live training sessions, and Enterprise clients can request custom training programs for their specific needs."
    },
    {
      question: "Can we try it before committing?",
      answer: "Absolutely! We offer a 14-day free trial with full access to all features. No credit card required. Our team will also provide a personalized demo to show you how DHStx can transform your board operations."
    }
  ];

  return (
    <section className="py-24 bg-[#0C0C0C]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-[#B3B3B3] text-lg">
              Everything you need to know about DHStx
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="panel-system overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[#202020] transition-colors"
                >
                  <span className="text-[#F2F2F2] font-medium pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FFC96C] flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-[#B3B3B3] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-[#B3B3B3] mb-4">
              Still have questions?
            </p>
            <a
              href="mailto:sales@dhstx.com"
              className="btn-system inline-flex"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
