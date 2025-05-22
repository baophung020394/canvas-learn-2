const ctx = myCanvas.getContext("2d");

let radius = 50;

myCanvas.addEventListener("wheel", (e) => {
  radius -= Math.sign(e.deltaY) * 10;
  radius = Math.max(10, radius);
  showIntent(e.clientX, e.clientY, radius);
});

myCanvas.addEventListener("pointerdown", (e) => {
  ctx.fillStyle = "#05f";
  if (e.button == 0) {
    ctx.globalCompositeOperation = "source-over";
  } else {
    ctx.globalCompositeOperation = "destination-out";
  }
  ctx.beginPath();
  ctx.arc(e.offsetX, e.offsetY, radius, 0, Math.PI * 2);
  ctx.fill();
});

myCanvas.addEventListener("pointermove", (e) => {
  showIntent(e.clientX, e.clientY, radius);
});

myCanvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

function showIntent(x, y, radius) {
  circle.style.left = x - radius + "px";
  circle.style.top = y - radius + "px";
  circle.style.width = radius * 2 + "px";
  circle.style.height = radius * 2 + "px";
}
