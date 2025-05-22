const el = document.getElementById("canvas");
const ctx = el.getContext("2d");

const thickness = 10;
let x = 0,
  y = 0,
  w = 200,
  h = 400;

let i = 1;
while (i <= 10) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  
  if (i % 2 == 0) {
    ctx.fillStyle = "red";
  } else {
    ctx.fillStyle = "blue";
  }

  ctx.fill();

  x = x + thickness;
  y = y + thickness;
  w = w - thickness - thickness;
  h = h - thickness - thickness;

  i = i + 1;
}

ctx.stroke();
