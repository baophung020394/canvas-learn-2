// Santa Claus drawing and animation
let santaX = 0; // Starting position
let santaDirection = 1; // 1 for right, -1 for left
let santaSpeed = 1; // Movement speed

// Control states
let isAutoMoving = true; // True: automatic movement, False: keyboard control
let keysPressed = {}; // Track pressed keys

function drawSanta(ctx, x, y, size, hue) {
  // Santa's colors
  const redHue = 0; // Red color for Santa's suit
  const skinHue = 30; // Skin tone
  
  // Body - red suit
  draw.circle(ctx, x, y, size * 0.4, {
    fillStyle: color.normal(redHue),
    strokeStyle: color.dark(redHue),
    lineWidth: 2
  });
  
  // Head
  draw.circle(ctx, x, y - size * 0.4, size * 0.25, {
    fillStyle: color.lightest(skinHue),
    strokeStyle: color.dark(skinHue),
    lineWidth: 1
  });
  
  // Santa's hat
  ctx.beginPath();
  ctx.moveTo(x - size * 0.25, y - size * 0.45);
  ctx.lineTo(x, y - size * 0.7);
  ctx.lineTo(x + size * 0.25, y - size * 0.45);
  ctx.fillStyle = color.normal(redHue);
  ctx.fill();
  
  // Hat's white trim
  draw.circle(ctx, x, y - size * 0.7, size * 0.08, {
    fillStyle: '#FFFFFF',
  });
  
  // Hat's white band
  draw.line(ctx, x - size * 0.25, y - size * 0.45, x + size * 0.25, y - size * 0.45, {
    strokeStyle: '#FFFFFF',
    lineWidth: size * 0.08
  });
  
  // Beard
  ctx.beginPath();
  ctx.moveTo(x - size * 0.2, y - size * 0.35);
  ctx.lineTo(x, y - size * 0.2);
  ctx.lineTo(x + size * 0.2, y - size * 0.35);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  
  // Eyes
  draw.circle(ctx, x - size * 0.08, y - size * 0.45, size * 0.03, {
    fillStyle: '#000000'
  });
  draw.circle(ctx, x + size * 0.08, y - size * 0.45, size * 0.03, {
    fillStyle: '#000000'
  });
  
  // Belt
  draw.line(ctx, x - size * 0.4, y, x + size * 0.4, y, {
    strokeStyle: '#000000',
    lineWidth: size * 0.08
  });
  
  // Buckle
  draw.circle(ctx, x, y, size * 0.06, {
    fillStyle: color.normal(60), // Gold color
    strokeStyle: '#000000',
    lineWidth: 1
  });
  
  // Legs
  draw.line(ctx, x - size * 0.2, y + size * 0.4, x - size * 0.2, y + size * 0.1, {
    strokeStyle: color.normal(redHue),
    lineWidth: size * 0.15
  });
  
  draw.line(ctx, x + size * 0.2, y + size * 0.4, x + size * 0.2, y + size * 0.1, {
    strokeStyle: color.normal(redHue),
    lineWidth: size * 0.15
  });
  
  // Boots
  draw.circle(ctx, x - size * 0.2, y + size * 0.45, size * 0.08, {
    fillStyle: '#000000'
  });
  
  draw.circle(ctx, x + size * 0.2, y + size * 0.45, size * 0.08, {
    fillStyle: '#000000'
  });
  
  // Arms
  draw.line(ctx, x - size * 0.4, y - size * 0.1, x - size * 0.2, y - size * 0.2, {
    strokeStyle: color.normal(redHue),
    lineWidth: size * 0.1
  });
  
  draw.line(ctx, x + size * 0.4, y - size * 0.1, x + size * 0.2, y - size * 0.2, {
    strokeStyle: color.normal(redHue),
    lineWidth: size * 0.1
  });
}

