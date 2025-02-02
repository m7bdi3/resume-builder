'use client'
import { useEffect, useRef, useCallback, useState } from "react";
import PropTypes from 'prop-types';

class Pixel {
  static getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  constructor(canvas, context, x, y, color, speed, delay) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = Pixel.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = Pixel.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  draw() {
    const centerOffset = (this.maxSizeInteger - this.size) / 2;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size
    );
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    this.isShimmer ? this.shimmer() : this.size += this.sizeStep;
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    this.size > 0 ? this.size -= 0.1 : this.isIdle = true;
    this.draw();
  }

  shimmer() {
    this.size >= this.maxSize 
      ? (this.isReverse = true) 
      : this.size <= this.minSize && (this.isReverse = false);
    
    this.size += this.isReverse ? -this.speed : this.speed;
  }
}

function getEffectiveSpeed(value, reducedMotion) {
  const min = 0;
  const max = 100;
  const throttle = 0.001;
  const parsed = Number(value);

  if (isNaN(parsed) || parsed <= min || reducedMotion) return min;
  return parsed >= max ? max * throttle : parsed * throttle;
}

export default function PixelCard({
  children,
  gap = 6,
  speed = 80,
  colors = "#fecdd3,#fda4af,#e11d48",
  noFocus = true,
  className = ""
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const animationRef = useRef(null);
  const timePreviousRef = useRef(performance.now());
  const [reducedMotion, setReducedMotion] = useState(() => 
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const initPixels = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);
    
    if (width <= 0 || height <= 0) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = width;
    canvasRef.current.height = height;
    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;

    const colorsArray = colors.split(",").filter(c => c.trim() !== "");
    if (colorsArray.length === 0) colorsArray.push("#fecdd3");
    
    const gapInt = Math.max(1, Math.floor(gap));
    const pixels = [];

    for (let x = 0; x < width; x += gapInt) {
      for (let y = 0; y < height; y += gapInt) {
        const dx = x - width / 2;
        const dy = y - height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delay = reducedMotion ? 0 : distance;

        pixels.push(new Pixel(
          canvasRef.current,
          ctx,
          x,
          y,
          colorsArray[Math.floor(Math.random() * colorsArray.length)],
          getEffectiveSpeed(speed, reducedMotion),
          delay
        ));
      }
    }
    pixelsRef.current = pixels;
  }, [gap, speed, colors, reducedMotion]);

  const doAnimate = useCallback((fnName) => {
    animationRef.current = requestAnimationFrame(() => doAnimate(fnName));
    
    const timeNow = performance.now();
    const timePassed = timeNow - timePreviousRef.current;
    const timeInterval = 1000 / 60;

    if (timePassed < timeInterval) return;
    timePreviousRef.current = timeNow - (timePassed % timeInterval);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    let allIdle = true;
    const pixels = pixelsRef.current;
    
    for (let i = 0; i < pixels.length; i++) {
      pixels[i][fnName]();
      if (!pixels[i].isIdle) allIdle = false;
    }

    if (allIdle) cancelAnimationFrame(animationRef.current);
  }, []);

  const handleAnimation = useCallback((fnName) => {
    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => doAnimate(fnName));
  }, [doAnimate]);

  const onMouseEnter = useCallback(() => handleAnimation("appear"), [handleAnimation]);
  const onMouseLeave = useCallback(() => handleAnimation("disappear"), [handleAnimation]);
  
  const onFocus = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) handleAnimation("appear");
  }, [handleAnimation]);

  const onBlur = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) handleAnimation("disappear");
  }, [handleAnimation]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionHandler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", motionHandler);
    return () => mediaQuery.removeEventListener("change", motionHandler);
  }, []);

  useEffect(() => {
    initPixels();
    const observer = new ResizeObserver(() => requestAnimationFrame(initPixels));
    if (containerRef.current) observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [initPixels]);

  return (
    <div
      ref={containerRef}
      className={`h-screen w-full relative overflow-hidden grid place-items-center aspect-[4/5] border border-[#27272a] rounded-[25px] isolate transition-colors duration-200 ease-[cubic-bezier(0.5,1,0.89,1)] select-none ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={noFocus ? undefined : onFocus}
      onBlur={noFocus ? undefined : onBlur}
      tabIndex={noFocus ? -1 : 0}
      role="figure"
      aria-label="Interactive pixel card"
    >
      <canvas className="w-full h-full block" ref={canvasRef} />
      {children}
    </div>
  );
}

PixelCard.propTypes = {
  children: PropTypes.node,
  gap: PropTypes.number,
  speed: PropTypes.number,
  colors: PropTypes.string,
  noFocus: PropTypes.bool,
  className: PropTypes.string,
};