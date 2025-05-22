const el = document.getElementById("myCanvas");
const ctx = el.getContext("2d");

const minX = 170;
const rangeX = 60;

let p = 0;

const bow = new Image();
bow.src = "bow.jpg";

const song = new Audio("song.mp3");

document.addEventListener("keydown", function (info) {
  if (info.code == "Space") {
    if (song.paused) {
      song.play();
    } else {
      song.pause();
    }
  }
});

el.addEventListener("mousemove", function (info) {
  p = info.offsetX / el.width;
});

animate();

function animate() {
  ctx.clearRect(0, 0, el.width, el.height);
  drawSnowman(200, 640, 160, 0.7);

  // drawing the dynamic eyes
  const x = minX + rangeX * p;

  ctx.beginPath();
  ctx.arc(x - 25, 170, 15, 0, Math.PI * 2);
  ctx.arc(x + 25, 170, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.drawImage(bow, 150, 225, 100, 60);

  ctx.font = "40px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Merry", 200, 310);
  ctx.fillText("Christmas", 200, 360);

  requestAnimationFrame(animate);
}

function drawGridofSnowmen(spacing, width, height) {
  let x = spacing;
  while (x < width) {
    let y = spacing;
    while (y < height) {
      const scaleFactor = Math.random() + 0.5;
      drawSnowman(x, y, 10, scaleFactor);
      y = y + spacing;
    }

    x = x + spacing;
  }
}

function drawSnowman(x1, y1, r1, scaleFactor) {
  ctx.beginPath();
  ctx.arc(x1, y1, r1, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  ctx.beginPath();
  const r2 = r1 * scaleFactor,
    x2 = x1,
    y2 = y1 - r1 - r2; // 300 - 50 - 25 = 210

  ctx.arc(x2, y2, r2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  const r3 = r2 * scaleFactor,
    x3 = x2,
    y3 = y2 - r2 - r3; // 225 - 25 - 20 = 138

  ctx.arc(x3, y3, r3, 0, Math.PI * 2);
  ctx.fill();
  // draw hat
  drawHat(x3, y3, r3);
}

function drawHat(headX, headY, headRad) {
  ctx.beginPath();
  const w4 = headRad * 2,
    h4 = headRad / 2,
    x4 = headX - w4 / 2,
    y4 = headY - headRad; // 138 - 34 =  104
  ctx.rect(x4, y4, w4, h4);
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.beginPath();
  const w5 = w4 * 0.8,
    h5 = headRad,
    x5 = headX - w5 / 2,
    y5 = y4 - h5;
  ctx.rect(x5, y5, w5, h5);
  ctx.stroke();
  ctx.fill();
}
