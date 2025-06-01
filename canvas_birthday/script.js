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
drawItemFunctions[14] = drawCalendar;
drawItemFunctions[15] = drawHat;
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
  drawItemFunctions[14] = drawCalendar;
  drawItemFunctions[15] = drawHat;
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

  // ✅ Bắt sự kiện click và truyền thông tin

  canvas.addEventListener("click", (e) => {
    e.preventDefault();
    const drawFunction = drawItemFunctions[day];

    clickItem(
      {
        drawFunction,
      },
      day
    );
  });
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
  if (typeof drawTreeNotBall === "function") {
    drawTreeNotBall(ctx, x, y, size, hue);
  }
}

drawBigTree();

// function clickItem(item, idx) {
//   console.log("Item được click:");
//   console.log("  ➤ Function:", item.drawFunction?.name);
//   console.log("levels", window.treeLevels);
//   console.log("index", idx);
//   // Ví dụ: bạn có thể gọi addItemToTree
//   if(idx === 14) {
//     window.birthdayActive = true;
//   } else {
//     window.birthdayActive = false;
//   }
//   addItemToTree(item.drawFunction, item.day, Math.random() * 360);
// }

function clickItem(item, idx) {
  console.log("Item được click:");
  console.log("  ➤ Function:", item.drawFunction?.name);
  console.log("index", idx);

  if (idx === 14) {
    window.birthdayActive = true;

    const imgUrls = [
      "./img/1.jpg",
      "./img/2.jpg",
      "./img/3.jpg",
      "./img/4.jpg",
    ];

    Promise.all(
      imgUrls.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = src;
        });
      })
    ).then((images) => {
      window.initSnowWithImages(images); // ✅ ảnh rơi
    });
  } else {
    window.birthdayActive = false;

    // ✅ Xóa đúng canvas tuyết
    const snowCanvas = document.getElementById("snow-canvas");
    if (snowCanvas) snowCanvas.remove();

    // ✅ Gọi lại tuyết trắng mặc định
    if (typeof window.initSnowWithImages === "function") {
      window.initSnowWithImages([]);
    }
  }

  addItemToTree(item.drawFunction, item.day, Math.random() * 360);
}
function addItemToTree(drawFunction, day, hue) {
  const canvasItem = document.createElement("canvas");
  canvasItem.width = cellSize;
  canvasItem.height = cellSize;

  const ctx = canvasItem.getContext("2d");
  ctx.clearRect(0, 0, canvasItem.width, canvasItem.height);

  const x = canvasItem.width / 2;
  const y = canvasItem.height / 2;
  const itemSize = canvasItem.width * 0.6;

  drawFunction(ctx, x, y, itemSize, hue);

  // ➤ Vị trí bắt đầu bên trái
  const startX = 50;
  const startY = window.innerHeight / 2;

  canvasItem.style.position = "absolute";
  canvasItem.style.left = `${startX}px`;
  canvasItem.style.top = `${startY}px`;
  canvasItem.style.zIndex = "1000";
  canvasItem.style.transformOrigin = "center center";
  canvasItem.style.transition = "left 1s ease, top 1s ease";
  canvasItem.style.animation = "spin 1s linear infinite";
  document.getElementById("item").appendChild(canvasItem);

  requestAnimationFrame(() => {
    const centerX = window.innerWidth / 2 - canvasItem.width / 2;
    const centerY = window.innerHeight / 2 - canvasItem.height / 2;
    canvasItem.style.left = `${centerX}px`;
    canvasItem.style.top = `${centerY}px`;
  });

  let hasMoved = false;

  function onTransitionEnd(e) {
    if (!hasMoved && (e.propertyName === "top" || e.propertyName === "left")) {
      hasMoved = true;
      canvasItem.removeEventListener("transitionend", onTransitionEnd);

      canvasItem.style.animation = "none";
      canvasItem.style.transition = "transform 0.3s ease, opacity 0.3s ease";
      canvasItem.style.transform = "scale(0)";
      canvasItem.style.opacity = "0";

      canvasItem.addEventListener("transitionend", function cleanup(e2) {
        if (e2.propertyName === "opacity") {
          canvasItem.removeEventListener("transitionend", cleanup);
          canvasItem.remove();

          // ➤ VẼ LÊN CÂY bằng canvas phụ
          const treeCanvas = document.querySelector("#big-tree canvas");
          const treeCtx = treeCanvas.getContext("2d");

          if (window.treeLevels) {
            const level = window.treeLevels[Math.floor(Math.random() * 3)];

            const scaleFactor = 1;
            const scaledSize = itemSize * scaleFactor;
            const margin = scaledSize / 2;

            const maxX = level.right - margin;
            const minX = level.left + margin;
            const maxY = level.bottom - margin;
            const minY = level.top + margin;

            const posX = minX + Math.random() * (maxX - minX);
            const posY = minY + Math.random() * (maxY - minY);

            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = cellSize;
            tempCanvas.height = cellSize;
            const tempCtx = tempCanvas.getContext("2d");

            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            drawFunction(tempCtx, cellSize / 2, cellSize / 2, scaledSize, hue);

            // ✅ Vẽ scaled item đúng vị trí
            treeCtx.drawImage(
              tempCanvas,
              posX - scaledSize / 2,
              posY - scaledSize / 2,
              scaledSize,
              scaledSize
            );
          }
        }
      });
    }
  }

  canvasItem.addEventListener("transitionend", onTransitionEnd);
}
