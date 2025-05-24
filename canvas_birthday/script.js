const cellSize = 100;

const drawItemFunctions = [];

drawItemFunctions[1] = drawStar;
drawItemFunctions[2] = drawBall;
drawItemFunctions[3] = drawSock;
drawItemFunctions[4] = drawCane;
drawItemFunctions[5] = drawBow;
drawItemFunctions[6] = drawBell;
drawItemFunctions[7] = drawSnowBall;
drawItemFunctions[8] = drawCandle;
drawItemFunctions[9] = drawGlove;
drawItemFunctions[10] = drawCandy;
drawItemFunctions[11] = drawSnowFlake;
drawItemFunctions[12] = drawSledge;
drawItemFunctions[13] = drawTree;
drawItemFunctions[14] = drawHat;
drawItemFunctions[15] = drawCalendar;
drawItemFunctions[16] = drawPresent;
drawItemFunctions[17] = drawCookie;
drawItemFunctions[18] = drawGlobe;
drawItemFunctions[19] = drawBells;
drawItemFunctions[20] = drawSnowMan;
drawItemFunctions[21] = drawCrown;
drawItemFunctions[22] = drawSkate;
drawItemFunctions[23] = drawReindeer;
drawItemFunctions[24] = drawChristmasTree;

for (let day = 1; day <= 24; day++) {
  drawItemFunctions[1] = drawStar;
  drawItemFunctions[2] = drawBall;
  drawItemFunctions[3] = drawSock;
  drawItemFunctions[4] = drawCane;
  drawItemFunctions[5] = drawBow;
  drawItemFunctions[6] = drawBell;
  drawItemFunctions[7] = drawSnowBall;
  drawItemFunctions[8] = drawCandle;
  drawItemFunctions[9] = drawGlove;
  drawItemFunctions[10] = drawCandy;
  drawItemFunctions[11] = drawSnowFlake;
  drawItemFunctions[12] = drawSledge;
  drawItemFunctions[13] = drawTree;
  drawItemFunctions[14] = drawHat;
  drawItemFunctions[15] = drawCalendar;
  drawItemFunctions[16] = drawPresent;
  drawItemFunctions[17] = drawCookie;
  drawItemFunctions[18] = drawGlobe;
  drawItemFunctions[19] = drawBells;
  drawItemFunctions[20] = drawSnowMan;
  drawItemFunctions[21] = drawCrown;
  drawItemFunctions[22] = drawSkate;
  drawItemFunctions[23] = drawReindeer;
  drawItemFunctions[24] = drawChristmasTree;

  const canvas = document.createElement("canvas");
  canvas.width = cellSize;
  canvas.height = cellSize;
  document.getElementById("canvas-calendar").appendChild(canvas);

  fillCell(day, canvas);
}

function fillCell(index, canvas) {
  const ctx = canvas.getContext("2d");
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  const itemSize = canvas.width * 0.6;

  const drawItem = drawItemFunctions[index];
  const hue = Math.random() * 360;
  if (drawItem) {
    drawItem(ctx, x, y, itemSize, hue);
  } else {
    drawNumber(ctx, index, x, y, itemSize);
  }
}

function drawNumber(ctx, value, x, y, size) {
  ctx.font = size + `px Consolas`;
  ctx.textAlign = `center`;
  ctx.textBaseline = `middle`;
  // ctx.fillStyle = `#000`;
  ctx.fillText(value, x, y);
}

// getElementById "big-tree" và appendChild một canvas vào đó, sau đó vẽ cây thông lớn
function drawBigTree() {
  const container = document.getElementById("big-tree");
  if (!container) return;
  container.innerHTML = "";
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 600;
  canvas.style.background = "transparent";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const size = Math.min(canvas.width, canvas.height) * 0.8;
  const x = canvas.width / 2;
  const y = canvas.height / 2 + size * 0.1;
  const hue = 120;
  if (typeof drawChristmasTree === "function") {
    drawChristmasTree(ctx, x, y, size, hue);
  }
}

drawBigTree();
