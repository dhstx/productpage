import { Link } from 'react-router-dom';
import { Heart, Users, DollarSign, Calendar, Target, TrendingUp } from 'lucide-react';

export default function UseCaseNonprofit() {
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
              View Pricing
            </Link>
            <Link to="/login" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded-[4px] border border-[#202020] mb-6">
              <Heart className="w-4 h-4 text-[#FFC96C]" />
              <span className="text-[#FFC96C] text-sm uppercase tracking-tight font-bold">Nonprofit Organizations</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight">
              MAXIMIZE YOUR IMPACT
            </h1>
            <p className="text-xl text-[#B3B3B3] mb-8">
              Streamline donor management, volunteer coordination, and program delivery so you can focus on your mission
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/product" className="btn-primary">
                Request Demo
              </Link>
              <Link to="/use-cases/healthcare" className="btn-system">
                View Other Industries
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#F2F2F2] mb-12 text-center uppercase tracking-tight">
              CHALLENGES FACING NONPROFIT ORGANIZATIONS
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6">
                <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C]/20 flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-[#FFC96C]" />
                </div>
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                  Limited Resources
                </h3>
                <p className="text-[#B3B3B3]">
                  Small teams wear multiple hats. Manual processes and disconnected tools waste precious time that could be spent on mission-critical work.
                </p>
              </div>
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6">
                <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C]/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#FFC96C]" />
                </div>
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                  Volunteer Management
                </h3>
                <p className="text-[#B3B3B3]">
                  Coordinating volunteers across multiple programs is chaotic. Scheduling conflicts, poor communication, and high turnover drain resources.
                </p>
              </div>
              <div className="bg-[#1A1A1A] rounded-[#4px] border border-[#202020] p-6">
                <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C]/20 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-[#FFC96C]" />
                </div>
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                  Impact Tracking
                </h3>
                <p className="text-[#B3B3B3]">
                  Donors and grantors demand proof of impact. Manual reporting makes it difficult to demonstrate outcomes and secure continued funding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#F2F2F2] mb-12 text-center uppercase tracking-tight">
              HOW DHSTX HELPS NONPROFIT ORGANIZATIONS
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-[4px] bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                      Donor Management
                    </h3>
                    <p className="text-[#B3B3B3]">
                      Track donor relationships, manage campaigns, and automate thank-you communications. Build stronger relationships that drive recurring donations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-[4px] bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                      Volunteer Coordination
                    </h3>
                    <p className="text-[#B3B3B3]">
                      Simplify volunteer scheduling, onboarding, and communication. Reduce no-shows by 60% with automated reminders and easy shift management.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[4px] bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                      Event Management
                    </h3>
                    <p className="text-[#B3B3B3]">
                      Plan fundraisers, community events, and programs with ease. Handle registrations, payments, and communications in one platform.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-[4px] bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                      Impact Reporting
                    </h3>
                    <p className="text-[#B3B3B3]">
                      Generate beautiful reports that showcase your impact. Track program outcomes, volunteer hours, and donor engagement with real-time dashboards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-[4px] bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                      Grant Management
                    </h3>
                    <p className="text-[#B3B3B3]">
                      Track grant applications, deadlines, and reporting requirements. Never miss a deadline and demonstrate compliance with ease.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[4px] bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                      Affordable Pricing
                    </h3>
                    <p className="text-[#B3B3B3]">
                      Enterprise features without the enterprise price tag. Special nonprofit pricing ensures you get powerful tools that fit your budget.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0C0C0C] rounded-[4px] border border-[#202020] mb-4">
                  <Heart className="w-4 h-4 text-[#4CAF50]" />
                  <span className="text-[#4CAF50] text-sm uppercase tracking-tight font-bold">Success Story</span>
                </div>
                <h2 className="text-3xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
                  COMMUNITY FOUNDATION DOUBLES IMPACT
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#4CAF50] mb-2">60%</div>
                  <div className="text-[#B3B3B3]">More Volunteers</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#4CAF50] mb-2">45%</div>
                  <div className="text-[#B3B3B3]">Donor Retention</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#4CAF50] mb-2">$2M+</div>
                  <div className="text-[#B3B3B3]">Additional Funding</div>
                </div>
              </div>
              <blockquote className="text-xl text-[#F2F2F2] italic mb-6 text-center">
                "DHStx transformed how we operate. Our volunteer coordination improved by 60%, donor communication is streamlined, and we secured $2M in additional grants thanks to better impact reporting. Best investment we've made."
              </blockquote>
              <div className="text-center text-[#B3B3B3]">
                <div className="font-bold text-[#F2F2F2]">Jennifer Rodriguez</div>
                <div>Executive Director, Community Foundation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-[#F2F2F2] mb-12 text-center uppercase tracking-tight">
              BUILT FOR NONPROFITS
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                'Donor & Fundraising Management',
                'Volunteer Scheduling & Tracking',
                'Event Planning & Registration',
                'Grant Application Tracking',
                'Impact & Outcome Reporting',
                'Email Campaign Tools',
                'Online Donation Processing',
                'Volunteer Hour Tracking',
                'Program Management',
                'Financial Reporting',
                'Mobile App for Volunteers',
                'Nonprofit Pricing Available'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-[#1A1A1A] rounded-[4px] border border-[#202020]">
                  <div className="w-2 h-2 rounded-full bg-[#4CAF50] flex-shrink-0" />
                  <span className="text-[#F2F2F2]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight">
              READY TO AMPLIFY YOUR MISSION?
            </h2>
            <p className="text-xl text-[#B3B3B3] mb-8">
              Join hundreds of nonprofits using DHStx to do more with less and maximize their impact
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/product" className="btn-primary">
                Request Demo
              </Link>
              <Link to="/security" className="btn-system">
                View Security & Compliance
              </Link>
            </div>
            <p className="text-sm text-[#B3B3B3] mt-6">
              Special nonprofit pricing - up to 40% off standard rates
            </p>
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
              <Link to="/use-cases/healthcare" className="hover:text-[#FFC96C]">Healthcare</Link>
              <a href="#" className="hover:text-[#FFC96C]">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