// Draw a sleigh
function drawSleigh(ctx, x, y, size, hue) {
  const brownHue = 30; // Brown color for the sleigh
  const redHue = 0; // Red color for details
  
  // Main body of sleigh
  ctx.beginPath();
  ctx.moveTo(x - size * 0.4, y);
  ctx.lineTo(x + size * 0.4, y);
  ctx.lineTo(x + size * 0.5, y - size * 0.2);
  ctx.lineTo(x - size * 0.3, y - size * 0.2);
  ctx.closePath();
  ctx.fillStyle = color.dark(brownHue);
  ctx.fill();
  ctx.strokeStyle = color.darkest(brownHue);
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Sleigh front curved part
  ctx.beginPath();
  ctx.moveTo(x - size * 0.3, y - size * 0.2);
  ctx.quadraticCurveTo(x - size * 0.5, y - size * 0.25, x - size * 0.5, y - size * 0.1);
  ctx.lineTo(x - size * 0.4, y);
  ctx.closePath();
  ctx.fillStyle = color.dark(brownHue);
  ctx.fill();
  ctx.strokeStyle = color.darkest(brownHue);
  ctx.stroke();
  
  // Sleigh seat back
  ctx.beginPath();
  ctx.moveTo(x + size * 0.2, y - size * 0.2);
  ctx.lineTo(x + size * 0.2, y - size * 0.4);
  ctx.lineTo(x - size * 0.1, y - size * 0.4);
  ctx.lineTo(x - size * 0.1, y - size * 0.2);
  ctx.closePath();
  ctx.fillStyle = color.dark(brownHue);
  ctx.fill();
  ctx.strokeStyle = color.darkest(brownHue);
  ctx.stroke();
  
  // Sleigh runners (skis)
  ctx.beginPath();
  ctx.moveTo(x - size * 0.5, y + size * 0.1);
  ctx.lineTo(x + size * 0.5, y + size * 0.1);
  ctx.quadraticCurveTo(x + size * 0.6, y + size * 0.1, x + size * 0.6, y);
  ctx.lineTo(x + size * 0.5, y);
  ctx.lineTo(x - size * 0.5, y);
  ctx.quadraticCurveTo(x - size * 0.6, y, x - size * 0.6, y + size * 0.05);
  ctx.closePath();
  ctx.fillStyle = color.darkest(brownHue);
  ctx.fill();
  
  // Red trim detail
  ctx.beginPath();
  ctx.moveTo(x - size * 0.4, y - size * 0.05);
  ctx.lineTo(x + size * 0.4, y - size * 0.05);
  ctx.lineWidth = size * 0.03;
  ctx.strokeStyle = color.normal(redHue);
  ctx.stroke();
  
  // Present in the sleigh
  const presentSize = size * 0.15;
  const presentX = x;
  const presentY = y - size * 0.15;
  
  // Present box
  ctx.fillStyle = color.normal(240); // Blue present
  ctx.fillRect(presentX - presentSize/2, presentY - presentSize/2, presentSize, presentSize);
  
  // Present ribbon
  ctx.beginPath();
  ctx.moveTo(presentX, presentY - presentSize/2);
  ctx.lineTo(presentX, presentY + presentSize/2);
  ctx.moveTo(presentX - presentSize/2, presentY);
  ctx.lineTo(presentX + presentSize/2, presentY);
  ctx.lineWidth = 2;
  ctx.strokeStyle = color.normal(redHue);
  ctx.stroke();
}

// Draw a reindeer
function drawReindeer(ctx, x, y, size, hue, legOffset = 0) {
  const brownHue = 30; // Brown color for the reindeer
  
  // Body
  draw.ellipse(ctx, x, y, size * 0.4, size * 0.25, {
    fillStyle: color.dark(brownHue)
  });
  
  // Head
  draw.ellipse(ctx, x + size * 0.5, y - size * 0.2, size * 0.2, size * 0.15, {
    fillStyle: color.dark(brownHue)
  });
  
  // Antlers
  ctx.beginPath();
  // Left antler
  ctx.moveTo(x + size * 0.5, y - size * 0.3);
  ctx.lineTo(x + size * 0.4, y - size * 0.5);
  ctx.lineTo(x + size * 0.3, y - size * 0.4);
  // Right antler
  ctx.moveTo(x + size * 0.6, y - size * 0.3);
  ctx.lineTo(x + size * 0.7, y - size * 0.5);
  ctx.lineTo(x + size * 0.8, y - size * 0.4);
  ctx.lineWidth = size * 0.03;
  ctx.strokeStyle = color.darkest(brownHue);
  ctx.stroke();
  
  // Eye
  draw.circle(ctx, x + size * 0.6, y - size * 0.25, size * 0.03, {
    fillStyle: '#000000'
  });
  
  // Nose (red for Rudolph, otherwise brown)
  const isRudolph = Math.random() < 0.3; // 30% chance to be Rudolph
  draw.circle(ctx, x + size * 0.7, y - size * 0.2, size * 0.04, {
    fillStyle: isRudolph ? color.normal(0) : color.darkest(brownHue)
  });
  
  // Legs with animation
  const legSpacing = size * 0.2;
  const legLength = size * 0.3;
  const animationOffset = Math.sin(legOffset) * size * 0.05;
  
  // Front legs
  draw.line(ctx, x + size * 0.3, y, x + size * 0.3, y + legLength + animationOffset, {
    strokeStyle: color.darkest(brownHue),
    lineWidth: size * 0.05
  });
  
  draw.line(ctx, x + size * 0.3 + legSpacing, y, x + size * 0.3 + legSpacing, y + legLength - animationOffset, {
    strokeStyle: color.darkest(brownHue),
    lineWidth: size * 0.05
  });
  
  // Rear legs
  draw.line(ctx, x - size * 0.3, y, x - size * 0.3, y + legLength - animationOffset, {
    strokeStyle: color.darkest(brownHue),
    lineWidth: size * 0.05
  });
  
  draw.line(ctx, x - size * 0.3 + legSpacing, y, x - size * 0.3 + legSpacing, y + legLength + animationOffset, {
    strokeStyle: color.darkest(brownHue),
    lineWidth: size * 0.05
  });
  
  // Tail
  draw.circle(ctx, x - size * 0.5, y - size * 0.1, size * 0.05, {
    fillStyle: color.light(brownHue)
  });
}

