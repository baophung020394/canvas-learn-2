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
  
  // Add a flag to track if gameLoop is running
  let gameLoopRunning = false;
  
  // Falling item class
  class FallingItem {
    constructor(width, height) {
      this.reset(width, height);
    }
    
    reset(width, height) {
      this.x = Math.random() * (width - itemSize);
      this.y = Math.random() * -300 - itemSize; // Start above the screen
      // Slow down the fall speed
      this.speed = 0.7 + Math.random() * 2;
      // Ensure type is a valid number between 1-24
      this.type = Math.floor(Math.random() * itemCount) + 1; // 1-24
      // Ensure value equals the type
      this.value = this.type; // Score value equals the item type
      this.collected = false;
      this.size = itemSize;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 4 - 2;
      this.hue = Math.random() * 360;
      
      // Collection animation properties
      this.collectAnimation = 0;
    }
    
    update() {
      // Handle collection animation
      if (this.collected) {
        this.collectAnimation += 5;
        if (this.collectAnimation >= 100) {
          this.reset(width, height);
        }
        return;
      }
      
      this.y += this.speed;
      this.rotation += this.rotationSpeed;
      
      // Check if item is below screen
      if (this.y > height + itemSize) {
        this.reset(width, height);
      }
      
      // Check collision with Santa
      if (this.checkCollision()) {
        this.collected = true;
        // Log the collision for debugging
        console.log(`Collision detected! Item type: ${this.type}, value: ${this.value}, position: (${Math.round(this.x)}, ${Math.round(this.y)})`);
        addScore(this.value);
        createScorePopup(this.x, this.y, this.value);
      }
    }
    
    checkCollision() {
      // Make sure Santa position is defined
      if (!santaPosition || typeof santaPosition.x === 'undefined' || 
          santaPosition.x === 0 && santaPosition.y === 0 && 
          santaPosition.width === 0 && santaPosition.height === 0) {
        console.warn("Invalid Santa position for collision check:", santaPosition);
        return false;
      }
      
      // Very simple and forgiving collision detection - just check if the item
      // is anywhere near Santa's sleigh area with extra padding
      const itemCenterX = this.x + this.size/2;
      const itemCenterY = this.y + this.size/2;
      
      // The actual sleigh position on screen
      const sleighLeft = santaPosition.x;
      const sleighRight = santaPosition.x + santaPosition.width;
      const sleighTop = santaPosition.y;
      const sleighBottom = santaPosition.y + santaPosition.height;
      
      // Add extra padding around the sleigh for more forgiving collection
      const padding = this.size * 0.7; // Increased padding for more forgiving collision
      
      // For items that are close to Santa, log their positions for debugging
      const isNearSanta = 
        Math.abs(itemCenterY - sleighTop) < 100 && 
        Math.abs(itemCenterX - (sleighLeft + (sleighRight - sleighLeft)/2)) < 100;
      
      if (isNearSanta) {
        console.log(`Item near Santa - ID: ${this.type}, Item: (${Math.round(itemCenterX)}, ${Math.round(itemCenterY)}), Santa: L${Math.round(sleighLeft)} R${Math.round(sleighRight)} T${Math.round(sleighTop)} B${Math.round(sleighBottom)}`);
      }
      
      // Check if the item's center is within the padded sleigh area
      const isColliding = !this.collected && 
             itemCenterX >= sleighLeft - padding &&
             itemCenterX <= sleighRight + padding &&
             itemCenterY >= sleighTop - padding && 
             itemCenterY <= sleighBottom + padding;
      
      return isColliding;
    }
    
    draw(ctx) {
      if (this.collected) {
        // Draw collection animation - shrink and fade out
        const scale = 1 + (this.collectAnimation / 50);
        const alpha = 1 - (this.collectAnimation / 100);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(this.x + this.size/2, this.y + this.size/2);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(scale, scale);
        
        // Draw a sparkle effect
        if (this.collectAnimation < 50) {
          ctx.fillStyle = 'white';
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const dist = (this.size/2) * (this.collectAnimation / 50);
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
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
        return;
      }
      
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
      
      // Debug info for hitbox visualization
      if (frameCount % 180 === 0 && Math.random() < 0.1) {  // Show only occasionally
        ctx.strokeStyle = 'rgba(255,255,0,0.3)';
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText(`${this.type}`, this.x, this.y - 5);
      }
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
    // Validate points is a number
    if (typeof points !== 'number' || isNaN(points) || points <= 0) {
      console.error(`Invalid points value: ${points}`);
      return;
    }
    
    // Ensure score is a number and increment it
    const oldScore = score;
    score = (parseInt(score) || 0) + points;
    console.log(`Score updated: ${oldScore} + ${points} = ${score}`);
    
    // Update the display with the new score
    updateScoreDisplay();
    
    // Play a collection sound effect
    playCollectionSound(points);
    
    // Check if we've reached the required score
    if (score >= requiredScore && !bigPresentRevealed) {
      revealBigPresent();
    }
  }
  
  // Simple sound effect for item collection
  function playCollectionSound(points) {
    try {
      const audio = new Audio();
      // Higher pitched sound for higher value items
      const frequency = 200 + (points * 25); 
      audio.src = `data:audio/wav;base64,UklGRisAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQcAAAD//wAAAAA=`;
      audio.volume = 0.2; // Keep the volume low
      audio.play().catch(err => {
        // Silently ignore autoplay restrictions
      });
    } catch (e) {
      // Silently ignore if audio fails
    }
  }
  
  function updateScoreDisplay() {
    if (scoreDisplay) {
      // Make score display more visible with larger text and colors
      scoreDisplay.textContent = `Score: ${score} / ${requiredScore}`;
      scoreDisplay.style.fontSize = '18px';
      scoreDisplay.style.fontWeight = 'bold';
      scoreDisplay.style.padding = '10px 15px';
      
      // Add a temporary highlight effect when score changes
      scoreDisplay.style.transition = 'background-color 0.3s';
      scoreDisplay.style.backgroundColor = 'rgba(255,215,0,0.3)';
      
      // Reset background after a brief moment
      setTimeout(() => {
        if (scoreDisplay) {
          scoreDisplay.style.backgroundColor = 'rgba(0,0,0,0.7)';
        }
      }, 300);
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
      scoreDisplay.style.color = '#FFFFFF';
      scoreDisplay.style.borderRadius = '5px';
      scoreDisplay.style.fontFamily = 'Arial, sans-serif';
      scoreDisplay.style.fontWeight = 'bold';
      scoreDisplay.style.fontSize = '18px';
      scoreDisplay.style.zIndex = '1001';
      scoreDisplay.style.textShadow = '1px 1px 2px #000';
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
  
  // This function is now a helper function and is not called directly
  function init() {
    // Access the drawItemFunctions from the global scope
    for (let i = 1; i <= 24; i++) {
      drawItemFunctions[i] = window.drawItemFunctions ? window.drawItemFunctions[i] : null;
    }
    
    initCanvas();
    
    // Create falling items - reduce count to 10
    fallingItems = Array.from({ length: 10 }, () => new FallingItem(width, height));
  }
  
  function start() {
    score = 0;
    bigPresentRevealed = false;
    bigPresentOpened = false;
    bigPresent.opening = 0;
    
    // Initialize canvas and scoreDisplay first
    initCanvas();
    
    // Access the drawItemFunctions from the global scope
    for (let i = 1; i <= 24; i++) {
      drawItemFunctions[i] = window.drawItemFunctions ? window.drawItemFunctions[i] : null;
    }
    
    // Then access scoreDisplay
    if (scoreDisplay) {
      scoreDisplay.style.display = 'block';
      updateScoreDisplay();
    }
    
    // Start the game loop if not already active
    if (!isActive) {
      isActive = true;
      
      // Create falling items - reduce the initial count from 20 to 10
      fallingItems = Array.from({ length: 10 }, () => new FallingItem(width, height));
      
      // Make sure we don't start multiple game loops
      if (!gameLoopRunning) {
        gameLoopRunning = true;
        gameLoop();
      }
    }
  }
  
  function gameLoop() {
    if (!isActive) {
      gameLoopRunning = false;
      return;
    }
    
    // Make sure canvas and context exist
    if (!canvas || !ctx) {
      isActive = false;
      gameLoopRunning = false;
      return;
    }
    
    ctx.clearRect(0, 0, width, height);
    
    // Update Santa position from global variable
    // IMPORTANT: Make sure we can access the global santaX variable
    const globalSantaX = window.santaX;
    
    if (typeof globalSantaX !== 'undefined' && globalSantaX !== null) {
      // Log the actual santaX value periodically
      if (frameCount % 60 === 0) {
        console.log("Debug - Santa position:", window.santaX);
      }
      
      const santaSize = 60;
      const sleighSize = santaSize * 2.0; // Reduced width for more accurate collision
      
      // Update santaPosition for collision detection
      santaPosition = {
        x: globalSantaX - sleighSize * 0.5,
        y: height - 100,  // Adjusted to match Santa's actual position
        width: sleighSize,
        height: santaSize
      };
      
      // Always show the collision box for debugging
      ctx.strokeStyle = 'rgba(255,0,0,0.2)';
      ctx.strokeRect(
        santaPosition.x, 
        santaPosition.y, 
        santaPosition.width, 
        santaPosition.height
      );
    } else {
      console.warn("Santa's position is undefined or null:", globalSantaX);
      
      // Set a default position if santaX is not available
      // This ensures collision detection can still work
      santaPosition = {
        x: width / 2 - 60,
        y: height - 100,
        width: 120,
        height: 60
      };
    }
    
    // Only spawn new items occasionally - reduce spawn rate
    frameCount++;
    // Changed from mod 30 to mod 60, and max items from 50 to 25
    if (frameCount % 60 === 0 && fallingItems.length < 25) {
      fallingItems.push(new FallingItem(width, height));
    }
    
    // Update and draw falling items
    fallingItems.forEach(item => {
      // Fix the issue with all items having the same ID
      // Make sure each item has a proper type between 1-24
      if (item.type === undefined || item.type < 1 || item.type > 24) {
        item.type = Math.floor(Math.random() * itemCount) + 1;
        item.value = item.type;
      }
      
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
  
  function stop() {
    isActive = false;
    gameLoopRunning = false;
    
    // Hide score display
    if (scoreDisplay) {
      scoreDisplay.style.display = 'none';
    }
    
    // Remove canvas
    if (canvas) {
      // Remove event listener for clicks
      canvas.removeEventListener('click', handleCanvasClick);
      
      // Remove the canvas from the DOM
      canvas.remove();
      canvas = null;
    }
    
    // Remove event listener
    window.removeEventListener('resize', resize);
    
    // Clear falling items
    fallingItems = [];
    scorePopups = [];
  }
  
  // Expose functions to global scope
  window.presentFall = {
    start: start,
    stop: stop
  };
})(); 