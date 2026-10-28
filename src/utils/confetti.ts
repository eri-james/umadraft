/**
 * Lightweight canvas confetti animation for match victory celebrations.
 * Pure DOM Canvas, zero external library issues.
 */

export function fireVictoryConfetti() {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const colors = ['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#ec4899', '#8b5cf6', '#eab308'];
  const confettiCount = 120;
  const particles: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    vx: number;
    vy: number;
    tilt: number;
    tiltAngle: number;
    tiltSpeed: number;
    opacity: number;
  }> = [];

  for (let i = 0; i < confettiCount; i++) {
    particles.push({
      x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 200,
      y: window.innerHeight * 0.5 + (Math.random() - 0.5) * 100,
      w: Math.random() * 10 + 6,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 18,
      vy: Math.random() * -14 - 4,
      tilt: Math.random() * 10 - 10,
      tiltAngle: Math.random() * Math.PI,
      tiltSpeed: Math.random() * 0.08 + 0.04,
      opacity: 1,
    });
  }

  let startTime = performance.now();
  const duration = 4000; // 4 seconds

  function render(now: number) {
    const elapsed = now - startTime;
    if (elapsed > duration) {
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
      return;
    }

    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // Gravity
      p.vx *= 0.98; // Friction
      p.tiltAngle += p.tiltSpeed;
      p.tilt = Math.sin(p.tiltAngle) * 12;

      const fadeProgress = Math.max(0, (elapsed - 2500) / 1500);
      p.opacity = Math.max(0, 1 - fadeProgress);

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.tiltAngle);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
