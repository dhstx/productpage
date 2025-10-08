import { Link } from 'react-router-dom';
import { GraduationCap, Users, Calendar, FileText, BarChart, Shield } from 'lucide-react';

export default function UseCaseEducation() {
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
              <GraduationCap className="w-4 h-4 text-[#FFC96C]" />
              <span className="text-[#FFC96C] text-sm uppercase tracking-tight font-bold">Educational Institutions</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight">
              TRANSFORM CAMPUS MANAGEMENT
            </h1>
            <p className="text-xl text-[#B3B3B3] mb-8">
              Streamline student services, faculty coordination, and administrative operations across your entire institution
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
              CHALLENGES FACING EDUCATIONAL INSTITUTIONS
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6">
                <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C]/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#FFC96C]" />
                </div>
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                  Fragmented Communication
                </h3>
                <p className="text-[#B3B3B3]">
                  Faculty, staff, and students use different tools. Important information gets lost in email chains and disconnected systems.
                </p>
              </div>
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6">
                <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C]/20 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-[#FFC96C]" />
                </div>
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                  Complex Scheduling
                </h3>
                <p className="text-[#B3B3B3]">
                  Coordinating classes, meetings, events, and resources across departments is time-consuming and error-prone.
                </p>
              </div>
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6">
                <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C]/20 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-[#FFC96C]" />
                </div>
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                  Manual Processes
                </h3>
                <p className="text-[#B3B3B3]">
                  Student services, enrollment, and administrative tasks rely on paper forms and manual data entry, wasting valuable time.
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
              HOW DHSTX HELPS EDUCATIONAL INSTITUTIONS
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-[4px] bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                      Unified Communication
                    </h3>
                    <p className="text-[#B3B3B3]">
                      Bring faculty, staff, and students together in one platform. Share announcements, collaborate on projects, and keep everyone informed in real-time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-[4px] bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                      Smart Scheduling
                    </h3>
                    <p className="text-[#B3B3B3]">
                      Automate class scheduling, room bookings, and event planning. Avoid conflicts and maximize resource utilization across campus.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[4px] bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                      Digital Workflows
                    </h3>
                    <p className="text-[#B3B3B3]">
                      Digitize student services, enrollment processes, and administrative tasks. Reduce paperwork and speed up operations by 60%.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-[4px] bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                    <BarChart className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                      Student Analytics
                    </h3>
                    <p className="text-[#B3B3B3]">
                      Track student engagement, identify at-risk students early, and measure program effectiveness with comprehensive analytics dashboards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-[4px] bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                      FERPA Compliance
                    </h3>
                    <p className="text-[#B3B3B3]">
                      Built-in FERPA compliance with role-based access controls, audit trails, and secure data handling for student records.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[4px] bg-[#4CAF50]/20 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                      Student Portal
                    </h3>
                    <p className="text-[#B3B3B3]">
                      Give students a central hub for accessing resources, submitting forms, tracking progress, and connecting with support services.
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
                  <GraduationCap className="w-4 h-4 text-[#4CAF50]" />
                  <span className="text-[#4CAF50] text-sm uppercase tracking-tight font-bold">Success Story</span>
                </div>
                <h2 className="text-3xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
                  STATE UNIVERSITY TRANSFORMS STUDENT SERVICES
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#4CAF50] mb-2">95%</div>
                  <div className="text-[#B3B3B3]">Student Adoption Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#4CAF50] mb-2">60%</div>
                  <div className="text-[#B3B3B3]">Faster Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#4CAF50] mb-2">40%</div>
                  <div className="text-[#B3B3B3]">Cost Reduction</div>
                </div>
              </div>
              <blockquote className="text-xl text-[#F2F2F2] italic mb-6 text-center">
                "DHStx unified our 12 departments and 15,000 students on one platform. Student satisfaction scores increased by 35%, and our administrative staff can now focus on high-value work instead of paperwork."
              </blockquote>
              <div className="text-center text-[#B3B3B3]">
                <div className="font-bold text-[#F2F2F2]">Michael Chen</div>
                <div>Dean of Students, State University</div>
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
              BUILT FOR EDUCATION
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                'Student Information Management',
                'Course & Class Scheduling',
                'Faculty Collaboration Tools',
                'Event & Calendar Management',
                'Document & Form Management',
                'Student Support Ticketing',
                'Analytics & Reporting',
                'Mobile App for Students',
                'Parent Portal Access',
                'Integration with SIS/LMS',
                'Automated Notifications',
                'FERPA Compliance Built-in'
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
              READY TO TRANSFORM YOUR CAMPUS?
            </h2>
            <p className="text-xl text-[#B3B3B3] mb-8">
              Join hundreds of educational institutions using DHStx to streamline operations and improve student outcomes
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
              Special pricing available for educational institutions
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
