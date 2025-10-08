import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileCheck, Server, Key, AlertCircle, CheckCircle, Download, ExternalLink } from 'lucide-react';

export default function Security() {
  return (
    <div className="min-h-screen bg-[#0C0C0C]">
      {/* Header */}
      <header className="border-b border-[#202020] bg-[#0C0C0C]">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-[#F2F2F2] text-xl font-bold uppercase tracking-tight">
            DHStx
          </Link>
          <div className="flex gap-4">
            <Link to="/product" className="btn-system">
              View Platform
            </Link>
            <Link to="/login" className="btn-primary">
              Account Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded-[4px] border border-[#202020] mb-6">
              <Shield className="w-4 h-4 text-[#FFC96C]" />
              <span className="text-[#FFC96C] text-sm uppercase tracking-tight font-bold">Security & Compliance</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight">
              ENTERPRISE-GRADE SECURITY
            </h1>
            <p className="text-xl text-[#B3B3B3] mb-8">
              Your data security and privacy are our top priorities. We maintain the highest standards of security, compliance, and transparency.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn-primary flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Security Whitepaper
              </button>
              <Link to="/product" className="btn-system">
                View Platform Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Certifications */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
                COMPLIANCE CERTIFICATIONS
              </h2>
              <p className="text-xl text-[#B3B3B3]">
                Certified and audited by leading security organizations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* SOC 2 Type II */}
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-[4px] bg-[#FFC96C]/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-[#FFC96C]" />
                </div>
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">SOC 2 Type II</h3>
                <p className="text-[#B3B3B3] text-sm mb-4">
                  Independently audited security controls
                </p>
                <span className="inline-flex items-center gap-1 text-[#4CAF50] text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Certified
                </span>
              </div>

              {/* GDPR */}
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-[4px] bg-[#FFC96C]/10 flex items-center justify-center">
                  <FileCheck className="w-8 h-8 text-[#FFC96C]" />
                </div>
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">GDPR Compliant</h3>
                <p className="text-[#B3B3B3] text-sm mb-4">
                  EU data protection regulation
                </p>
                <span className="inline-flex items-center gap-1 text-[#4CAF50] text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Compliant
                </span>
              </div>

              {/* HIPAA */}
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-[4px] bg-[#FFC96C]/10 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-[#FFC96C]" />
                </div>
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">HIPAA Ready</h3>
                <p className="text-[#B3B3B3] text-sm mb-4">
                  Healthcare data protection
                </p>
                <span className="inline-flex items-center gap-1 text-[#4CAF50] text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Compliant
                </span>
              </div>

              {/* ISO 27001 */}
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-[4px] bg-[#FFC96C]/10 flex items-center justify-center">
                  <Server className="w-8 h-8 text-[#FFC96C]" />
                </div>
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">ISO 27001</h3>
                <p className="text-[#B3B3B3] text-sm mb-4">
                  Information security management
                </p>
                <span className="inline-flex items-center gap-1 text-[#4CAF50] text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Certified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
                SECURITY INFRASTRUCTURE
              </h2>
              <p className="text-xl text-[#B3B3B3]">
                Multi-layered security protecting your data at every level
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Encryption */}
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C] flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-[#0C0C0C]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                      256-BIT ENCRYPTION
                    </h3>
                    <p className="text-[#B3B3B3] mb-4">
                      All data encrypted in transit (TLS 1.3) and at rest (AES-256). Bank-level encryption protects your sensitive information.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        TLS 1.3 for data in transit
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        AES-256 for data at rest
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        Encrypted database backups
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Access Control */}
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C] flex items-center justify-center flex-shrink-0">
                    <Key className="w-6 h-6 text-[#0C0C0C]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                      ACCESS CONTROL
                    </h3>
                    <p className="text-[#B3B3B3] mb-4">
                      Role-based permissions, SSO/SAML integration, and multi-factor authentication ensure only authorized access.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        Role-based access control (RBAC)
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        SSO/SAML 2.0 integration
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        Multi-factor authentication (MFA)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Monitoring */}
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C] flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-[#0C0C0C]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                      24/7 MONITORING
                    </h3>
                    <p className="text-[#B3B3B3] mb-4">
                      Continuous security monitoring, intrusion detection, and automated threat response protect against attacks.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        Real-time threat detection
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        Automated security alerts
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        DDoS protection
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Audit Logs */}
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C] flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-6 h-6 text-[#0C0C0C]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                      AUDIT TRAILS
                    </h3>
                    <p className="text-[#B3B3B3] mb-4">
                      Comprehensive audit logs track all system activity for compliance, forensics, and accountability.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        Complete activity logging
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        Tamper-proof audit trails
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        Exportable compliance reports
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Privacy */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
                DATA PRIVACY & CONTROL
              </h2>
              <p className="text-xl text-[#B3B3B3]">
                You own your data. We never sell or share it with third parties.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6">
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">Data Ownership</h3>
                <p className="text-[#B3B3B3]">
                  Your data belongs to you. Export or delete it anytime. We never claim ownership of your content.
                </p>
              </div>

              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6">
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">Data Residency</h3>
                <p className="text-[#B3B3B3]">
                  Choose where your data is stored. Available in US, EU, and other regions to meet local compliance requirements.
                </p>
              </div>

              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6">
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">Data Retention</h3>
                <p className="text-[#B3B3B3]">
                  Customizable retention policies. Automatic deletion after account closure. Compliant with GDPR right to be forgotten.
                </p>
              </div>

              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6">
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">Third-Party Access</h3>
                <p className="text-[#B3B3B3]">
                  We never sell your data. Limited third-party services (hosting, analytics) are vetted and contractually bound to protect your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Incident Response */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
                INCIDENT RESPONSE
              </h2>
              <p className="text-xl text-[#B3B3B3]">
                Prepared and transparent in the unlikely event of a security incident
              </p>
            </div>

            <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8">
              <div className="flex items-start gap-4 mb-6">
                <AlertCircle className="w-6 h-6 text-[#FFC96C] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                    Our Commitment
                  </h3>
                  <p className="text-[#B3B3B3] mb-4">
                    In the event of a security incident, we commit to:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-[#F2F2F2]">
                      <CheckCircle className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                      <span><strong>Immediate Response:</strong> 24/7 security team responds within 1 hour</span>
                    </li>
                    <li className="flex items-start gap-3 text-[#F2F2F2]">
                      <CheckCircle className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                      <span><strong>Transparent Communication:</strong> Notify affected customers within 72 hours</span>
                    </li>
                    <li className="flex items-start gap-3 text-[#F2F2F2]">
                      <CheckCircle className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                      <span><strong>Public Disclosure:</strong> Post-mortem reports published on status page</span>
                    </li>
                    <li className="flex items-start gap-3 text-[#F2F2F2]">
                      <CheckCircle className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                      <span><strong>Remediation:</strong> Immediate patches and long-term fixes implemented</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-[#202020]">
                <p className="text-[#B3B3B3] text-sm">
                  <strong className="text-[#F2F2F2]">Zero Incidents:</strong> We have maintained a perfect security record with zero data breaches since our founding. View our incident history on our{' '}
                  <a href="/status" className="text-[#FFC96C] hover:underline">status page</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Resources */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
                SECURITY RESOURCES
              </h2>
              <p className="text-xl text-[#B3B3B3]">
                Documentation and reports for your security team
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <a href="#" className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6 hover:border-[#FFC96C] transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-[#F2F2F2] uppercase tracking-tight">Security Whitepaper</h3>
                  <Download className="w-5 h-5 text-[#FFC96C]" />
                </div>
                <p className="text-[#B3B3B3] text-sm mb-3">
                  Comprehensive security architecture and practices documentation
                </p>
                <span className="text-[#FFC96C] text-sm group-hover:underline">Download PDF →</span>
              </a>

              <a href="#" className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6 hover:border-[#FFC96C] transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-[#F2F2F2] uppercase tracking-tight">SOC 2 Report</h3>
                  <Download className="w-5 h-5 text-[#FFC96C]" />
                </div>
                <p className="text-[#B3B3B3] text-sm mb-3">
                  Latest SOC 2 Type II audit report (requires NDA)
                </p>
                <span className="text-[#FFC96C] text-sm group-hover:underline">Request Report →</span>
              </a>

              <a href="#" className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6 hover:border-[#FFC96C] transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-[#F2F2F2] uppercase tracking-tight">Penetration Test Results</h3>
                  <Download className="w-5 h-5 text-[#FFC96C]" />
                </div>
                <p className="text-[#B3B3B3] text-sm mb-3">
                  Annual third-party penetration testing reports
                </p>
                <span className="text-[#FFC96C] text-sm group-hover:underline">Request Report →</span>
              </a>

              <a href="/status" className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6 hover:border-[#FFC96C] transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-[#F2F2F2] uppercase tracking-tight">System Status</h3>
                  <ExternalLink className="w-5 h-5 text-[#FFC96C]" />
                </div>
                <p className="text-[#B3B3B3] text-sm mb-3">
                  Real-time uptime monitoring and incident history
                </p>
                <span className="text-[#FFC96C] text-sm group-hover:underline">View Status Page →</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight">
              QUESTIONS ABOUT SECURITY?
            </h2>
            <p className="text-xl text-[#B3B3B3] mb-8">
              Our security team is here to answer your questions and provide additional documentation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:security@dhstx.com" className="btn-primary">
                Contact Security Team
              </a>
              <Link to="/product" className="btn-system">
                View Platform Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#202020]">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center text-[#B3B3B3] text-sm">
            <p>© 2025 DHStx. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/security" className="hover:text-[#FFC96C]">Security</Link>
              <a href="#" className="hover:text-[#FFC96C]">Privacy Policy</a>
              <a href="#" className="hover:text-[#FFC96C]">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
