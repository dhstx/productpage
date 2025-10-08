import { useEffect, useRef } from "react";
import Gear from "./Gear";

/**
 * BackgroundGears - Intricate animated cogwheel system for landing page background
 * Features:
 * - Multiple interconnected gears with proper gear ratios
 * - Continuous rotation with scroll-based speed modulation
 * - Parallax effect with depth layers
 * - Smooth anime.js animations
 * - Fixed background positioning
 */
export default function BackgroundGears({ color = "#FFC96C", opacity = 0.18 }) {
  const containerRef = useRef(null);
  const gearsRef = useRef([]);
  const scrollProgressRef = useRef(0);
  const animationRef = useRef(null);

  // Define gear configuration with positions, sizes, and relationships
  const gearConfig = [
    // Top left cluster
    { id: 0, teeth: 24, radius: 80, x: 10, y: 15, speed: 1, direction: 1, layer: 1 },
    { id: 1, teeth: 16, radius: 55, x: 22, y: 18, speed: 1.5, direction: -1, layer: 2 },
    { id: 2, teeth: 12, radius: 40, x: 15, y: 30, speed: 2, direction: 1, layer: 3 },
    
    // Top right cluster
    { id: 3, teeth: 20, radius: 70, x: 85, y: 10, speed: 1.2, direction: -1, layer: 1 },
    { id: 4, teeth: 14, radius: 48, x: 78, y: 22, speed: 1.7, direction: 1, layer: 2 },
    { id: 5, teeth: 10, radius: 35, x: 92, y: 20, speed: 2.4, direction: -1, layer: 3 },
    
    // Middle left
    { id: 6, teeth: 18, radius: 62, x: 8, y: 50, speed: 1.3, direction: 1, layer: 2 },
    { id: 7, teeth: 22, radius: 75, x: 20, y: 55, speed: 1.1, direction: -1, layer: 1 },
    
    // Middle center (large focal gear)
    { id: 8, teeth: 32, radius: 100, x: 50, y: 50, speed: 0.8, direction: 1, layer: 1 },
    { id: 9, teeth: 14, radius: 48, x: 45, y: 38, speed: 1.8, direction: -1, layer: 3 },
    { id: 10, teeth: 12, radius: 40, x: 58, y: 42, speed: 2, direction: 1, layer: 2 },
    
    // Middle right
    { id: 11, teeth: 16, radius: 55, x: 82, y: 48, speed: 1.5, direction: -1, layer: 2 },
    { id: 12, teeth: 20, radius: 68, x: 90, y: 58, speed: 1.2, direction: 1, layer: 1 },
    
    // Bottom left cluster
    { id: 13, teeth: 14, radius: 48, x: 12, y: 78, speed: 1.7, direction: 1, layer: 2 },
    { id: 14, teeth: 18, radius: 62, x: 24, y: 82, speed: 1.3, direction: -1, layer: 1 },
    { id: 15, teeth: 10, radius: 35, x: 18, y: 92, speed: 2.4, direction: 1, layer: 3 },
    
    // Bottom right cluster
    { id: 16, teeth: 22, radius: 75, x: 75, y: 80, speed: 1.1, direction: -1, layer: 1 },
    { id: 17, teeth: 16, radius: 55, x: 88, y: 85, speed: 1.5, direction: 1, layer: 2 },
    { id: 18, teeth: 12, radius: 40, x: 82, y: 95, speed: 2, direction: -1, layer: 3 },
    
    // Bottom center
    { id: 19, teeth: 18, radius: 62, x: 48, y: 88, speed: 1.3, direction: 1, layer: 2 },
    { id: 20, teeth: 14, radius: 48, x: 60, y: 90, speed: 1.7, direction: -1, layer: 3 },
  ];

  useEffect(() => {
    if (!containerRef.current) {return;}

    // Initialize gear refs
    gearsRef.current = gearConfig.map(() => ({ rotation: 0 }));

    // Continuous rotation animation using requestAnimationFrame
    const animateGears = () => {
      const baseSpeed = 0.5; // Base rotation speed (increased for more visible movement)
      const scrollMultiplier = 1 + scrollProgressRef.current * 3; // Speed up with scroll (increased multiplier)

      gearConfig.forEach((gear, index) => {
        const gearRef = gearsRef.current[index];
        if (!gearRef) {return;}

        // Calculate rotation based on speed, direction, and scroll
        gearRef.rotation += baseSpeed * gear.speed * gear.direction * scrollMultiplier;

        // Apply rotation directly to the element
        const element = containerRef.current?.querySelector(`[data-gear-id="${gear.id}"]`);
        if (element) {
          element.style.transform = `translate(-50%, -50%) rotate(${gearRef.rotation}deg)`;
        }
      });

      animationRef.current = requestAnimationFrame(animateGears);
    };

    // Start animation loop
    animationRef.current = requestAnimationFrame(animateGears);

    // Scroll handler for speed modulation and parallax
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = Math.min(scrollY / Math.max(maxScroll, 1), 1);

      // Apply parallax effect to container
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        opacity: opacity,
      }}
      aria-hidden="true"
    >
      {gearConfig.map((gear) => (
        <div
          key={gear.id}
          data-gear-id={gear.id}
          className="absolute"
          style={{
            left: `${gear.x}%`,
            top: `${gear.y}%`,
            transform: "translate(-50%, -50%)",
            opacity: gear.layer === 1 ? 1 : gear.layer === 2 ? 0.7 : 0.5,
            filter: `blur(${gear.layer === 3 ? 1 : 0}px)`,
          }}
        >
          <Gear
            teeth={gear.teeth}
            radius={gear.radius}
            color={color}
            toothWidth={Math.max(4, gear.radius / 8)}
            toothHeight={Math.max(8, gear.radius / 5)}
            hubRadius={Math.max(12, gear.radius / 4)}
          />
        </div>
      ))}
    </div>
  );
}