function createSantaAnimation() {
  // Create container for Santa
  const santaContainer = document.getElementById('santa-container') || document.createElement('div');
  if (!santaContainer.id) {
    santaContainer.id = 'santa-container';
    santaContainer.style.position = 'absolute';
    santaContainer.style.bottom = '50px'; // Position at the bottom of the tree
    santaContainer.style.left = '0';
    santaContainer.style.width = '100%';
    santaContainer.style.height = '100px';
    santaContainer.style.zIndex = '100';
    document.getElementById('content').appendChild(santaContainer);
  }
  
  // Create canvas for Santa
  const santaCanvas = document.createElement('canvas');
  santaCanvas.id = 'santa-canvas';
  santaCanvas.width = window.innerWidth;
  santaCanvas.height = 100;
  santaCanvas.style.background = 'transparent';
  santaContainer.innerHTML = '';
  santaContainer.appendChild(santaCanvas);
  
  // Create ground/snow path
  const groundCanvas = document.createElement('canvas');
  groundCanvas.id = 'ground-canvas';
  groundCanvas.width = window.innerWidth;
  groundCanvas.height = 20;
  groundCanvas.style.position = 'absolute';
  groundCanvas.style.bottom = '0';
  groundCanvas.style.left = '0';
  groundCanvas.style.background = 'transparent';
  groundCanvas.style.zIndex = '99';
  santaContainer.appendChild(groundCanvas);
  
  // Draw the ground
  const groundCtx = groundCanvas.getContext('2d');
  groundCtx.fillStyle = '#FFFFFF';
  groundCtx.fillRect(0, 0, groundCanvas.width, 20);
  
  // Add snow texture to the ground
  for (let i = 0; i < groundCanvas.width; i += 5) {
    const height = 5 + Math.random() * 10;
    groundCtx.fillStyle = 'rgba(220, 220, 255, 0.8)';
    groundCtx.fillRect(i, 0, 3, height);
  }
  
  // Create control mode indicator
  const modeIndicator = document.createElement('div');
  modeIndicator.id = 'mode-indicator';
  modeIndicator.style.position = 'absolute';
  modeIndicator.style.top = '10px';
  modeIndicator.style.right = '10px';
  modeIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modeIndicator.style.color = 'white';
  modeIndicator.style.padding = '5px 10px';
  modeIndicator.style.borderRadius = '5px';
  modeIndicator.style.fontFamily = 'Arial, sans-serif';
  modeIndicator.style.zIndex = '1000';
  modeIndicator.textContent = 'Mode: Auto (Press SPACE to switch)';
  document.body.appendChild(modeIndicator);
  
  // Setup keyboard event listeners
  setupKeyboardControls();
  
  // Start the animation
  animateSanta();
}

function setupKeyboardControls() {
  // Add event listeners for keyboard controls
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  
  // Update the mode indicator
  updateModeIndicator();
}

function handleKeyDown(event) {
  // Store the key state
  keysPressed[event.key.toLowerCase()] = true;
  
  // Handle space key to toggle movement mode
  if (event.key === ' ' || event.code === 'Space') {
    isAutoMoving = !isAutoMoving;
    updateModeIndicator();
    
    // If switching to auto mode, reset direction based on current direction
    if (isAutoMoving) {
      santaDirection = santaDirection >= 0 ? 1 : -1;
    }
    
    // Prevent default space behavior (page scrolling)
    event.preventDefault();
  }
}

function handleKeyUp(event) {
  // Clear the key state
  keysPressed[event.key.toLowerCase()] = false;
}

function updateModeIndicator() {
  const indicator = document.getElementById('mode-indicator');
  if (indicator) {
    if (isAutoMoving) {
      indicator.textContent = 'Mode: Auto (Press SPACE to switch)';
      indicator.style.backgroundColor = 'rgba(0, 100, 0, 0.5)'; // Green for auto
    } else {
      indicator.textContent = 'Mode: Manual - Use A/D keys (Press SPACE to switch)';
      indicator.style.backgroundColor = 'rgba(100, 0, 0, 0.5)'; // Red for manual
    }
  }
}

