function drawTree(ctx, x, y, size, hue) {
  const top = y - size / 2;
  const bottom = y + size / 2;

  const trunkWidth = size * 0.1;
  ctx.lineWidth = trunkWidth;
  ctx.strokeStyle = color.darkest(hue);
  draw.line(ctx, x, bottom, x, y);

  const levels = [];

  const peakOffset = size * 0.345; //

  const levelConfigs = [
    { bottom: bottom - size * 0.2, topOffset: size * 0.3, width: size * 0.8 }, // tầng dưới
    { bottom: bottom - size * 0.4, topOffset: size * 0.3, width: size * 0.6 }, // tầng giữa
    {
      bottom: bottom - size * 0.6,
      topOffset: peakOffset,
      width: size * 0.4,
    }, // tầng trên
  ];

  for (const config of levelConfigs) {
    const block = {
      bottom: config.bottom,
      top: config.bottom - config.topOffset,
      width: config.width,
      get left() {
        return x - this.width / 2;
      },
      get right() {
        return x + this.width / 2;
      },
      color: color.normal(hue),
    };

    ctx.fillStyle = block.color;
    ctx.beginPath();
    ctx.moveTo(block.left, block.bottom);
    ctx.lineTo(block.right, block.bottom);
    ctx.lineTo(x, block.top);
    ctx.fill();

    // Clone block để tránh ghi đè
    levels.push({
      top: block.top,
      bottom: block.bottom,
      left: block.left,
      right: block.right,
      width: block.width,
      color: block.color,
    });
  }

  return levels; // ✅ Trả về danh sách 3 tầng
}
