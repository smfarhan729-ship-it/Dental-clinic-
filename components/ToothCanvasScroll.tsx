'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RotateCw, Compass, Eye, ShieldCheck, Sparkles, Layers } from 'lucide-react';

// Register GSAP ScrollTrigger plugin on client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 299;

// Formats frame number to 3-digit zero-padded string: 1 -> "001"
const getFramePath = (index: number) => {
  const padded = String(Math.max(1, Math.min(TOTAL_FRAMES, index + 1))).padStart(3, '0');
  return `/tooth-frames/ezgif-frame-${padded}.jpg`;
};

interface ToothCanvasScrollProps {
  onFrameChange?: (frameIndex: number) => void;
}

export default function ToothCanvasScroll({ onFrameChange }: ToothCanvasScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const animPropsRef = useRef({
    frame: 0,
    xPercent: 0,
    yPercent: 0,
    scale: 1.15,
    opacity: 1,
    glow: 1,
  });

  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isInteractiveMode, setIsInteractiveMode] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartFrameRef = useRef<number>(0);
  const [manualFrame, setManualFrame] = useState<number>(0);

  // High performance draw function
  const renderFrame = useCallback((frameIndex: number, animOverride?: typeof animPropsRef.current) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
    const img = imagesRef.current[clampedIndex];

    // If target frame hasn't loaded yet, try to find nearest loaded frame
    let targetImg = img;
    if (!targetImg || !targetImg.complete) {
      for (let offset = 1; offset < 20; offset++) {
        const lower = imagesRef.current[clampedIndex - offset];
        if (lower && lower.complete) {
          targetImg = lower;
          break;
        }
        const higher = imagesRef.current[clampedIndex + offset];
        if (higher && higher.complete) {
          targetImg = higher;
          break;
        }
      }
    }

    if (!targetImg || !targetImg.complete || targetImg.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasW = canvas.width / dpr;
    const canvasH = canvas.height / dpr;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scaling & translation based on GSAP scroll progress
    const anim = animOverride || animPropsRef.current;
    
    // Scale image to fit nicely within viewport while preserving 16:9 aspect ratio
    const imgAspect = targetImg.naturalWidth / targetImg.naturalHeight; // 1920 / 1080 = 1.777
    let renderW = canvasW * 0.85 * anim.scale;
    let renderH = renderW / imgAspect;

    if (renderH > canvasH * 0.85 * anim.scale) {
      renderH = canvasH * 0.85 * anim.scale;
      renderW = renderH * imgAspect;
    }

    // Responsive position calculation
    const offsetX = (canvasW - renderW) / 2 + (anim.xPercent / 100) * canvasW;
    const offsetY = (canvasH - renderH) / 2 + (anim.yPercent / 100) * canvasH;

    // Draw the high-resolution tooth frame directly without competing halo/background layers
    ctx.globalAlpha = anim.opacity;
    ctx.drawImage(targetImg, offsetX, offsetY, renderW, renderH);

    ctx.restore();
    currentFrameRef.current = clampedIndex;
  }, []);

  // Preload frames in chunks
  useEffect(() => {
    let isCancelled = false;
    const images: HTMLImageElement[] = [];

    // Preload first 30 frames immediately for instant responsiveness
    let loaded = 0;
    const updateProgress = () => {
      loaded++;
      if (!isCancelled) {
        setLoadedCount(loaded);
        if (loaded === 1) {
          // Render frame 0 immediately
          renderFrame(0);
        }
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = updateProgress;
      img.onerror = () => {
        // Soft fallback
        loaded++;
        if (!isCancelled) setLoadedCount(loaded);
      };
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      isCancelled = true;
    };
  }, [renderFrame]);

  // Resize canvas handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      renderFrame(currentFrameRef.current);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 100);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [renderFrame]);

  // GSAP ScrollTrigger Timeline
  useEffect(() => {
    if (isInteractiveMode) return; // Allow manual 360 exploration if active

    const ctx = gsap.context(() => {
      // Main scroll timeline that synchronizes tooth rotation and spatial descent across page
      const anim = animPropsRef.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6, // Buttery smooth easing on scrub
          onUpdate: (self) => {
            // Map scroll progress (0 to 1) directly to frame sequence (0 to 298)
            const targetFrame = Math.round(self.progress * (TOTAL_FRAMES - 1));
            anim.frame = targetFrame;
            renderFrame(targetFrame);
            if (onFrameChange) onFrameChange(targetFrame);
          },
        },
      });

      // Spatial path coordinates as user scrolls past sections:
      // Stage 1: Opening & Hero Unfolding (Center, prominent floating position)
      tl.to(anim, {
        xPercent: 0,
        yPercent: 0,
        scale: window.innerWidth > 1024 ? 1.15 : 0.95,
        duration: 0.22,
        ease: 'none',
      })
      // Stage 2: Descending into Doctor Section (Glides rightward, leaves room for doctor cards)
      .to(anim, {
        xPercent: window.innerWidth > 1024 ? 28 : 0,
        yPercent: window.innerWidth > 1024 ? 4 : 10,
        scale: window.innerWidth > 1024 ? 0.8 : 0.65,
        duration: 0.35,
        ease: 'power1.inOut',
      })
      // Stage 3: Moving into Before/After Section (Shifts to left side with slight upward tilt)
      .to(anim, {
        xPercent: window.innerWidth > 1024 ? -26 : 0,
        yPercent: window.innerWidth > 1024 ? -6 : -8,
        scale: window.innerWidth > 1024 ? 0.75 : 0.6,
        duration: 0.35,
        ease: 'power1.inOut',
      })
      // Stage 4: Centering as architectural backdrop near Booking & Patient Vault
      .to(anim, {
        xPercent: 0,
        yPercent: 0,
        scale: window.innerWidth > 1024 ? 0.9 : 0.7,
        duration: 0.2,
        ease: 'power1.out',
      });
    });

    return () => ctx.revert();
  }, [isInteractiveMode, renderFrame, onFrameChange]);

  // Mouse drag handler for manual 360 exploration
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isInteractiveMode) return;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartFrameRef.current = manualFrame;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isInteractiveMode) return;
    const deltaX = e.clientX - dragStartXRef.current;
    // Map pixels to frames: ~3px per frame
    const frameDelta = Math.round(deltaX / 3);
    let newFrame = (dragStartFrameRef.current + frameDelta) % TOTAL_FRAMES;
    if (newFrame < 0) newFrame += TOTAL_FRAMES;
    setManualFrame(newFrame);
    renderFrame(newFrame);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isInteractiveMode || e.touches.length === 0) return;
    setIsDragging(true);
    dragStartXRef.current = e.touches[0].clientX;
    dragStartFrameRef.current = manualFrame;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isInteractiveMode || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - dragStartXRef.current;
    const frameDelta = Math.round(deltaX / 2.5);
    let newFrame = (dragStartFrameRef.current + frameDelta) % TOTAL_FRAMES;
    if (newFrame < 0) newFrame += TOTAL_FRAMES;
    setManualFrame(newFrame);
    renderFrame(newFrame);
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-10 overflow-hidden ${
        isInteractiveMode ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : ''
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Floating Interactive 360 Controller pill (bottom right) - Only appears after scrolling starts */}
      <div
        className={`absolute bottom-6 right-6 z-40 transition-all duration-700 ease-out ${
          hasScrolled
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-xl p-1.5 shadow-2xl flex items-center gap-1.5 text-xs text-slate-300">
          <button
            onClick={() => {
              const nextMode = !isInteractiveMode;
              setIsInteractiveMode(nextMode);
              if (nextMode) {
                setManualFrame(currentFrameRef.current);
              } else {
                ScrollTrigger.refresh();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
              isInteractiveMode
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isInteractiveMode ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{isInteractiveMode ? '360° Drag Active' : 'Free 360° Spin'}</span>
          </button>

          {isInteractiveMode && (
            <div className="flex items-center gap-2 px-2 text-[11px] font-mono text-cyan-400/90 border-l border-white/10">
              <Compass className="w-3.5 h-3.5" />
              <span>{Math.round((manualFrame / TOTAL_FRAMES) * 360)}°</span>
            </div>
          )}
        </div>
      </div>

      {/* Preload status subtle indicator (fades out after initial load) */}
      {loadedCount < 30 && (
        <div className="absolute top-24 right-6 pointer-events-none bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[11px] font-mono text-cyan-400 flex items-center gap-2 animate-pulse">
          <Sparkles className="w-3 h-3" />
          <span>Calibrating 3D Enamel Model... {Math.round((loadedCount / 30) * 100)}%</span>
        </div>
      )}
    </div>
  );
}
