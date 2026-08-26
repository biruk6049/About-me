import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const followerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Disable on mobile or touch-only devices
    const touchDevice = window.matchMedia('(pointer: coarse)').matches;
    setIsMobile(touchDevice);
    if (touchDevice) return;

    // Show after initial mouse movement
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    // Filter selectors for custom cursor hover enlargement
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive-3d') ||
        target.closest('.interactive-3d')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Animate follower with physics interpolation / easing lag
  useEffect(() => {
    if (isMobile) return;

    const animateFollower = () => {
      setFollowerPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Ease speed factor (0.15 makes it trace cursor smoothly)
        const speed = 0.15;
        return {
          x: prev.x + dx * speed,
          y: prev.y + dy * speed,
        };
      });
      requestRef.current = requestRef.current = requestAnimationFrame(animateFollower);
    };

    requestRef.current = requestAnimationFrame(animateFollower);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [position, isMobile]);

  if (isMobile || !isVisible) return null;

  return (
    <>
      <div
        className="cursor-dot"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          scale: clicked ? 0.7 : 1,
          transition: 'scale 0.1s ease-out',
        }}
      />
      <div
        ref={followerRef}
        className="cursor-follower"
        style={{
          left: `${followerPosition.x}px`,
          top: `${followerPosition.y}px`,
          width: hovered ? '48px' : '28px',
          height: hovered ? '48px' : '28px',
          borderColor: hovered ? '#ffffff' : '#a1a1aa',
          backgroundColor: hovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
          boxShadow: hovered ? '0 0 15px rgba(255, 255, 255, 0.25)' : 'none',
        }}
      />
    </>
  );
}
