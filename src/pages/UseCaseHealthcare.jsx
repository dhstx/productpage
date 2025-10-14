import { Link } from 'react-router-dom';
import BackArrow from '../components/BackArrow';
import { Shield, Users, FileText, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

export default function UseCaseHealthcare() {
  const painPoints = [
    {
      title: 'Compliance Complexity',
      description: 'Navigating HIPAA, state regulations, and accreditation standards while maintaining operational efficiency'
    },
    {
      title: 'Fragmented Communication',
      description: 'Medical staff, administrators, and board members struggle to stay aligned on strategic initiatives'
    },
    {
      title: 'Data Security Concerns',
      description: 'Protecting sensitive patient and organizational data across multiple platforms and access points'
    },
    {
      title: 'Resource Constraints',
      description: 'Limited administrative bandwidth to manage governance, compliance, and strategic planning simultaneously'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'HIPAA-Compliant Infrastructure',
      description: 'Built with healthcare security standards in mind. End-to-end encryption, audit logs, and role-based access control protect sensitive organizational data.'
    },
    {
      icon: Users,
      title: 'Medical Team Coordination',
      description: 'Streamline communication between clinical leadership, administrative staff, and governing boards with dedicated workspaces and permission controls.'
    },
    {
      icon: FileText,
      title: 'Regulatory Documentation',
      description: 'Centralize accreditation materials, compliance reports, and policy documentation with version control and automated reminders for renewals.'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Track quality metrics, patient satisfaction scores, and operational KPIs in real-time dashboards designed for healthcare executives.'
    }
  ];

  const results = [
    { metric: '60%', label: 'Reduction in admin time' },
    { metric: '100%', label: 'Compliance audit success' },
    { metric: '45%', label: 'Faster decision-making' },
    { metric: '99.9%', label: 'Platform uptime' }
  ];

  const caseStudy = {
    organization: 'Regional Medical Center',
    size: '500+ beds, 2,000+ staff',
    challenge: 'Struggling with board meeting preparation, compliance tracking, and strategic planning coordination across 12 departments',
    solution: 'Implemented DHStx to centralize governance, automate compliance workflows, and enable real-time collaboration',
    results: [
      'Reduced board meeting prep time from 40 hours to 12 hours per month',
      'Achieved 100% compliance audit score for 3 consecutive years',
      'Increased board member engagement by 75%',
      'Saved $180,000 annually in administrative costs'
    ]
  };

  return (
    <div className="min-h-screen w-full max-w-screen overflow-x-hidden min-w-0 bg-[#0C0C0C]">
      <BackArrow />
      {/* Header */}
      <header className="border-b border-[#202020] bg-[#0C0C0C]">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-[#F2F2F2] text-xl font-bold tracking-tight">DHStx</Link>
          <div className="flex gap-4">
            <Link to="/product" className="btn-system">View Pricing</Link>
            <Link to="/login" className="btn-system">Account Login</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-4xl">
          <div className="inline-block px-4 py-2 bg-[#1A1A1A] rounded-[4px] border border-[#202020] mb-6">
            <span className="text-[#FFC96C] text-sm uppercase tracking-tight font-bold">Healthcare Organizations</span>
          </div>
          <h1 className="h1 font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight text-balance">
            GOVERNANCE PLATFORM FOR HEALTHCARE EXCELLENCE
          </h1>
          <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] mb-8 max-w-2xl text-pretty">
            Streamline hospital governance, ensure compliance, and empower medical leadership with a platform built for the unique challenges of healthcare administration.
          </p>
          <div className="flex gap-4">
            <Link to="/product" className="btn-primary">
              View Healthcare Pricing
            </Link>
            <a href="#case-study" className="btn-system">
              Read Success Story
            </a>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 bg-[#0C0C0C]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="h2 font-bold text-[#F2F2F2] mb-12 uppercase tracking-tight text-center text-balance">
              Healthcare Governance Challenges
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {painPoints.map((point, index) => (
                <div key={index} className="p-6 bg-[#1A1A1A] rounded-[4px] border border-[#202020]">
                  <h3 className="text-xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                    {point.title}
                  </h3>
                  <p className="text-[#B3B3B3]">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#0C0C0C]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="h2 font-bold text-[#F2F2F2] mb-12 uppercase tracking-tight text-center text-balance">
              Built for Healthcare Organizations
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="p-8 bg-[#1A1A1A] rounded-[4px] border border-[#202020]">
      <BackArrow />
                    <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C]/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#FFC96C]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-[#B3B3B3]">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="h2 font-bold text-[#F2F2F2] mb-12 uppercase tracking-tight text-center text-balance">
              Proven Healthcare Results
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {results.map((result, index) => (
                <div key={index} className="text-center p-6 bg-[#0C0C0C] rounded-[4px] border border-[#202020]">
                  <div className="text-4xl font-bold text-[#FFC96C] mb-2">{result.metric}</div>
                  <div className="text-sm text-[#B3B3B3] uppercase tracking-tight">{result.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section id="case-study" className="py-24 bg-[#0C0C0C]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 bg-[#1A1A1A] rounded-[4px] border border-[#202020]">
              <div className="inline-block px-4 py-2 bg-[#FFC96C]/10 rounded-[4px] mb-6">
                <span className="text-[#FFC96C] text-sm uppercase tracking-tight font-bold">Success Story</span>
              </div>
              <h2 className="h2 font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight text-balance">
                {caseStudy.organization}
              </h2>
              <p className="text-[#B3B3B3] mb-8">{caseStudy.size}</p>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-lg font-bold text-[#FFC96C] mb-2 uppercase tracking-tight">Challenge</h3>
                  <p className="text-[#F2F2F2]">{caseStudy.challenge}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#FFC96C] mb-2 uppercase tracking-tight">Solution</h3>
                  <p className="text-[#F2F2F2]">{caseStudy.solution}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#FFC96C] mb-2 uppercase tracking-tight">Results</h3>
                  <div className="space-y-3">
                    {caseStudy.results.map((result, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#FFC96C] flex-shrink-0 mt-0.5" />
                        <span className="text-[#F2F2F2]">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Link to="/product" className="btn-primary inline-flex items-center gap-2">
                Get Started with DHStx
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="h2 font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight text-balance">
              READY TO TRANSFORM YOUR HEALTHCARE GOVERNANCE?
            </h2>
            <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] mb-8 text-pretty">
              Join 500+ healthcare organizations that trust DHStx for their governance needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/product" className="btn-primary">
                View Pricing & Plans
              </Link>
              <Link to="/" className="btn-system">
                Explore All Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#202020]">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-[#B3B3B3] text-sm">
            <p className="uppercase tracking-tight">© 2024 DHStx. Healthcare Governance Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
