import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Board Chair, University Medical Center",
      company: "UMC Healthcare System",
      content: "DHStx transformed how our board operates. We've reduced meeting prep time by 60% and improved strategic alignment across all committees.",
      rating: 5,
      image: null
    },
    {
      name: "Michael Chen",
      role: "Executive Director",
      company: "Tech Education Foundation",
      content: "The platform's AI-powered insights have been game-changing. We can now track initiatives in real-time and make data-driven decisions faster than ever.",
      rating: 5,
      image: null
    },
    {
      name: "Jennifer Rodriguez",
      role: "Chief Operating Officer",
      company: "Global Nonprofit Alliance",
      content: "Implementing DHStx was the best decision we made this year. Our board engagement increased by 45% and we finally have all our data in one place.",
      rating: 5,
      image: null
    }
  ];

  return (
    <section className="py-24 bg-[#0C0C0C]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
            TRUSTED BY LEADING ORGANIZATIONS
          </h2>
          <p className="text-[#B3B3B3] text-lg max-w-2xl mx-auto">
            See how boards and organizations are transforming their operations with DHStx
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="panel-system p-8">
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#FFC96C] text-[#FFC96C]" />
                ))}
              </div>

              {/* Content */}
              <p className="text-[#F2F2F2] mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-[#202020]">
                <div className="w-12 h-12 rounded-full bg-[#202020] flex items-center justify-center">
                  <span className="text-[#FFC96C] text-lg font-bold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-[#F2F2F2] font-medium">{testimonial.name}</p>
                  <p className="text-[#B3B3B3] text-sm">{testimonial.role}</p>
                  <p className="text-[#B3B3B3] text-xs">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-4 panel-system">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#FFC96C]">500+</p>
              <p className="text-[#B3B3B3] text-sm">Organizations</p>
            </div>
            <div className="h-12 w-px bg-[#202020]"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#FFC96C]">98%</p>
              <p className="text-[#B3B3B3] text-sm">Satisfaction Rate</p>
            </div>
            <div className="h-12 w-px bg-[#202020]"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#FFC96C]">24/7</p>
              <p className="text-[#B3B3B3] text-sm">Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
