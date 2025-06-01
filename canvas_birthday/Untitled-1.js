// Quản lý state
let treeItems = [];
let treeAnimationFrame = null;
let treeBaseImage = null; // Cache base tree image

// Cache cây thông cơ bản
function cacheBaseTree(canvas) {
  const cacheCanvas = document.createElement('canvas');
  cacheCanvas.width = canvas.width;
  cacheCanvas.height = canvas.height;
  const ctx = cacheCanvas.getContext('2d');
  
  const size = Math.min(canvas.width, canvas.height) * 0.8;
  const x = canvas.width / 2;
  const y = canvas.height / 2 + size * 0.1;
  const hue = 120;
  
  // Vẽ cây cơ bản
  // drawBaseTree(ctx, x, y, size, hue);
  
  return cacheCanvas;
}

// Vẽ cây cơ bản không bao gồm đèn
function drawBaseTree(ctx, x, y, size, hue) {
  const top = y - size / 2;
  const left = x - size / 2;
  const bottom = y + size / 2;
  const right = x + size / 2;

  const trunkWidth = size * 0.1;
  ctx.lineWidth = trunkWidth;
  ctx.strokeStyle = color.darkest(hue);
  draw.line(ctx, x, bottom, x, y);

  const block = {
    bottom: bottom - size * 0.2,
    top: bottom - size * 0.5,
    width: size * 0.8,
    get left() { return x - this.width / 2; },
    get right() { return x + this.width / 2; },
    color: color.normal(hue)
  };

  ctx.fillStyle = block.color;

  // Vẽ 3 tầng tam giác
  // Tầng dưới
  ctx.beginPath();
  ctx.moveTo(block.left, block.bottom);
  ctx.lineTo(block.right, block.bottom);
  ctx.lineTo(x, block.top);
  ctx.fill();

  // Tầng giữa
  block.bottom = bottom - size * 0.4;
  block.top = block.bottom - size * 0.3;
  block.width = size * 0.6;
  
  ctx.beginPath();
  ctx.moveTo(block.left, block.bottom);
  ctx.lineTo(block.right, block.bottom);
  ctx.lineTo(x, block.top);
  ctx.fill();

  // Tầng trên
  block.bottom = bottom - size * 0.6;
  block.top = top;
  block.width = size * 0.4;
  
  ctx.beginPath();
  ctx.moveTo(block.left, block.bottom);
  ctx.lineTo(block.right, block.bottom);
  ctx.lineTo(x, block.top);
  ctx.fill();
}

// Hàm thêm item vào cây
function addItemToTree(drawFunction, day, hue) {
  const treeCanvas = document.querySelector("#big-tree canvas");
  if (!treeCanvas) return;

  const size = Math.min(treeCanvas.width, treeCanvas.height) * 0.8;
  const x = treeCanvas.width / 2;
  const y = treeCanvas.height / 2 + size * 0.1;

  // Cache cây thông nếu chưa có
  if (!treeBaseImage) {
    treeBaseImage = cacheBaseTree(treeCanvas);
  }

  // Tính vị trí ngẫu nhiên trên cây
  const position = calculateRandomPosition(x, y, size);

  // Tạo item mới
  const item = {
    drawFunction,
    day,
    hue,
    size: size * 0.08,
    x: position.x,
    y: position.y,
    rotation: Math.random() * Math.PI * 2,
    scale: 0,
    alpha: 0,
    animationProgress: 0
  };

  treeItems.push(item);
  startTreeAnimation(treeCanvas);
}

// Tính toán vị trí ngẫu nhiên trên cây
function calculateRandomPosition(centerX, centerY, treeSize) {
  const levels = [
    { width: treeSize * 0.7, height: treeSize * 0.3, y: centerY - treeSize * 0.2 },
    { width: treeSize * 0.5, height: treeSize * 0.3, y: centerY - treeSize * 0.4 },
    { width: treeSize * 0.3, height: treeSize * 0.3, y: centerY - treeSize * 0.6 }
  ];

  const level = levels[Math.floor(Math.random() * levels.length)];
  let x, y, valid;

  do {
    const margin = treeSize * 0.05;
    const availableWidth = level.width - margin * 2;
    x = centerX - availableWidth/2 + Math.random() * availableWidth;
    
    const maxHeight = level.height - margin;
    const distanceFromCenter = Math.abs(x - centerX);
    const heightReduction = (distanceFromCenter / (level.width/2)) * maxHeight;
    
    y = level.y - margin - Math.random() * (maxHeight - heightReduction);
    
    valid = true;
    // Kiểm tra khoảng cách với các item khác
    for (const item of treeItems) {
      const dx = x - item.x;
      const dy = y - item.y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < treeSize * 0.1) {
        valid = false;
        break;
      }
    }
  } while (!valid);

  return { x, y };
}

// Quản lý animation
function startTreeAnimation(canvas) {
  if (!canvas._treeAnimating) {
    canvas._treeAnimating = true;
    animateTree(canvas);
  }
}

function stopTreeAnimation(canvas) {
  canvas._treeAnimating = false;
  if (treeAnimationFrame) {
    cancelAnimationFrame(treeAnimationFrame);
    treeAnimationFrame = null;
  }
}

function animateTree(canvas) {
  if (!canvas._treeAnimating) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Vẽ cây cơ bản từ cache
  if (treeBaseImage) {
    ctx.drawImage(treeBaseImage, 0, 0);
  }

  let needsMoreFrames = false;

  // Animate và vẽ từng item
  for (let i = treeItems.length - 1; i >= 0; i--) {
    const item = treeItems[i];
    
    // Cập nhật animation
    if (item.animationProgress < 1) {
      item.animationProgress += 0.05;
      needsMoreFrames = true;
      
      // Tính toán scale và alpha
      item.scale = Math.min(1, item.animationProgress * 2);
      item.alpha = Math.min(1, item.animationProgress * 2);
    }

    // Vẽ item
    if (item.alpha > 0) {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);
      ctx.scale(item.scale, item.scale);
      ctx.globalAlpha = item.alpha;
      item.drawFunction(ctx, 0, 0, item.size, item.hue);
      ctx.restore();
    }
  }

  // Tiếp tục hoặc dừng animation
  if (needsMoreFrames) {
    treeAnimationFrame = requestAnimationFrame(() => animateTree(canvas));
  } else {
    stopTreeAnimation(canvas);
  }
}

// Export các hàm cần thiết
window.addItemToTree = addItemToTree;
window.drawTreeNotBall = function(ctx, x, y, size, hue) {
  // Vẽ cây cơ bản
  drawBaseTree(ctx, x, y, size, hue);
  
  // Vẽ các item đã có
  for (const item of treeItems) {
    if (item.alpha > 0) {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);
      ctx.scale(item.scale, item.scale);
      ctx.globalAlpha = item.alpha;
      item.drawFunction(ctx, 0, 0, item.size, item.hue);
      ctx.restore();
    }
  }
};
