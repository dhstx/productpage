import { Play, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ProductDemo() {
  const [isPlaying, setIsPlaying] = useState(false);

  const features = [
    'Complete platform walkthrough',
    'Admin portal demonstration',
    'Team management in action',
    'Billing and subscription flow',
    'Real-world use cases'
  ];

  return (
    <section className="py-24 bg-[#0C0C0C]">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
              SEE THE PLATFORM IN ACTION
            </h2>
            <p className="text-xl text-[#B3B3B3] max-w-2xl mx-auto">
              Watch a 5-minute walkthrough of how DHStx transforms company management and strategic planning
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Video Player */}
            <div className="relative">
              <div className="relative aspect-video bg-[#1A1A1A] rounded-[4px] overflow-hidden border border-[#202020]">
                {!isPlaying ? (
                  <>
                    {/* Thumbnail */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0C0C0C]">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-[#FFC96C] flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-[#FFD68C] transition-colors"
                             onClick={() => setIsPlaying(true)}>
                          <Play className="w-10 h-10 text-[#0C0C0C] ml-1" fill="#0C0C0C" />
                        </div>
                        <p className="text-[#F2F2F2] text-lg font-bold uppercase tracking-tight">Watch Demo</p>
                        <p className="text-[#B3B3B3] text-sm mt-1">5:23 minutes</p>
                      </div>
                    </div>
                    
                    {/* Demo Preview Image */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="w-full h-full bg-gradient-to-br from-[#FFC96C]/10 to-transparent"></div>
                    </div>
                  </>
                ) : (
                  /* Video Embed - Replace with actual video URL */
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A]">
                      <div className="text-center p-8">
                        <p className="text-[#F2F2F2] mb-4">
                          Video player will be embedded here
                        </p>
                        <p className="text-[#B3B3B3] text-sm mb-6">
                          Replace this with your YouTube, Vimeo, or Loom embed code
                        </p>
                        <button
                          onClick={() => setIsPlaying(false)}
                          className="btn-system"
                        >
                          Close Preview
                        </button>
                      </div>
                    </div>
                    {/* 
                    Example YouTube embed:
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
                      title="DHStx Platform Demo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    */}
                  </div>
                )}
              </div>
            </div>

            {/* Features List */}
            <div>
              <h3 className="text-2xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight">
                What You'll Learn
              </h3>
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#FFC96C] flex-shrink-0 mt-0.5" />
                    <span className="text-[#F2F2F2]">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Watch Full Demo
                </button>
                <a
                  href="/product"
                  className="btn-system w-full flex items-center justify-center"
                >
                  View Pricing
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
