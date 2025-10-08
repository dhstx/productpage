import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Activity, Server, Database, Globe, Shield } from 'lucide-react';

export default function Status() {
  const systems = [
    {
      name: 'API Services',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '45ms',
      icon: Server
    },
    {
      name: 'Web Application',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '120ms',
      icon: Globe
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '100%',
      responseTime: '12ms',
      icon: Database
    },
    {
      name: 'Authentication',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '35ms',
      icon: Shield
    }
  ];

  const incidents = [
    {
      date: 'Oct 1, 2025',
      title: 'Scheduled Maintenance Completed',
      status: 'resolved',
      duration: '30 minutes',
      description: 'Database optimization and security patches applied successfully. No data loss or service disruption.',
      updates: [
        { time: '02:30 AM PST', message: 'Maintenance completed. All systems operational.' },
        { time: '02:00 AM PST', message: 'Maintenance in progress. Services temporarily unavailable.' },
        { time: '01:45 AM PST', message: 'Scheduled maintenance beginning in 15 minutes.' }
      ]
    },
    {
      date: 'Sep 15, 2025',
      title: 'API Response Time Degradation',
      status: 'resolved',
      duration: '12 minutes',
      description: 'Brief increase in API response times due to traffic spike. Auto-scaling resolved the issue.',
      updates: [
        { time: '03:42 PM PST', message: 'Response times back to normal. Monitoring continues.' },
        { time: '03:35 PM PST', message: 'Additional servers deployed. Performance improving.' },
        { time: '03:30 PM PST', message: 'Investigating elevated API response times.' }
      ]
    }
  ];

  const uptime90Days = [
    { date: 'Jul', uptime: 99.99 },
    { date: 'Aug', uptime: 99.98 },
    { date: 'Sep', uptime: 100 },
    { date: 'Oct', uptime: 99.99 }
  ];

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
              <Activity className="w-4 h-4 text-[#4CAF50]" />
              <span className="text-[#4CAF50] text-sm uppercase tracking-tight font-bold">System Status</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight">
              ALL SYSTEMS OPERATIONAL
            </h1>
            <p className="text-xl text-[#B3B3B3] mb-8">
              Real-time status and uptime monitoring for all DHStx services
            </p>
            <div className="flex items-center justify-center gap-2 text-[#4CAF50]">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold">Last updated: 2 minutes ago</span>
            </div>
          </div>
        </div>
      </section>

      {/* Current Status */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#F2F2F2] mb-8 uppercase tracking-tight">
              CURRENT STATUS
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {systems.map((system, index) => (
                <div key={index} className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-[4px] bg-[#4CAF50]/20 flex items-center justify-center">
                        <system.icon className="w-6 h-6 text-[#4CAF50]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">
                          {system.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                          <span className="text-sm text-[#4CAF50] uppercase font-bold">Operational</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-[#B3B3B3] mb-1">Uptime (90 days)</div>
                      <div className="text-2xl font-bold text-[#F2F2F2]">{system.uptime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#B3B3B3] mb-1">Response Time</div>
                      <div className="text-2xl font-bold text-[#F2F2F2]">{system.responseTime}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Uptime Chart */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#F2F2F2] mb-8 uppercase tracking-tight">
              90-DAY UPTIME
            </h2>
            <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8">
              <div className="flex items-end justify-between gap-4 h-64">
                {uptime90Days.map((month, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-4">
                    <div className="w-full bg-[#0C0C0C] rounded-[4px] relative" style={{ height: '200px' }}>
                      <div 
                        className="absolute bottom-0 w-full bg-[#4CAF50] rounded-[4px] flex items-end justify-center pb-2"
                        style={{ height: `${(month.uptime / 100) * 200}px` }}
                      >
                        <span className="text-[#0C0C0C] font-bold text-sm">{month.uptime}%</span>
                      </div>
                    </div>
                    <div className="text-[#B3B3B3] font-bold uppercase">{month.date}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <div className="text-4xl font-bold text-[#4CAF50] mb-2">99.99%</div>
                <div className="text-[#B3B3B3]">Average uptime over last 90 days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Incident History */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#F2F2F2] mb-8 uppercase tracking-tight">
              INCIDENT HISTORY
            </h2>
            <div className="space-y-6">
              {incidents.map((incident, index) => (
                <div key={index} className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
                        <h3 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">
                          {incident.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#B3B3B3]">
                        <span>{incident.date}</span>
                        <span>·</span>
                        <span>Duration: {incident.duration}</span>
                        <span>·</span>
                        <span className="text-[#4CAF50] uppercase font-bold">Resolved</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[#F2F2F2] mb-4">{incident.description}</p>
                  <div className="border-l-2 border-[#202020] pl-4 space-y-3">
                    {incident.updates.map((update, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-[#B3B3B3] mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-[#B3B3B3] mb-1">{update.time}</div>
                          <div className="text-[#F2F2F2]">{update.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight">
              GET STATUS UPDATES
            </h2>
            <p className="text-xl text-[#B3B3B3] mb-8">
              Subscribe to receive notifications about incidents and maintenance windows
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]"
              />
              <button className="btn-primary">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-[#B3B3B3] mt-4">
              We'll only email you about service disruptions and scheduled maintenance
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
              <Link to="/status" className="hover:text-[#FFC96C]">Status</Link>
              <a href="#" className="hover:text-[#FFC96C]">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
