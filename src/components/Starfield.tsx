"use client";

import { useEffect, useRef } from "react";

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 180 }, () => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      r:    Math.random() * 1.4 + 0.3,
      op:   Math.random(),
      spd:  Math.random() * 0.008 + 0.003,
      dir:  Math.random() > 0.5 ? 1 : -1,
      gold: Math.random() < 0.15,
    }));

    const shooters: { x: number; y: number; len: number; spd: number; angle: number; life: number; decay: number }[] = [];
    const shooterInterval = setInterval(() => {
      shooters.push({
        x:     Math.random() * canvas.width * 0.8,
        y:     Math.random() * canvas.height * 0.4,
        len:   Math.random() * 80 + 40,
        spd:   Math.random() * 6 + 4,
        angle: Math.PI / 5,
        life:  1,
        decay: Math.random() * 0.015 + 0.012,
      });
    }, 4500);

    let rafId: number;

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        s.op += s.spd * s.dir;
        if (s.op >= 1) { s.op = 1; s.dir = -1; }
        if (s.op <= 0) { s.op = 0; s.dir =  1; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? `rgba(245,200,66,${s.op * 0.9})`
          : `rgba(240,238,233,${s.op * 0.6})`;
        ctx.fill();
      });

      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i];
        ctx.save();
        ctx.globalAlpha = sh.life * 0.7;
        ctx.strokeStyle = "rgba(245,200,66,0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - Math.cos(sh.angle) * sh.len, sh.y - Math.sin(sh.angle) * sh.len);
        ctx.stroke();
        ctx.restore();
        sh.x    += Math.cos(sh.angle) * sh.spd;
        sh.y    += Math.sin(sh.angle) * sh.spd;
        sh.life -= sh.decay;
        if (sh.life <= 0) shooters.splice(i, 1);
      }

      rafId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(shooterInterval);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: "var(--bg-base)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
