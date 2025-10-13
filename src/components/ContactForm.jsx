import { useState } from 'react';
import { submitContactForm } from '../lib/supabase';
import AnimatedButton from './AnimatedButton';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', message: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Failed to submit form. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <section className="relative w-full max-w-screen overflow-x-hidden px-4 py-16 sm:px-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div className="text-center">
          <h2 className="h2 mb-4 font-bold uppercase tracking-tight text-[#F2F2F2]">
            GET IN TOUCH
          </h2>
          <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] text-pretty">
            Have questions? Want to see a demo? We're here to help.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="panel-system space-y-6 p-6 sm:p-8">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#F2F2F2] sm:text-sm">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full min-w-0 rounded-[2px] border border-[#404040] bg-[#0C0C0C] px-4 py-3 text-sm text-[#F2F2F2] transition-colors focus:border-[#FFC96C] focus:outline-none sm:text-base"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#F2F2F2] sm:text-sm">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full min-w-0 rounded-[2px] border border-[#404040] bg-[#0C0C0C] px-4 py-3 text-sm text-[#F2F2F2] transition-colors focus:border-[#FFC96C] focus:outline-none sm:text-base"
              placeholder="your.email@company.com"
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#F2F2F2] sm:text-sm">
              Organization
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full min-w-0 rounded-[2px] border border-[#404040] bg-[#0C0C0C] px-4 py-3 text-sm text-[#F2F2F2] transition-colors focus:border-[#FFC96C] focus:outline-none sm:text-base"
              placeholder="Your organization name (optional)"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#F2F2F2] sm:text-sm">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full min-w-0 resize-y rounded-[2px] border border-[#404040] bg-[#0C0C0C] px-4 py-3 text-sm text-[#F2F2F2] transition-colors focus:border-[#FFC96C] focus:outline-none sm:text-base"
              placeholder="Tell us about your needs..."
            />
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="rounded-[2px] border border-[#4CAF50] bg-[#1A3A1A] px-4 py-3 text-sm text-[#4CAF50] sm:text-base">
              ✓ Thank you! We'll get back to you within 24 hours.
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-[2px] border border-[#F44336] bg-[#3A1A1A] px-4 py-3 text-sm text-[#F44336] sm:text-base">
              ✗ {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <AnimatedButton
            type="submit"
            disabled={status === 'submitting'}
            className="btn-system"
          >
            {status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
          </AnimatedButton>
        </form>
      </div>
    </section>
  );
}
