(function () {
  // Game state
  let isActive = false;
  let score = 0;
  let requiredScore = 240;
  let fallingItems = [];
  let canvas, ctx;
  let width = 0, height = 0;
  let itemCount = 24;
  let itemSize = 40;
  let santaPosition = { x: 0, y: 0, width: 0, height: 0 };
  let frameCount = 0;
  let bigPresentRevealed = false;
  let bigPresentOpened = false;
  let bigPresent = {
    x: 0,
    y: 0,
    width: 150,
    height: 150,
    revealed: false,
    clicked: false,
    opening: 0  // 0-100 for animation
  };
  
  // Score display
  let scoreDisplay = null;
  
  // Draw functions for the items, referencing the existing ones
  const drawItemFunctions = [];
  
  // Falling item class
  class FallingItem {
    constructor(width, height) {
      this.reset(width, height);
    }
    
    reset(width, height) {
      this.x = Math.random() * (width - itemSize);
      this.y = Math.random() * -300 - itemSize; // Start above the screen
      this.speed = 1 + Math.random() * 3;
      this.type = Math.floor(Math.random() * itemCount) + 1; // 1-24
      this.value = this.type; // Score value equals the item type
      this.collected = false;
      this.size = itemSize;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 4 - 2;
      this.hue = Math.random() * 360;
    }
    
    update() {
      if (this.collected) return;
      
      this.y += this.speed;
      this.rotation += this.rotationSpeed;
      
      // Check if item is below screen
      if (this.y > height + itemSize) {
        this.reset(width, height);
      }
      
      // Check collision with Santa
      if (this.checkCollision()) {
        this.collected = true;
        addScore(this.value);
        createScorePopup(this.x, this.y, this.value);
      }
    }
    
    checkCollision() {
      // Simple AABB collision detection
      return !this.collected && 
             this.x < santaPosition.x + santaPosition.width &&
             this.x + this.size > santaPosition.x &&
             this.y < santaPosition.y + santaPosition.height &&
             this.y + this.size > santaPosition.y;
    }
    
    draw(ctx) {
      if (this.collected) return;
      
      ctx.save();
      ctx.translate(this.x + this.size/2, this.y + this.size/2);
      ctx.rotate(this.rotation * Math.PI / 180);
      
      // Draw the item using the appropriate draw function
      const drawFunc = drawItemFunctions[this.type];
      if (drawFunc) {
        drawFunc(ctx, 0, 0, this.size, this.hue);
      } else {
        // Fallback - simple present box
        ctx.fillStyle = `hsl(${this.hue}, 80%, 50%)`;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        
        // Ribbon
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -this.size/2);
        ctx.lineTo(0, this.size/2);
        ctx.moveTo(-this.size/2, 0);
        ctx.lineTo(this.size/2, 0);
        ctx.stroke();
      }
      
      ctx.restore();
    }
  }
  
  // Score popup animation
  class ScorePopup {
    constructor(x, y, value) {
      this.x = x;
      this.y = y;
      this.value = value;
      this.opacity = 1;
      this.scale = 1;
      this.life = 60; // frames it will live
    }
    
    update() {
      this.y -= 2;
      this.life--;
      this.opacity = this.life / 60;
      this.scale = 1 + (1 - this.opacity);
      return this.life > 0;
    }
    
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.scale(this.scale, this.scale);
      
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#FFD700'; // Gold color
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.strokeText(`+${this.value}`, 0, 0);
      ctx.fillText(`+${this.value}`, 0, 0);
      
      ctx.restore();
    }
  }
  
  // Collection of score popups
  let scorePopups = [];
  
  function createScorePopup(x, y, value) {
    scorePopups.push(new ScorePopup(x, y, value));
  }
  
  function addScore(points) {
    score += points;
    updateScoreDisplay();
    
    // Check if we've reached the required score
    if (score >= requiredScore && !bigPresentRevealed) {
      revealBigPresent();
    }
  }
  
  function updateScoreDisplay() {
    if (scoreDisplay) {
      scoreDisplay.textContent = `Score: ${score} / ${requiredScore}`;
    }
  }
  
  function initCanvas() {
    // Create canvas for falling items
    canvas = document.getElementById('present-fall-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'present-fall-canvas';
      canvas.style.position = 'fixed';
      canvas.style.left = '0';
      canvas.style.top = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '50'; // Below Santa but above background
      document.body.appendChild(canvas);
    }
    
    ctx = canvas.getContext('2d');
    
    // Create score display
    scoreDisplay = document.getElementById('score-display');
    if (!scoreDisplay) {
      scoreDisplay = document.createElement('div');
      scoreDisplay.id = 'score-display';
      scoreDisplay.style.position = 'fixed';
      scoreDisplay.style.left = '20px';
      scoreDisplay.style.top = '20px';
      scoreDisplay.style.padding = '10px 15px';
      scoreDisplay.style.backgroundColor = 'rgba(0,0,0,0.7)';
      scoreDisplay.style.color = '#FFF';
      scoreDisplay.style.borderRadius = '5px';
      scoreDisplay.style.fontFamily = 'Arial, sans-serif';
      scoreDisplay.style.fontWeight = 'bold';
      scoreDisplay.style.zIndex = '1001';
      scoreDisplay.style.display = 'none'; // Initially hidden
      document.body.appendChild(scoreDisplay);
    }
    
    resize();
    window.addEventListener('resize', resize);
  }
  
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  
  function revealBigPresent() {
    bigPresentRevealed = true;
    
    // Position the big present in the center of the screen
    bigPresent.x = width / 2 - bigPresent.width / 2;
    bigPresent.y = height / 2 - bigPresent.height / 2;
    
    // Make it clickable
    canvas.style.pointerEvents = 'auto';
    
    // Add click event to open the present
    canvas.addEventListener('click', handleCanvasClick);
  }
  
  function handleCanvasClick(e) {
    if (!bigPresentRevealed || bigPresentOpened) return;
    
    // Get click position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Check if click is on the big present
    if (clickX >= bigPresent.x && 
        clickX <= bigPresent.x + bigPresent.width && 
        clickY >= bigPresent.y && 
        clickY <= bigPresent.y + bigPresent.height) {
      openBigPresent();
    }
  }
  
  function openBigPresent() {
    bigPresent.clicked = true;
    
    // Show the surprise image
    const surpriseContainer = document.createElement('div');
    surpriseContainer.id = 'surprise-container';
    surpriseContainer.style.position = 'fixed';
    surpriseContainer.style.left = '50%';
    surpriseContainer.style.top = '50%';
    surpriseContainer.style.transform = 'translate(-50%, -50%)';
    surpriseContainer.style.zIndex = '2000';
    surpriseContainer.style.backgroundColor = 'white';
    surpriseContainer.style.padding = '10px';
    surpriseContainer.style.borderRadius = '10px';
    surpriseContainer.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    
    // Create image element
    const image = document.createElement('img');
    image.src = './img/surprise.jpg'; // Path to your surprise image
    image.alt = 'Surprise!';
    image.style.maxWidth = '90vw';
    image.style.maxHeight = '80vh';
    image.style.display = 'block';
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.display = 'block';
    closeBtn.style.margin = '10px auto 0';
    closeBtn.style.padding = '5px 15px';
    closeBtn.addEventListener('click', () => {
      surpriseContainer.remove();
    });
    
    surpriseContainer.appendChild(image);
    surpriseContainer.appendChild(closeBtn);
    document.body.appendChild(surpriseContainer);
  }
  
  function drawBigPresent(ctx) {
    if (!bigPresentRevealed) return;
    
    const x = bigPresent.x;
    const y = bigPresent.y;
    const width = bigPresent.width;
    const height = bigPresent.height;
    
    ctx.save();
    
    // Box shadow
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
    // Present box
    ctx.fillStyle = '#F00'; // Red present
    ctx.fillRect(x, y, width, height);
    
    // Ribbon
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#FFD700'; // Gold ribbon
    
    // Horizontal ribbon
    ctx.fillRect(x, y + height * 0.4, width, height * 0.2);
    
    // Vertical ribbon
    ctx.fillRect(x + width * 0.4, y, width * 0.2, height);
    
    // Bow
    if (bigPresent.clicked) {
      // Animate opening
      bigPresent.opening += 2;
      if (bigPresent.opening > 100) {
        bigPresent.opening = 100;
        bigPresentOpened = true;
      }
      
      // Draw open lid
      const lidHeight = height * 0.3 * (1 - bigPresent.opening / 100);
      ctx.fillStyle = '#F00';
      ctx.fillRect(x, y, width, lidHeight);
      
      // If fully open, show text
      if (bigPresent.opening >= 100) {
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Happy Birthday!', x + width / 2, y + height / 2);
      }
    } else {
      // Draw bow knot on top
      ctx.beginPath();
      ctx.arc(x + width * 0.5, y + height * 0.5, width * 0.15, 0, Math.PI * 2);
      ctx.fill();
      
      // Click me text
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Click to Open', x + width / 2, y + height / 2);
    }
    
    ctx.restore();
  }
  
  function init() {
    // Access the drawItemFunctions from the global scope
    for (let i = 1; i <= 24; i++) {
      drawItemFunctions[i] = window.drawItemFunctions ? window.drawItemFunctions[i] : null;
    }
    
    initCanvas();
    
    // Create falling items
    fallingItems = Array.from({ length: 20 }, () => new FallingItem(width, height));
    
    // Start animation
    if (!isActive) {
      isActive = true;
      gameLoop();
    }
  }
  
  function gameLoop() {
    if (!isActive) return;
    
    ctx.clearRect(0, 0, width, height);
    
    // Update Santa position from global variable
    if (window.santaX !== undefined) {
      const santaSize = 60;
      const sleighSize = santaSize * 1.2;
      
      // Approximate the sleigh position and size
      santaPosition = {
        x: window.santaX - sleighSize * 0.5,
        y: height - 100,  // Assuming Santa is at the bottom
        width: sleighSize,
        height: santaSize
      };
    }
    
    // Only spawn new items occasionally
    frameCount++;
    if (frameCount % 30 === 0 && fallingItems.length < 50) {
      fallingItems.push(new FallingItem(width, height));
    }
    
    // Update and draw falling items
    fallingItems.forEach(item => {
      item.update();
      item.draw(ctx);
    });
    
    // Update and draw score popups
    scorePopups = scorePopups.filter(popup => {
      const active = popup.update();
      if (active) popup.draw(ctx);
      return active;
    });
    
    // Draw big present if revealed
    drawBigPresent(ctx);
    
    requestAnimationFrame(gameLoop);
  }
  
  function start() {
    score = 0;
    bigPresentRevealed = false;
    bigPresentOpened = false;
    bigPresent.opening = 0;
    
    scoreDisplay.style.display = 'block';
    updateScoreDisplay();
    
    init();
  }
  
  function stop() {
    isActive = false;
    
    // Hide score display
    if (scoreDisplay) {
      scoreDisplay.style.display = 'none';
    }
    
    // Remove canvas
    if (canvas) {
      canvas.remove();
      canvas = null;
    }
    
    // Remove event listener
    window.removeEventListener('resize', resize);
    if (canvas) {
      canvas.removeEventListener('click', handleCanvasClick);
    }
  }
  
  // Expose functions to global scope
  window.presentFall = {
    start: start,
    stop: stop
  };
})(); 