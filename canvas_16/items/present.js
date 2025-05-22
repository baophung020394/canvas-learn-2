function drawPresent(ctx, x, y, size, hue) {
  console.log("x:", x, "y:", y, "size:", size, "hue:", hue);
  //   x: 100 y: 100 size: 120 hue: 136.83619597859436
  const top = y - size / 2;
  const left = x - size / 2;
  const bottom = y + size / 2;
  const right = x + size / 2;
  //   ctx.strokeRect(top, left, size, size);

  const box = {
    height: size * 0.8,
    width: size * 0.9,
    x,
    bottom,
    get top() {
      return this.bottom - this.height;
    },
    color: color.dark(hue),
  };

  //   {
  //     "height": 96,
  //     "width": 108,
  //     "x": 100,
  //     "bottom": 160,
  //     "top": 64,
  //     "color": "hsl(26.501807683894, 100%, 30%)"
  // }

  console.log(box);
  draw.line(ctx, box.x, box.top, box.x, bottom, {
    lineWidth: box.width,
    strokeStyle: box.color,
  });

  const ropeWidth = size * 0.1;
  draw.line(ctx, box.x, box.top, box.x, box.bottom, {
    lineWidth: ropeWidth,
    strokeStyle: color.normal(color.reverse(hue)),
  });

  const liq = {
    height: size * 0.2,
    width: size,
    x,
    top: box.top,
    get bottom() {
      return this.top + this.height;
    },
    color: color.light(hue),
  };

  console.log("liq", liq);
  drawBow(ctx, x, box.top, size * 0.8, color.reverse(hue));

  draw.line(ctx, liq.x, liq.top, liq.x, liq.bottom, {
    lineWidth: 120,
    strokeStyle: liq.color,
  });
}
