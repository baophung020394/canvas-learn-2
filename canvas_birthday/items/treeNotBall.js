window.treeLevels = null;
function drawTreeNotBall(ctx, x, y, size, hue) {
  //   console.log("x:", x, "y:", y, "size:", size, "hue:", hue);
  //   document.getElementById(
  //     "content"
  //   ).innerText = `x: ${x} y: ${y} size: ${size} hue: ${hue}`;
  //   x: 100 y: 100 size: 120 hue: 136.83619597859436
  const top = y - size / 2;
  const left = x - size / 2;
  const bottom = y + size / 2;
  const right = x + size / 2;
  //   ctx.strokeRect(top, left, size, size);

  const tree = {
    size: size * 0.9,
    x,
    get y() {
      return bottom - this.size / 2;
    },
    get top() {
      return bottom - this.size;
    },
    hue: 90,
  };

  // drawTree(ctx, tree.x, tree.y, tree.size, tree.hue);
  const levels = drawTree(ctx, tree.x, tree.y, tree.size, tree.hue);
  window.treeLevels = levels;
  const star = {
    size: size * 0.2,
    x,
    y: tree.top,
    hue: 30,
  };

  drawStarAtTop(ctx, levels[2], 50, star.hue, false);
  drawStarAtTop(ctx, levels[2], 35, 50, true);
  // drawStarAtTop(ctx, levels[2], star.size / 2, 50);
  // drawStar(ctx, star.x, star.y, star.size, star.hue);
  // drawStar(ctx, star.x, star.y, star.size / 2, 50);

  function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
}

function drawStarAtTop(ctx, topBlock, size = 40, hue, position) {
  const x = (topBlock.left + topBlock.right) / 2; // chính giữa đỉnh
  const y = position ? topBlock.top - size * 0.4 : topBlock.top - size * 0.3; // đẩy ngôi sao lên trên một chút

  drawStarShape(ctx, x, y, size, size * 0.5, 5, hue);
}

function drawStarShape(
  ctx,
  cx,
  cy,
  outerRadius,
  innerRadius = outerRadius * 0.5,
  points = 5,
  hue
) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(cx, cy);
  ctx.moveTo(0, -outerRadius);

  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * i) / points;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    ctx.lineTo(Math.sin(angle) * r, -Math.cos(angle) * r);
  }

  ctx.closePath();
  ctx.fillStyle = color.normal(hue);
  ctx.fill();

  ctx.restore();
}
