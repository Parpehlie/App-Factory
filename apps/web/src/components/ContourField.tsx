import { useEffect, useRef } from 'react';

// Champ de courbes de niveau : bruit de Perlin + marching squares.
// Le curseur soulève une colline, une courbe sur cinq est « maîtresse ».

const P: number[] = (() => {
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = 7;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    const tmp = p[i] ?? 0;
    p[i] = p[j] ?? 0;
    p[j] = tmp;
  }
  return [...p, ...p];
})();

const pAt = (idx: number): number => P[idx & 511] ?? 0;

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const grad = (h: number, x: number, y: number) => {
  const g = h & 3;
  return (g & 1 ? -x : x) + (g & 2 ? -y : y);
};

function perlin(x: number, y: number) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  const u = fade(x);
  const v = fade(y);
  const a = pAt(X) + Y;
  const b = pAt(X + 1) + Y;
  const l1 = grad(pAt(a), x, y) + u * (grad(pAt(b), x - 1, y) - grad(pAt(a), x, y));
  const l2 =
    grad(pAt(a + 1), x, y - 1) +
    u * (grad(pAt(b + 1), x - 1, y - 1) - grad(pAt(a + 1), x, y - 1));
  return l1 + v * (l2 - l1);
}

type Props = {
  color?: string;
  levels?: number;
  cell?: number;
  scale?: number;
  className?: string;
  interactive?: boolean;
};

type Point2 = [number, number];

export function ContourField({
  color = '255,255,255',
  levels = 16,
  cell = 13,
  scale = 0.0022,
  className,
  interactive = true,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let field = new Float32Array(0);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, k: 0, tk: 0 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      field = new Float32Array(cols * rows);
    };

    const sample = (t: number) => {
      const sigma = Math.max(w, h) * 0.09;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * cell;
          const y = j * cell;
          let v =
            perlin(x * scale + t * 0.05, y * scale - t * 0.03) +
            0.45 * perlin(x * scale * 2.3 - t * 0.04, y * scale * 2.3 + 11.7);
          if (mouse.k > 0.001) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            v += 0.55 * mouse.k * Math.exp(-(dx * dx + dy * dy) / (sigma * sigma));
          }
          field[j * cols + i] = v;
        }
      }
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineJoin = 'round';
      const lo = -0.75;
      const hi = 0.95;
      for (let l = 0; l < levels; l++) {
        const L = lo + ((hi - lo) * (l + 0.5)) / levels;
        const major = l % 5 === 2;
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          const y0 = j * cell;
          const y1 = y0 + cell;
          for (let i = 0; i < cols - 1; i++) {
            const a = field[j * cols + i] ?? 0;
            const b = field[j * cols + i + 1] ?? 0;
            const c = field[(j + 1) * cols + i + 1] ?? 0;
            const d = field[(j + 1) * cols + i] ?? 0;
            const idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const x0 = i * cell;
            const x1 = x0 + cell;
            const top = (): Point2 => [x0 + ((L - a) / (b - a)) * cell, y0];
            const right = (): Point2 => [x1, y0 + ((L - b) / (c - b)) * cell];
            const bottom = (): Point2 => [x0 + ((L - d) / (c - d)) * cell, y1];
            const left = (): Point2 => [x0, y0 + ((L - a) / (d - a)) * cell];
            const seg = (p: Point2, q: Point2) => {
              ctx.moveTo(p[0], p[1]);
              ctx.lineTo(q[0], q[1]);
            };
            switch (idx) {
              case 1:
              case 14:
                seg(left(), bottom());
                break;
              case 2:
              case 13:
                seg(bottom(), right());
                break;
              case 3:
              case 12:
                seg(left(), right());
                break;
              case 4:
              case 11:
                seg(top(), right());
                break;
              case 6:
              case 9:
                seg(top(), bottom());
                break;
              case 7:
              case 8:
                seg(top(), left());
                break;
              case 5:
                seg(top(), right());
                seg(left(), bottom());
                break;
              case 10:
                seg(top(), left());
                seg(bottom(), right());
                break;
            }
          }
        }
        ctx.strokeStyle = `rgba(${color},${major ? 0.56 : 0.24})`;
        ctx.lineWidth = major ? 1.4 : 0.8;
        ctx.stroke();
      }
    };

    let raf = 0;
    let last = 0;
    let visible = true;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 33) return;
      last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      mouse.k += (mouse.tk - mouse.k) * 0.05;
      sample((now - start) / 1000);
      draw();
    };

    resize();
    sample(0);
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      sample((performance.now() - start) / 1000);
      draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver((entries) => {
      if (entries[0]) visible = entries[0].isIntersecting;
    });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      if (mouse.k < 0.01) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
      mouse.tk = 1;
    };
    const onLeave = () => {
      mouse.tk = 0;
    };

    if (!reduce) {
      raf = requestAnimationFrame(loop);
      if (interactive) {
        window.addEventListener('pointermove', onMove);
        document.addEventListener('pointerleave', onLeave);
      }
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [color, levels, cell, scale, interactive]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
