import { ExternalLink } from 'lucide-react';
import BackArrow from '../components/BackArrow';
import PageHeading from '../components/PageHeading';
import { getMockPurchases } from '../lib/stripe';
import { Link } from 'react-router-dom';
import "@/styles/platforms-layout.css";
import "@/styles/theme-overrides.css";

export default function Platforms() {
  const purchases = getMockPurchases();

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    alert('Portal link copied to clipboard!');
  };

  const getHost = (url) => {
    try {
      return new URL(url).host;
    } catch {
      return String(url || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
    }
  };

  return (
    <div className="platforms-page">
      <BackArrow />
      <header className="container">
        <PageHeading className="uppercase">PLATFORMS</PageHeading>
        <p className="muted">Access and manage your platform instances and system status.</p>
      </header>

      {/* MANAGEMENT PORTAL block, aligned with header */}
      {purchases.map((purchase) => (
        <section key={purchase.id} className="container section">
          <div className="panel">
            <div className="title-row">
              <h2 className="text-lg font-bold">MANAGEMENT PORTAL</h2>
              <div className="muted">{purchase.productName} • Purchased {purchase.purchaseDate}</div>
              <div className="muted">● {String(purchase.status || '').charAt(0).toUpperCase() + String(purchase.status || '').slice(1)}  •  {getHost(purchase.platformUrl)}</div>
            </div>

            <div className="kpi-grid" style={{marginTop:12}}>
              <div className="kpi-card"><div>ACTIVE INITIATIVES</div><div>0</div></div>
              <div className="kpi-card"><div>TEAM MEMBERS</div><div>0</div></div>
              <div className="kpi-card"><div>UPCOMING EVENTS</div><div>0</div></div>
              <div className="kpi-card"><div>TEAMS</div><div>0</div></div>
            </div>

            <div className="quick-actions" style={{marginTop:14}}>
              <a href={purchase.platformUrl} target="_blank" rel="noopener noreferrer" className="btn-system">
                <ExternalLink className="w-4 h-4" />
                Open Portal
              </a>
              <button className="btn-system" onClick={() => handleCopyLink(purchase.platformUrl)}>Copy Portal Link</button>
            </div>
          </div>
        </section>
      ))}

      {/* SYSTEM STATUS / URGENT / UPCOMING — same container & panel size */}
      <section className="container section">
        <div className="panel"><h3>SYSTEM STATUS</h3></div>
      </section>
      <section className="container section">
        <div className="panel"><h3>URGENT ACTIONS</h3></div>
      </section>
      <section className="container section">
        <div className="panel"><h3>UPCOMING EVENTS</h3></div>
      </section>
    </div>
  );
}

