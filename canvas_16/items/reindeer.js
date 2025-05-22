function drawReindeer(ctx, x, y, size, hue) {
  //   console.log("x:", x, "y:", y, "size:", size, "hue:", hue);
  //   document.getElementById(
  //     "content"
  //   ).innerText = `x: ${x} y: ${y} size: ${size} hue: ${hue}`;
  //   x: 100 y: 100 size: 120 hue: 136.83619597859436
  const top = y - size / 2;
  const left = x - size / 2;
  const bottom = y + size / 2;
  const right = x + size / 2;
  // ctx.strokeRect(top, left, size, size);

  drawSnowFlake(ctx, x, y - size * 0.05, size, hue, [0, 0, 0, 0, 1, 1]);

  const headRadius = size * 0.2;

  draw.circle(ctx, x, y, headRadius, {
    fillStyle: color.dark(hue),
  });

  const eye = {
    radius: size * 0.05,
    xOffset: size * 0.1,
  };

  draw.circle(ctx, x - eye.xOffset, y, eye.radius, {
    fillStyle: color.darkest(hue),
  });

  draw.circle(ctx, x + eye.xOffset, y, eye.radius, {
    fillStyle: color.darkest(hue),
  });

  const snout = {
    x,
    y: y + size * 0.25,
    xRadius: size * 0.3,
    yRadius: size * 0.25,
  };

  draw.ellipse(ctx, snout.x, snout.y, snout.xRadius, snout.yRadius, {
    fillStyle: color.lightest(hue),
  });

  draw.circle(ctx, x, y + size * 0.2, size * 0.1, {
    fillStyle: "red",
  });
}
