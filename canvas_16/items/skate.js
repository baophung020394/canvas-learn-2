function drawSkate(ctx, x, y, size, hue) {
  console.log("x:", x, "y:", y, "size:", size, "hue:", hue);
  document.getElementById(
    "content"
  ).innerText = `x: ${x} y: ${y} size: ${size} hue: ${hue}`;
  //   x: 100 y: 100 size: 120 hue: 136.83619597859436
  const top = y - size / 2;
  const left = x - size / 2;
  const bottom = y + size / 2;
  const right = x + size / 2;
  //   ctx.strokeRect(top, left, size, size);

  const sledge = {
    x,
    bottom: y + size * 0.3,
    size: size * 0.9,
  };

  drawSledge(ctx, sledge.x, sledge.bottom, sledge.size, hue);

  const sock = {
    x: x - size * 0.25,
    y: y + size * 0.05,
    size: size * 1.1,
  };

  drawSock(ctx, sock.x, sock.y, sock.size, color.reverse(hue), 0);
}
