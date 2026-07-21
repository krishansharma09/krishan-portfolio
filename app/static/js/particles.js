/* ============================================================
   Krishan Sharma — Technical Portfolio
   Vector Space / Embedding Projection Canvas Visualization
   Simulates multi-cluster FAISS vector space with sky blue ambient drift
============================================================ */

(function () {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Palette: Soft Sky Blue (43, 120, 197) and Light Sky Highlight (74, 148, 226)
  const skyRgb  = '43, 120, 197';
  const lightRgb= '74, 148, 226';

  let W, H, nodes = [], animId;
  const NODE_COUNT = 45;
  const CLUSTER_COUNT = 3;
  const MAX_DIST = 140;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class VectorNode {
    constructor(clusterId) {
      this.clusterId = clusterId;
      this.reset(true);
    }

    reset(initial = false) {
      // Create cluster centers in vector space
      const cx = (W / (CLUSTER_COUNT + 1)) * (this.clusterId + 1);
      const cy = H * 0.45;
      
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (Math.min(W, H) * 0.28);

      this.x = initial ? cx + Math.cos(angle) * radius : Math.random() * W;
      this.y = initial ? cy + Math.sin(angle) * radius : Math.random() * H;

      // Slow, precise drift velocity
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;

      this.r = Math.random() * 1.6 + 1.0;
      this.alpha = Math.random() * 0.4 + 0.25;
      this.isPrimarySky = Math.random() > 0.35;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Screen boundary wrap
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.isPrimarySky 
        ? `rgba(${skyRgb}, ${this.alpha})` 
        : `rgba(${lightRgb}, ${this.alpha})`;
      ctx.fill();
    }
  }

  function drawVectorEdges() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.14;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          
          // Connect nodes with thin distance-decay line
          ctx.strokeStyle = `rgba(${skyRgb}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, (_, i) => new VectorNode(i % CLUSTER_COUNT));
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawVectorEdges();
    nodes.forEach(node => {
      node.update();
      node.draw();
    });
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
  }, { passive: true });

  init();
  loop();
})();
