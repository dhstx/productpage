import { Link } from 'react-router-dom';
import BackArrow from '../components/BackArrow';
import { CheckCircle, Clock, Activity, Server, Database, Globe, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StatusLive() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [uptimeHistory, setUptimeHistory] = useState(null);
  const [incidents, setIncidents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Fetch system status
  const fetchSystemStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status/current`);
      if (!response.ok) throw new Error('Failed to fetch system status');
      const data = await response.json();
      setSystemStatus(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching system status:', err);
      setError(err.message);
    }
  };

  // Fetch uptime history
  const fetchUptimeHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status/uptime`);
      if (!response.ok) throw new Error('Failed to fetch uptime history');
      const data = await response.json();
      setUptimeHistory(data);
    } catch (err) {
      console.error('Error fetching uptime history:', err);
    }
  };

  // Fetch incident history
  const fetchIncidents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status/incidents`);
      if (!response.ok) throw new Error('Failed to fetch incidents');
      const data = await response.json();
      setIncidents(data);
    } catch (err) {
      console.error('Error fetching incidents:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSystemStatus(),
        fetchUptimeHistory(),
        fetchIncidents()
      ]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchSystemStatus();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Manual refresh
  const handleRefresh = async () => {
    await fetchSystemStatus();
  };

  // Get icon component by name
  const getIconComponent = (iconName) => {
    const icons = {
      Server: Server,
      Globe: Globe,
      Database: Database,
      Shield: Shield
    };
    return icons[iconName] || Server;
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === 'operational' ? '#4CAF50' : '#FFA726';
  };

  // Get status text
  const getStatusText = (status) => {
    return status === 'operational' ? 'Operational' : 'Degraded';
  };

  // Format last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    const seconds = Math.floor((new Date() - lastUpdated) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full max-w-screen overflow-x-hidden min-w-0 bg-[#0C0C0C] flex items-center justify-center">
      <BackArrow />
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#FFC96C] animate-spin mx-auto mb-4" />
          <p className="text-[#F2F2F2] text-xl">Loading system status...</p>
        </div>
      </div>
    );
  }

  const overallStatus = systemStatus?.status || 'unknown';
  const isOperational = overallStatus === 'operational';

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
              <Activity className="w-4 h-4" style={{ color: getStatusColor(overallStatus) }} />
              <span className="text-sm uppercase tracking-tight font-bold" style={{ color: getStatusColor(overallStatus) }}>
                Live System Status
              </span>
            </div>
            <h1 className="h1 font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight text-balance">
              {isOperational ? 'ALL SYSTEMS OPERATIONAL' : 'SYSTEM DEGRADATION DETECTED'}
            </h1>
            <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] mb-8 text-pretty">
              Real-time status and uptime monitoring for all DHStx services
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2" style={{ color: getStatusColor(overallStatus) }}>
                {isOperational ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-bold">Last updated: {formatLastUpdated()}</span>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#202020] rounded-[4px] border border-[#202020] text-[#F2F2F2] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-bold uppercase">Refresh</span>
              </button>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[4px] border transition-colors ${
                  autoRefresh
                    ? 'bg-[#4CAF50] border-[#4CAF50] text-[#0C0C0C]'
                    : 'bg-[#1A1A1A] border-[#202020] text-[#F2F2F2] hover:bg-[#202020]'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span className="text-sm font-bold uppercase">
                  Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
            {error && (
              <div className="mt-6 p-4 bg-[#FFA726]/10 border border-[#FFA726] rounded-[4px]">
                <p className="text-[#FFA726]">⚠️ {error}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Current Status */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="h2 font-bold text-[#F2F2F2] mb-8 uppercase tracking-tight text-balance">
              CURRENT STATUS
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {systemStatus?.systems?.map((system, index) => {
                const IconComponent = getIconComponent(system.icon);
                const statusColor = getStatusColor(system.status);
                
                return (
                  <div key={index} className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6 hover:border-[#FFC96C] transition-colors">
      <BackArrow />
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-[4px] flex items-center justify-center"
                          style={{ backgroundColor: `${statusColor}20` }}
                        >
                          <IconComponent className="w-6 h-6" style={{ color: statusColor }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">
                            {system.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {system.status === 'operational' ? (
                              <CheckCircle className="w-4 h-4" style={{ color: statusColor }} />
                            ) : (
                              <AlertCircle className="w-4 h-4" style={{ color: statusColor }} />
                            )}
                            <span className="text-sm uppercase font-bold" style={{ color: statusColor }}>
                              {getStatusText(system.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-[#B3B3B3] mb-1">Uptime (90 days)</div>
                        <div className="text-2xl font-bold text-[#F2F2F2]">{system.uptime}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-[#B3B3B3] mb-1">Response Time</div>
                        <div className="text-2xl font-bold text-[#F2F2F2]">{system.responseTime}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Uptime Chart */}
      {uptimeHistory && (
        <section className="py-24 border-b border-[#202020]">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="h2 font-bold text-[#F2F2F2] mb-8 uppercase tracking-tight text-balance">
                90-DAY UPTIME
              </h2>
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8">
                <div className="flex items-end justify-between gap-4 h-64">
                  {uptimeHistory.data.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-4">
                      <div className="w-full bg-[#0C0C0C] rounded-[4px] relative" style={{ height: '200px' }}>
                        <div 
                          className="absolute bottom-0 w-full bg-[#4CAF50] rounded-[4px] flex items-end justify-center pb-2 transition-all duration-500"
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
                  <div className="text-[clamp(1.75rem,6vw,2.5rem)] font-bold text-[#4CAF50] mb-2">{uptimeHistory.average}%</div>
                  <div className="text-[#B3B3B3]">Average uptime over last 90 days</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Incident History */}
      {incidents && incidents.incidents && (
        <section className="py-24 border-b border-[#202020]">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="h2 font-bold text-[#F2F2F2] mb-8 uppercase tracking-tight text-balance">
                INCIDENT HISTORY
              </h2>
              <div className="space-y-6">
                {incidents.incidents.map((incident, index) => (
                  <div key={index} className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6 hover:border-[#FFC96C] transition-colors">
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
      )}

      {/* Subscribe */}
        <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="h2 font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight text-balance">
              GET STATUS UPDATES
            </h2>
            <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] mb-8 text-pretty">
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

