import { useState } from 'react';
import { Mail, Download, CheckCircle } from 'lucide-react';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Integrate with your email service (Mailchimp, SendGrid, etc.)
    console.warn('Email captured:', email);
    
    setLoading(false);
    setSubmitted(true);
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-24 bg-[#1A1A1A]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="panel-system p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#202020] mb-6">
              <Download className="w-8 h-8 text-[#FFC96C]" />
            </div>
            
            <h2 className="text-3xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
              GET YOUR FREE BOARD MANAGEMENT GUIDE
            </h2>
            
            <p className="text-[#B3B3B3] text-lg mb-8 max-w-2xl mx-auto">
              Download our comprehensive 25-page guide on modern management best practices, 
              strategic planning frameworks, and digital transformation strategies.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B3B3B3]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] placeholder-[#666666] focus:outline-none focus:border-[#FFC96C] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-system whitespace-nowrap disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Download Free Guide'}
                  </button>
                </div>
                <p className="text-[#666666] text-xs mt-3">
                  No spam. Unsubscribe anytime. We respect your privacy.
                </p>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 text-[#FFC96C] py-3">
                <CheckCircle className="w-6 h-6" />
                <p className="text-lg font-medium">Check your email for the download link!</p>
              </div>
            )}

            {/* What's Included */}
            <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-[#202020] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FFC96C] font-bold">1</span>
                </div>
                <div>
                  <p className="text-[#F2F2F2] font-medium mb-1">Strategic Planning</p>
                  <p className="text-[#B3B3B3] text-sm">Frameworks and templates</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-[#202020] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FFC96C] font-bold">2</span>
                </div>
                <div>
                  <p className="text-[#F2F2F2] font-medium mb-1">Member Engagement</p>
                  <p className="text-[#B3B3B3] text-sm">Best practices guide</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-[#202020] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FFC96C] font-bold">3</span>
                </div>
                <div>
                  <p className="text-[#F2F2F2] font-medium mb-1">Digital Tools</p>
                  <p className="text-[#B3B3B3] text-sm">Technology evaluation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
