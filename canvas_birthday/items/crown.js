function drawCrown(ctx, x, y, size, hue) {
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

  const thickness = size * 0.2;
  const radius = size * 0.5;

  draw.circle(ctx, x, y, radius, {
    strokeStyle: color.light(hue),
    lineWidth: thickness,
    outline: "inside",
  });

  const length = Math.PI * 2 * radius;
  const dashLength = length / 30;

  ctx.setLineDash([dashLength, dashLength]);

  draw.circle(ctx, x, y, radius, {
    strokeStyle: color.dark(hue),
    lineWidth: thickness,
    outline: "inside",
  });

  ctx.setLineDash([]);

  const bow = {
    x,
    y: top + thickness,
    size: radius,
  };

  drawBow(ctx, bow.x, bow.y, bow.size, color.reverse(hue));
}
