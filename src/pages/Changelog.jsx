import { Link } from 'react-router-dom';
import BackArrow from '../components/BackArrow';
import { Sparkles, Bug, Zap, Shield, Package } from 'lucide-react';

export default function Changelog() {
  const releases = [
    {
      version: '2.5.0',
      date: 'October 5, 2025',
      type: 'major',
      changes: [
        {
          type: 'feature',
          icon: Sparkles,
          title: 'Advanced Analytics Dashboard',
          description: 'New comprehensive analytics with custom date ranges, export capabilities, and real-time metrics visualization.'
        },
        {
          type: 'feature',
          icon: Zap,
          title: 'Webhook Enhancements',
          description: 'Added support for custom webhook headers, retry configuration, and detailed delivery logs.'
        },
        {
          type: 'improvement',
          icon: Package,
          title: 'Performance Optimization',
          description: 'Reduced page load times by 40% through code splitting and lazy loading improvements.'
        },
        {
          type: 'security',
          icon: Shield,
          title: 'Enhanced Security',
          description: 'Implemented additional rate limiting and DDoS protection measures.'
        }
      ]
    },
    {
      version: '2.4.2',
      date: 'September 28, 2025',
      type: 'patch',
      changes: [
        {
          type: 'fix',
          icon: Bug,
          title: 'Fixed Email Notification Delay',
          description: 'Resolved issue where email notifications were delayed by up to 5 minutes.'
        },
        {
          type: 'fix',
          icon: Bug,
          title: 'Mobile UI Improvements',
          description: 'Fixed layout issues on iOS devices and improved touch target sizes.'
        },
        {
          type: 'improvement',
          icon: Package,
          title: 'API Response Time',
          description: 'Optimized database queries resulting in 25% faster API responses.'
        }
      ]
    },
    {
      version: '2.4.0',
      date: 'September 15, 2025',
      type: 'minor',
      changes: [
        {
          type: 'feature',
          icon: Sparkles,
          title: 'Team Collaboration Tools',
          description: 'Added real-time commenting, @mentions, and activity feeds for better team coordination.'
        },
        {
          type: 'feature',
          icon: Zap,
          title: 'Bulk Operations',
          description: 'New bulk edit and delete capabilities for managing multiple items simultaneously.'
        },
        {
          type: 'improvement',
          icon: Package,
          title: 'Search Improvements',
          description: 'Enhanced search with fuzzy matching and advanced filters.'
        }
      ]
    },
    {
      version: '2.3.1',
      date: 'September 1, 2025',
      type: 'patch',
      changes: [
        {
          type: 'fix',
          icon: Bug,
          title: 'Calendar Sync Issues',
          description: 'Fixed Google Calendar sync failures for recurring events.'
        },
        {
          type: 'fix',
          icon: Bug,
          title: 'Export Format Bug',
          description: 'Resolved CSV export encoding issues with special characters.'
        },
        {
          type: 'security',
          icon: Shield,
          title: 'Security Patch',
          description: 'Updated dependencies to address minor security vulnerabilities.'
        }
      ]
    },
    {
      version: '2.3.0',
      date: 'August 20, 2025',
      type: 'minor',
      changes: [
        {
          type: 'feature',
          icon: Sparkles,
          title: 'Custom Branding',
          description: 'Organizations can now customize colors, logos, and domain names for white-label deployments.'
        },
        {
          type: 'feature',
          icon: Zap,
          title: 'API Rate Limit Increase',
          description: 'Increased API rate limits from 5,000 to 10,000 requests per hour for all plans.'
        },
        {
          type: 'improvement',
          icon: Package,
          title: 'Mobile App Updates',
          description: 'Improved offline mode and added push notifications for iOS and Android apps.'
        }
      ]
    },
    {
      version: '2.2.0',
      date: 'August 1, 2025',
      type: 'minor',
      changes: [
        {
          type: 'feature',
          icon: Sparkles,
          title: 'SSO/SAML Integration',
          description: 'Enterprise customers can now configure single sign-on with SAML 2.0 providers.'
        },
        {
          type: 'feature',
          icon: Zap,
          title: 'Advanced Permissions',
          description: 'Granular role-based access control with custom permission sets.'
        },
        {
          type: 'improvement',
          icon: Package,
          title: 'Dashboard Redesign',
          description: 'Refreshed dashboard UI with improved data visualization and customizable widgets.'
        }
      ]
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'major': return 'text-[#FFC96C] border-[#FFC96C]';
      case 'minor': return 'text-[#4CAF50] border-[#4CAF50]';
      case 'patch': return 'text-[#2196F3] border-[#2196F3]';
      default: return 'text-[#B3B3B3] border-[#B3B3B3]';
    }
  };

  const getChangeTypeColor = (type) => {
    switch (type) {
      case 'feature': return 'bg-[#4CAF50]/20 text-[#4CAF50]';
      case 'improvement': return 'bg-[#2196F3]/20 text-[#2196F3]';
      case 'fix': return 'bg-[#FF9800]/20 text-[#FF9800]';
      case 'security': return 'bg-[#F44336]/20 text-[#F44336]';
      default: return 'bg-[#B3B3B3]/20 text-[#B3B3B3]';
    }
  };

  return (
    <div className="min-h-screen w-full max-w-screen overflow-x-hidden min-w-0 bg-[#0C0C0C]">
      <BackArrow />
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
              <Package className="w-4 h-4 text-[#FFC96C]" />
              <span className="text-[#FFC96C] text-sm uppercase tracking-tight font-bold">Product Updates</span>
            </div>
            <h1 className="h1 font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight text-balance">
              CHANGELOG
            </h1>
            <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] mb-8 text-pretty">
              Track new features, improvements, and bug fixes across all releases
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/product" className="btn-primary">
                View Platform Features
              </Link>
              <a href="#subscribe" className="btn-system">
                Subscribe to Updates
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-12 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4CAF50]" />
                <span className="text-[#B3B3B3] text-sm">New Feature</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#2196F3]" />
                <span className="text-[#B3B3B3] text-sm">Improvement</span>
              </div>
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-[#FF9800]" />
                <span className="text-[#B3B3B3] text-sm">Bug Fix</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#F44336]" />
                <span className="text-[#B3B3B3] text-sm">Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Releases */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {releases.map((release, index) => (
                <div key={index} className="relative">
                  {/* Timeline Line */}
                  {index < releases.length - 1 && (
                    <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-[#202020]" />
                  )}
                  
                  <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8 relative">
                    {/* Version Badge */}
                    <div className="absolute -left-3 top-8 w-12 h-12 rounded-full bg-[#0C0C0C] border-2 border-[#FFC96C] flex items-center justify-center">
                      <Package className="w-6 h-6 text-[#FFC96C]" />
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between mb-6 ml-12">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="h2 font-bold text-[#F2F2F2] uppercase tracking-tight text-balance">
                            v{release.version}
                          </h2>
                          <span className={`px-3 py-1 rounded-[4px] border text-xs uppercase font-bold ${getTypeColor(release.type)}`}>
                            {release.type}
                          </span>
                        </div>
                        <div className="text-[#B3B3B3]">{release.date}</div>
                      </div>
                    </div>

                    {/* Changes */}
                    <div className="ml-12 space-y-4">
                      {release.changes.map((change, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 bg-[#0C0C0C] rounded-[4px]">
                          <div className={`w-10 h-10 rounded-[4px] flex items-center justify-center flex-shrink-0 ${getChangeTypeColor(change.type)}`}>
                            <change.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#F2F2F2] mb-1 uppercase tracking-tight">
                              {change.title}
                            </h3>
                            <p className="text-[#B3B3B3]">{change.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section id="subscribe" className="py-24 border-t border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="h2 font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight text-balance">
              STAY UPDATED
            </h2>
            <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] mb-8 text-pretty">
              Get notified about new features and updates
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
              Monthly updates delivered to your inbox
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
              <Link to="/changelog" className="hover:text-[#FFC96C]">Changelog</Link>
              <a href="#" className="hover:text-[#FFC96C]">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
