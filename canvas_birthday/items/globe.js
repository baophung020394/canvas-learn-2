function drawGlobe(ctx, x, y, size, hue) {
  // console.log("x:", x, "y:", y, "size:", size, "hue:", hue);
  //   x: 100 y: 100 size: 120 hue: 136.83619597859436
  const top = y - size / 2;
  const left = x - size / 2;
  const bottom = y + size / 2;
  const right = x + size / 2;
//   ctx.strokeRect(top, left, size, size);

  const ball = {
    radius: size * 0.5,
    x,
    get y() {
      return top + this.radius;
    },
    color: "rgba(255, 255, 255, 0.3)",
  };

  // snow
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0.3, Math.PI - 0.5);
  ctx.fill();

  const tree = {
    size: ball.radius * 1.2,
    x,
    y: ball.y,
    hue: color.reverse(hue),
  };

  drawTree(ctx, tree.x, tree.y, tree.size, tree.hue);

  draw.circle(ctx, ball.x, ball.y, ball.radius, {
    fillStyle: ball.color,
  });

  const base = {
    height: size * 0.15,
    width: size * 0.6,
    get y() {
      return bottom - this.height / 2;
    },
    get left() {
      return x - this.width / 2;
    },
    get right() {
      return x + this.width / 2;
    },
    color: color.dark(hue),
  };

  // document.getElementById("content").innerText = `ball: ${JSON.stringify(
  //   ball
  // )} \n base : ${JSON.stringify(base)}`;

  ctx.beginPath();

  //   ctx.moveTo(64, 148);
  //   ctx.lineTo(136, 148)
  //   ctx.lineWidth = 24;
  //   ctx.lineCap = "round";
  //   ctx.stroke();

  //   ctx.beginPath();
  //   ctx.moveTo(155, 50);
  //   ctx.lineTo(0, 50);
  //   ctx.lineWidth = 24;
  //   ctx.lineCap = "round";
  //   ctx.stroke();

  draw.line(ctx, base.left, base.y, base.right, base.y, {
    lineWidth: base.height,
    strokeStyle: base.color,
    lineCap: "round",
  });
}
