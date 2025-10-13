import { useState } from 'react';
import { Star, Check, Filter } from 'lucide-react';

export default function CustomerReviews() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const reviews = [
    {
      id: 1,
      name: 'Dr. Sarah Mitchell',
      role: 'Chief Medical Officer',
      company: 'Regional Health Network',
      industry: 'Healthcare',
      rating: 5,
      date: '2 weeks ago',
      verified: true,
      avatar: 'S',
      review: 'DHStx has transformed how our medical staff coordinates across departments. The HIPAA compliance and secure communication features are exactly what we needed. Implementation was seamless, and our team adoption rate hit 95% within the first month.',
      helpful: 24
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Dean of Students',
      company: 'State University',
      industry: 'Education',
      rating: 5,
      date: '3 weeks ago',
      verified: true,
      avatar: 'M',
      review: 'Managing student services across 12 departments used to be chaotic. DHStx brought everything together in one platform. The analytics dashboard helps us track engagement and identify students who need support. Absolutely worth the investment.',
      helpful: 18
    },
    {
      id: 3,
      name: 'Jennifer Rodriguez',
      role: 'Executive Director',
      company: 'Community Foundation',
      industry: 'Nonprofit',
      rating: 5,
      date: '1 month ago',
      verified: true,
      avatar: 'J',
      review: 'As a nonprofit, we needed powerful tools without the enterprise price tag. DHStx delivers exactly that. Our volunteer coordination improved by 60%, and donor communication is now streamlined. The team management features are outstanding.',
      helpful: 31
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'VP of Operations',
      company: 'Tech Innovations Inc',
      industry: 'Technology',
      rating: 5,
      date: '1 month ago',
      verified: true,
      avatar: 'D',
      review: 'We evaluated 8 different platforms before choosing DHStx. The API integration capabilities and webhook support made it the clear winner. Our development team had it integrated with our existing stack in under a week. Excellent documentation.',
      helpful: 22
    },
    {
      id: 5,
      name: 'Lisa Park',
      role: 'Chief Strategy Officer',
      company: 'Global Consulting Group',
      industry: 'Consulting',
      rating: 5,
      date: '2 months ago',
      verified: true,
      avatar: 'L',
      review: 'Managing client projects across multiple teams was our biggest challenge. DHStx solved it completely. The real-time collaboration features and audit trails give us full transparency. Client satisfaction scores increased by 35% since implementation.',
      helpful: 27
    },
    {
      id: 6,
      name: 'Robert Williams',
      role: 'Director of Finance',
      company: 'Manufacturing Solutions',
      industry: 'Manufacturing',
      rating: 4,
      date: '2 months ago',
      verified: true,
      avatar: 'R',
      review: 'Solid platform with great security features. The financial reporting integration with QuickBooks saved us countless hours. Only minor complaint is the mobile app could use some UI improvements, but the web platform is excellent.',
      helpful: 15
    },
    {
      id: 7,
      name: 'Amanda Foster',
      role: 'HR Director',
      company: 'Retail Chain Corp',
      industry: 'Retail',
      rating: 5,
      date: '3 months ago',
      verified: true,
      avatar: 'A',
      review: 'Onboarding 200+ seasonal employees used to take weeks. With DHStx, we cut that time in half. The automated workflows and document management are game-changers. Support team is incredibly responsive and helpful.',
      helpful: 19
    },
    {
      id: 8,
      name: 'James Martinez',
      role: 'Managing Partner',
      company: 'Law Firm Associates',
      industry: 'Legal',
      rating: 5,
      date: '3 months ago',
      verified: true,
      avatar: 'J',
      review: 'Client confidentiality is paramount in our industry. DHStx\'s security infrastructure and compliance certifications gave us complete confidence. The audit trails and access controls are exactly what we need for regulatory compliance.',
      helpful: 21
    }
  ];

  const industries = ['All', 'Healthcare', 'Education', 'Nonprofit', 'Technology', 'Consulting', 'Manufacturing', 'Retail', 'Legal'];

  const filteredReviews = selectedFilter === 'All' 
    ? reviews 
    : reviews.filter(review => review.industry === selectedFilter);

  const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;
  const fiveStarCount = reviews.filter(r => r.rating === 5).length;
  const fourStarCount = reviews.filter(r => r.rating === 4).length;

  return (
    <section className="py-24 bg-[#0C0C0C] border-t border-[#202020]">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded-[4px] border border-[#202020] mb-6">
              <Star className="w-4 h-4 text-[#FFC96C]" fill="#FFC96C" />
              <span className="text-[#FFC96C] text-sm uppercase tracking-tight font-bold">Customer Reviews</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
              TRUSTED BY ORGANIZATIONS WORLDWIDE
            </h2>
            <p className="text-xl text-[#B3B3B3]">
              Real feedback from real customers across industries
            </p>
          </div>

          {/* Rating Summary */}
          <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8 mb-12">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-6xl font-bold text-[#FFC96C] mb-2">{averageRating}</div>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#FFC96C]" fill="#FFC96C" />
                  ))}
                </div>
                <div className="text-[#B3B3B3]">{totalReviews} reviews</div>
              </div>

              {/* Rating Breakdown */}
              <div className="md:col-span-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#FFC96C]" fill="#FFC96C" />
                      ))}
                    </div>
                    <div className="flex-1 h-2 bg-[#0C0C0C] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FFC96C]" 
                        style={{ width: `${(fiveStarCount / totalReviews) * 100}%` }}
                      />
                    </div>
                    <div className="text-[#B3B3B3] text-sm w-12 text-right">{fiveStarCount}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#FFC96C]" fill="#FFC96C" />
                      ))}
                      <Star className="w-4 h-4 text-[#202020]" />
                    </div>
                    <div className="flex-1 h-2 bg-[#0C0C0C] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FFC96C]" 
                        style={{ width: `${(fourStarCount / totalReviews) * 100}%` }}
                      />
                    </div>
                    <div className="text-[#B3B3B3] text-sm w-12 text-right">{fourStarCount}</div>
                  </div>
                  {[3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-4">
                      <div className="flex gap-1">
                        {[...Array(stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-[#FFC96C]" fill="#FFC96C" />
                        ))}
                        {[...Array(5 - stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-[#202020]" />
                        ))}
                      </div>
                      <div className="flex-1 h-2 bg-[#0C0C0C] rounded-full" />
                      <div className="text-[#B3B3B3] text-sm w-12 text-right">0</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Industry Filter */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-4">
            <div className="flex items-center gap-2 text-[#B3B3B3] flex-shrink-0">
              <Filter className="w-4 h-4" />
              <span className="text-sm uppercase tracking-tight font-bold">Filter:</span>
            </div>
            <div className="flex gap-3">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedFilter(industry)}
                  className={`px-4 py-2 rounded-[4px] border text-sm uppercase tracking-tight font-bold transition-colors ${
                    selectedFilter === industry
                      ? 'bg-[#FFC96C] text-[#0C0C0C] border-[#FFC96C]'
                      : 'bg-[#1A1A1A] text-[#F2F2F2] border-[#202020] hover:border-[#FFC96C]'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6 hover:border-[#FFC96C] transition-colors">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FFC96C] flex items-center justify-center text-[#0C0C0C] font-bold text-lg flex-shrink-0">
                      {review.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[#F2F2F2] font-bold">{review.name}</h3>
                        {review.verified && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-[#4CAF50] rounded-[4px]">
                            <Check className="w-3 h-3 text-[#0C0C0C]" />
                            <span className="text-[#0C0C0C] text-xs font-bold uppercase">Verified</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-[#B3B3B3]">{review.role}</div>
                      <div className="text-sm text-[#B3B3B3]">{review.company}</div>
                    </div>
                  </div>
                  <div className="text-xs text-[#B3B3B3]">{review.date}</div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-[#FFC96C]' : 'text-[#202020]'}`}
                        fill={i < review.rating ? '#FFC96C' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="text-xs px-2 py-1 bg-[#0C0C0C] rounded-[4px] text-[#FFC96C] uppercase font-bold">
                    {review.industry}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-[#F2F2F2] mb-4 leading-relaxed">
                  {review.review}
                </p>

                {/* Helpful */}
                <div className="flex items-center gap-2 text-sm text-[#B3B3B3]">
                  <button className="hover:text-[#FFC96C] transition-colors">Helpful</button>
                  <span>·</span>
                  <span>{review.helpful} people found this helpful</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-[#B3B3B3] mb-4">Join hundreds of satisfied organizations</p>
            <a href="/product" className="btn-primary inline-block">
              Get Started Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
