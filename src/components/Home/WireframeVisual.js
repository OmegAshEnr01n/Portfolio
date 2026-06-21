import React, { useEffect, useRef } from "react";

/*
 * A pure-canvas, dependency-free 3D wireframe object.
 * It rotates continuously, reacts to scroll progress (rotation + "breathing"
 * explode factor + hue drift), and leans slightly toward the cursor.
 * Two nested icosahedra counter-rotate, wrapped in a slow particle field.
 */

const PHI = (1 + Math.sqrt(5)) / 2;

// 12 vertices of an icosahedron.
const ICO_VERTS = [
  [0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI],
  [1, PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, 1], [-PHI, 0, -1],
];

// Normalise to unit radius and derive edges (vertices an edge-length apart).
function buildIco() {
  const r = Math.hypot(0, 1, PHI);
  const verts = ICO_VERTS.map(([x, y, z]) => [x / r, y / r, z / r]);
  const edgeLen = 2 / r;
  const edges = [];
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const d = Math.hypot(
        verts[i][0] - verts[j][0],
        verts[i][1] - verts[j][1],
        verts[i][2] - verts[j][2]
      );
      if (Math.abs(d - edgeLen) < 1e-4) edges.push([i, j]);
    }
  }
  return { verts, edges };
}

const ICO = buildIco();

function rotate([x, y, z], rx, ry, rz) {
  // X
  let cy1 = Math.cos(rx), sy1 = Math.sin(rx);
  let y1 = y * cy1 - z * sy1;
  let z1 = y * sy1 + z * cy1;
  // Y
  let cy2 = Math.cos(ry), sy2 = Math.sin(ry);
  let x2 = x * cy2 + z1 * sy2;
  let z2 = -x * sy2 + z1 * cy2;
  // Z
  let cy3 = Math.cos(rz), sy3 = Math.sin(rz);
  let x3 = x2 * cy3 - y1 * sy3;
  let y3 = x2 * sy3 + y1 * cy3;
  return [x3, y3, z2];
}

function WireframeVisual() {
  const canvasRef = useRef(null);
  const scrollRef = useRef(0);
  const targetMouse = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onMove = (e) => {
      targetMouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    // Slowly drifting background particles for depth.
    const particles = Array.from({ length: 46 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      s: Math.random() * 1.4 + 0.3,
    }));

    const draw = (verts, edges, cx, cy, radius, rot, explode, color, lineWidth) => {
      const fov = 3.2;
      const projected = verts.map((v) => {
        const e = 1 + explode;
        const p = rotate([v[0] * e, v[1] * e, v[2] * e], rot.x, rot.y, rot.z);
        const scale = fov / (fov + p[2]);
        return {
          x: cx + p[0] * radius * scale,
          y: cy + p[1] * radius * scale,
          z: p[2],
          scale,
        };
      });

      // Edges, depth-faded.
      edges.forEach(([a, b]) => {
        const pa = projected[a];
        const pb = projected[b];
        const depth = (pa.z + pb.z) / 2; // ~ -1 (near) .. 1 (far)
        const alpha = Math.max(0.06, 0.85 - (depth + 1) * 0.4);
        ctx.strokeStyle = `rgba(${color},${alpha})`;
        ctx.lineWidth = lineWidth * ((pa.scale + pb.scale) / 2);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      });

      // Vertex nodes.
      projected.forEach((p) => {
        const alpha = Math.max(0.12, 0.95 - (p.z + 1) * 0.42);
        const r = 1.9 * p.scale;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    let t = 0;
    const render = () => {
      t += 0.0045;
      // ease mouse
      mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.05;
      mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.05;

      const s = scrollRef.current;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.32;

      // Particles
      particles.forEach((p) => {
        p.y -= 0.0006 + p.z * 0.0006;
        if (p.y < 0) p.y = 1;
        const px = p.x * w;
        const py = ((p.y + t * 0.02) % 1) * h;
        ctx.beginPath();
        ctx.fillStyle = `rgba(150,170,255,${0.05 + p.z * 0.12})`;
        ctx.arc(px, py, p.s, 0, Math.PI * 2);
        ctx.fill();
      });

      // Breathing driven by scroll + gentle idle pulse.
      const breathe = Math.sin(s * Math.PI * 2) * 0.22 + Math.sin(t) * 0.04;

      const baseRot = {
        x: 0.5 + s * Math.PI * 1.6 + mouse.current.y * 0.4,
        y: t + s * Math.PI * 2.4 + mouse.current.x * 0.5,
        z: s * 0.6,
      };

      // Glow pass.
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Outer icosahedron — cool violet, hue drifts with scroll.
      const hue = 168 + s * 90; // teal -> violet
      const c1 = hslToRgbStr(hue, 70, 70);
      draw(ICO.verts, ICO.edges, cx, cy, radius, baseRot, Math.max(0, breathe), c1, 1.2);

      // Inner icosahedron — counter-rotating, smaller, warmer accent.
      const innerRot = {
        x: -baseRot.x * 0.7,
        y: -baseRot.y * 0.55,
        z: -baseRot.z,
      };
      const c2 = hslToRgbStr(hue + 40, 80, 72);
      draw(ICO.verts, ICO.edges, cx, cy, radius * 0.52, innerRot, Math.max(0, -breathe) * 0.6, c2, 1);

      ctx.restore();

      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="rd-visual-canvas" aria-hidden="true" />;
}

function hslToRgbStr(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return `${Math.round((r + m) * 255)},${Math.round((g + m) * 255)},${Math.round((b + m) * 255)}`;
}

export default WireframeVisual;
