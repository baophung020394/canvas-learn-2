const ctx = myCanvas.getContext("2d");

const cubes = [];
let draggingCube = null;
let offsetX = 0;
let offsetY = 0;

myCanvas.addEventListener("pointerdown", (e) => {
  const x = e.clientX - myCanvas.offsetLeft;
  const y = e.clientY - myCanvas.offsetTop;

  // Check if a cube is clicked
  for (const cube of cubes) {
    const dx = x - cube.centerX;
    const dy = y - cube.centerY;
    if (Math.abs(dx) <= cube.size / 2 && Math.abs(dy) <= cube.size / 2) {
      draggingCube = cube;
      offsetX = dx;
      offsetY = dy;

      // Update only the clicked cube's state
      cube.topPartInBack = e.button == 2;
      drawAllCubes();
      return;
    }
  }

  // If no cube is clicked, draw a new one
  ctx.globalCompositeOperation = "source-over";
  const newCube = { centerX: x, centerY: y, size: 100, topPartInBack: e.button == 2 };
  cubes.push(newCube);
  drawAllCubes();
});

myCanvas.addEventListener("pointermove", (e) => {
  e.preventDefault();
  if (draggingCube) {
    const x = e.clientX - myCanvas.offsetLeft;
    const y = e.clientY - myCanvas.offsetTop;
    draggingCube.centerX = x - offsetX;
    draggingCube.centerY = y - offsetY;
    drawAllCubes();
  }
});

myCanvas.addEventListener("pointerup", () => {
  draggingCube = null;
});

function drawAllCubes() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  for (const cube of cubes) {
    drawCube(cube.centerX, cube.centerY, cube.size, cube.topPartInBack);
  }
}

function drawCube(centerX, centerY, size, topPartInBack = false) {
  ctx.beginPath();
  const radius = size / 2; // 50
  for (let i = 0; i <= 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6; // -30 degrees
    console.log("angle", Math.cos(angle));
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    console.log("x", x);
    console.log("y", y);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    if (i % 2 == 0) {
      if (i == 6 && topPartInBack) {
        ctx.globalCompositeOperation = "destination-over";
      }
      ctx.stroke();
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = ["#888", "#444", "#aaa"][i / 2 - 1];
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }

  ctx.stroke();
}
