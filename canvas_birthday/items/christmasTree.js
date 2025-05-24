function drawChristmasTree(ctx, x, y, size, hue) {
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

  drawTree(ctx, tree.x, tree.y, tree.size, tree.hue);

  const star = {
    size: size * 0.2,
    x,
    y: tree.top,
    hue: 30,
  };

  drawStar(ctx, star.x, star.y, star.size, star.hue);
  drawStar(ctx, star.x, star.y, star.size / 2, 50);

  const balls = [];
  const ballSize = size * 0.08;
  const tryCount = 1000;

  for (let i = 1; i <= tryCount; i++) {
    const newBall = {
      x: lerp(left, right, Math.random()),
      y: lerp(top, bottom, Math.random()),
    };

    if (balls.some((b) => distance(b, newBall) < ballSize)) {
      continue;
    }

    const ballTop = newBall.y - ballSize / 2;
    const imgData = ctx.getImageData(newBall.x, ballTop, 1, 1);
    if (imgData.data[1] != 255) {
      continue;
    }

    balls.push(newBall);
  }

  balls.forEach((b) => {
    const randomNonGreeHue = lerp(180, 360, Math.random());
    drawBall(ctx, b.x, b.y, ballSize, randomNonGreeHue);
  });

  function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
}
