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
    <section className="relative w-full max-w-screen overflow-x-hidden bg-[#0C0C0C] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
          {/* Header */}
          <div className="text-center">
            <h2 className="h2 mb-4 font-bold uppercase tracking-tight text-[#F2F2F2]">
              SEE THE PLATFORM IN ACTION
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] text-pretty">
              Watch a 5-minute walkthrough of how DHStx transforms company management and strategic planning
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
            {/* Video Player */}
            <div className="relative min-w-0">
              <div className="relative aspect-video overflow-hidden rounded-[4px] border border-[#202020] bg-[#1A1A1A]">
                {!isPlaying ? (
                  <>
                    {/* Thumbnail */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0C0C0C]">
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-[#FFC96C] transition-colors hover:bg-[#FFD68C]"
                             onClick={() => setIsPlaying(true)}>
                          <Play className="ml-1 h-10 w-10 text-[#0C0C0C]" fill="#0C0C0C" />
                        </div>
                        <p className="text-sm font-semibold uppercase tracking-tight text-[#F2F2F2] sm:text-base">Watch Demo</p>
                        <p className="mt-1 text-xs text-[#B3B3B3] sm:text-sm">5:23 minutes</p>
                      </div>
                    </div>

                    {/* Demo Preview Image */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="h-full w-full bg-gradient-to-br from-[#FFC96C]/10 to-transparent"></div>
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
            <div className="flex min-w-0 flex-col gap-6">
              <h3 className="h3 uppercase tracking-tight text-[#F2F2F2]">
                What You'll Learn
              </h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm text-[#F2F2F2] sm:text-base">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#FFC96C]" />
                    <span className="text-pretty">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="btn-system"
                >
                  <Play className="h-4 w-4" />
                  Watch Full Demo
                </button>
                <a
                  href="/product"
                  className="btn-system"
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
