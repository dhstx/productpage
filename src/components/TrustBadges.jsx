import { Shield, Lock, CheckCircle, Award } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "SOC 2 Compliant",
      description: "Enterprise-grade security"
    },
    {
      icon: Lock,
      title: "256-bit Encryption",
      description: "Bank-level data protection"
    },
    {
      icon: CheckCircle,
      title: "GDPR Compliant",
      description: "Privacy-first architecture"
    },
    {
      icon: Award,
      title: "99.9% Uptime",
      description: "Reliable & available"
    }
  ];

  return (
    <section className="py-16 bg-[#0C0C0C] border-t border-[#202020]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
            ENTERPRISE-GRADE SECURITY & COMPLIANCE
          </h3>
          <p className="text-[#B3B3B3]">
            Your data is protected with industry-leading security standards
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#202020] mb-4">
                  <Icon className="w-8 h-8 text-[#FFC96C]" />
                </div>
                <h4 className="text-[#F2F2F2] font-medium mb-1">{badge.title}</h4>
                <p className="text-[#B3B3B3] text-sm">{badge.description}</p>
              </div>
            );
          })}
        </div>

        {/* G2 Badge Placeholder */}
        <div className="mt-12 flex justify-center gap-8 items-center">
          <div className="panel-system px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#202020] flex items-center justify-center">
                <Award className="w-6 h-6 text-[#FFC96C]" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#F2F2F2] font-bold">4.8/5</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-[#FFC96C]">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-[#B3B3B3] text-xs">Based on 200+ reviews</p>
              </div>
            </div>
          </div>

          <div className="panel-system px-6 py-3">
            <div className="text-center">
              <p className="text-[#F2F2F2] font-bold mb-1">ISO 27001</p>
              <p className="text-[#B3B3B3] text-xs">Certified</p>
            </div>
          </div>

          <div className="panel-system px-6 py-3">
            <div className="text-center">
              <p className="text-[#F2F2F2] font-bold mb-1">HIPAA</p>
              <p className="text-[#B3B3B3] text-xs">Compliant</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
