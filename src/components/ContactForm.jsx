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
    } catch (error) {
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
            GET IN TOUCH
          </h2>
          <p className="text-[#B3B3B3] text-lg">
            Have questions? Want to see a demo? We're here to help.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="panel-system p-8 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-[#F2F2F2] font-bold mb-2 uppercase tracking-wide text-sm">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-[#0C0C0C] border border-[#404040] text-[#F2F2F2] px-4 py-3 focus:outline-none focus:border-[#FFC96C] transition-colors"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-[#F2F2F2] font-bold mb-2 uppercase tracking-wide text-sm">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-[#0C0C0C] border border-[#404040] text-[#F2F2F2] px-4 py-3 focus:outline-none focus:border-[#FFC96C] transition-colors"
              placeholder="your.email@company.com"
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-[#F2F2F2] font-bold mb-2 uppercase tracking-wide text-sm">
              Organization
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full bg-[#0C0C0C] border border-[#404040] text-[#F2F2F2] px-4 py-3 focus:outline-none focus:border-[#FFC96C] transition-colors"
              placeholder="Your organization name (optional)"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-[#F2F2F2] font-bold mb-2 uppercase tracking-wide text-sm">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-[#0C0C0C] border border-[#404040] text-[#F2F2F2] px-4 py-3 focus:outline-none focus:border-[#FFC96C] transition-colors resize-none"
              placeholder="Tell us about your needs..."
            />
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="bg-[#1A3A1A] border border-[#4CAF50] text-[#4CAF50] px-4 py-3">
              ✓ Thank you! We'll get back to you within 24 hours.
            </div>
          )}

          {status === 'error' && (
            <div className="bg-[#3A1A1A] border border-[#F44336] text-[#F44336] px-4 py-3">
              ✗ {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <AnimatedButton
            type="submit"
            disabled={status === 'submitting'}
            className="w-full btn-system"
          >
            {status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
          </AnimatedButton>

          <p className="text-[#B3B3B3] text-sm text-center">
            We typically respond within 24 hours. For urgent inquiries, call us at (555) 123-4567.
          </p>
        </form>
      </div>
    </section>
  );
}