function animateSanta() {
  const santaCanvas = document.getElementById('santa-canvas');
  if (!santaCanvas) return;
  
  const ctx = santaCanvas.getContext('2d');
  const santaSize = 60;
  const sleighSize = santaSize * 1.2;
  const reindeerSize = santaSize * 0.8;
  
  // Create an array for reindeer positions
  const reindeerCount = 2; // Number of reindeer
  const reindeerSpacing = reindeerSize * 1.2; // Spacing between reindeer
  let animationTime = 0; // For leg animation
  
  // Animation loop
  function updateSanta() {
    // Clear the canvas
    ctx.clearRect(0, 0, santaCanvas.width, santaCanvas.height);
    
    // Update Santa's position based on current mode
    if (isAutoMoving) {
      // Automatic movement
      santaX += santaSpeed * santaDirection;
      
      // Check boundaries and reverse direction if needed
      if (santaX > santaCanvas.width - santaSize || santaX < santaSize) {
        santaDirection *= -1;
      }
    } else {
      // Manual keyboard control
      const moveSpeed = 3; // Faster speed for manual control
      
      if (keysPressed['a'] || keysPressed['arrowleft']) {
        santaX -= moveSpeed;
        santaDirection = -1;
      }
      if (keysPressed['d'] || keysPressed['arrowright']) {
        santaX += moveSpeed;
        santaDirection = 1;
      }
      
      // Enforce boundaries for manual control
      santaX = Math.max(santaSize, Math.min(santaCanvas.width - santaSize, santaX));
    }
    
    animationTime += 0.1; // Increment animation time
    
    // Draw based on direction
    ctx.save();
    if (santaDirection < 0) {
      // Going left - flip everything
      ctx.scale(-1, 1);
      
      // Calculate positions when going left (need to negate x values)
      const flippedX = -santaX;
      
      // Draw the sleigh
      drawSleigh(ctx, flippedX, 50, sleighSize, 0);
      
      // Draw Santa in the sleigh
      drawSanta(ctx, flippedX, 45, santaSize * 0.8, 0);
      
      // Draw reindeer
      for (let i = 0; i < reindeerCount; i++) {
        const reindeerX = flippedX + sleighSize * 0.6 + (i + 1) * reindeerSpacing;
        drawReindeer(ctx, reindeerX, 50, reindeerSize, 0, animationTime + i);
        
        // Draw reins connecting reindeer
        if (i > 0) {
          ctx.beginPath();
          ctx.moveTo(reindeerX - reindeerSpacing + reindeerSize * 0.5, 50);
          ctx.lineTo(reindeerX - reindeerSize * 0.4, 50);
          ctx.strokeStyle = '#553300';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        // Connect last reindeer to sleigh
        if (i === 0) {
          ctx.beginPath();
          ctx.moveTo(flippedX + sleighSize * 0.5, 50);
          ctx.lineTo(reindeerX - reindeerSize * 0.4, 50);
          ctx.strokeStyle = '#553300';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    } else {
      // Going right - normal drawing
      
      // Draw the sleigh
      drawSleigh(ctx, santaX, 50, sleighSize, 0);
      
      // Draw Santa in the sleigh
      drawSanta(ctx, santaX, 45, santaSize * 0.8, 0);
      
      // Draw reindeer
      for (let i = 0; i < reindeerCount; i++) {
        const reindeerX = santaX - sleighSize * 0.6 - (i + 1) * reindeerSpacing;
        drawReindeer(ctx, reindeerX, 50, reindeerSize, 0, animationTime + i);
        
        // Draw reins connecting reindeer
        if (i > 0) {
          ctx.beginPath();
          ctx.moveTo(reindeerX + reindeerSpacing - reindeerSize * 0.5, 50);
          ctx.lineTo(reindeerX + reindeerSize * 0.4, 50);
          ctx.strokeStyle = '#553300';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        // Connect last reindeer to sleigh
        if (i === 0) {
          ctx.beginPath();
          ctx.moveTo(santaX - sleighSize * 0.5, 50);
          ctx.lineTo(reindeerX + reindeerSize * 0.4, 50);
          ctx.strokeStyle = '#553300';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    ctx.restore();
    
    // Draw control instructions if in manual mode
    if (!isAutoMoving) {
      ctx.font = '12px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText('A: Move Left   D: Move Right   SPACE: Switch Mode', 20, 20);
    }
    
    requestAnimationFrame(updateSanta);
  }
  
  // Initialize Santa's starting position
  santaX = santaSize;
  
  // Start the animation
  updateSanta();
}

// Cleanup function to remove event listeners when needed
function cleanupSantaAnimation() {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  
  const indicator = document.getElementById('mode-indicator');
  if (indicator) {
    indicator.remove();
  }
} 