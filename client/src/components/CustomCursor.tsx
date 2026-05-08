import { useEffect, useState } from 'react';
import { MousePointer2 } from 'lucide-react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.closest('.cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="fixed top-0 left-0 z-[9999] pointer-events-none transition-all duration-150 ease-out text-paper-ink"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px) ${isHovering ? 'scale(1.5)' : 'scale(1)'}`,
        }}
      >
        <div className="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
          <MousePointer2 
            size={18} 
            fill={isHovering ? "none" : "currentColor"} 
            strokeWidth={isHovering ? 2.5 : 2}
          />
        </div>
      </div>
      <style>{`
        * {
          cursor: none !important;
        }
        button, a, [role="button"], .cursor-pointer {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
