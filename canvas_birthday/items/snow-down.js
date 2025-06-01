(function (imageList = []) {
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  class Snowflake {
    constructor(width, height, images) {
      this.images = images;
      this.reset(width, height);
    }
    reset(width, height) {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.radius = lerp(1.5, 4.5, Math.random());
      this.speed = lerp(1, 2.5, Math.random());
      this.wind = lerp(-0.5, 0.5, Math.random());
      this.opacity = lerp(0.6, 1, Math.random());
      this.t = Math.random();
      this.size = lerp(20, 60, Math.random());
      this.image = this.images.length
        ? this.images[Math.floor(Math.random() * this.images.length)]
        : null;
    }
    update(width, height) {
      this.t += 0.01 + Math.random() * 0.01;
      this.x += this.wind + Math.sin(this.t) * 0.3;
      this.y += this.speed;
      if (this.y - this.radius > height) {
        this.reset(width, height);
        this.y = -this.radius;
      }
      if (this.x < -this.radius) this.x = width + this.radius;
      if (this.x > width + this.radius) this.x = -this.radius;
    }
    draw(ctx) {
      if (this.image) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
          this.image,
          this.x - this.size / 2,
          this.y - this.size / 2,
          this.size,
          this.size
        );
        ctx.restore();
      } else {
        draw.circle(ctx, this.x, this.y, this.radius, {
          fillStyle: `rgba(255,255,255,${this.opacity})`,
        });
      }
    }
  }

  const SNOW_COUNT = 80;
  let snowflakes = [];
  let width = 0,
    height = 0;
  let canvas, ctx;
  let loopStarted = false;

  function resize() {
    width = document.body.clientWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function initCanvas() {
    canvas = document.getElementById("snow-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "snow-canvas";
      canvas.style.position = "fixed";
      canvas.style.left = 0;
      canvas.style.top = 0;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = 1000;
      canvas.style.background = "transparent";
      canvas.style.backdropFilter = "none";
      document.body.appendChild(canvas);
      ctx = canvas.getContext("2d");
      resize();
      window.addEventListener("resize", resize);
    }
  }

  function regenerateSnowflakes() {
    snowflakes = Array.from(
      { length: SNOW_COUNT },
      () => new Snowflake(width, height, imageList)
    );
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (const snow of snowflakes) {
      snow.update(width, height);
      snow.draw(ctx);
    }
    requestAnimationFrame(loop);
  }

  if (typeof window !== "undefined" && typeof draw !== "undefined") {
    window.addEventListener("DOMContentLoaded", () => {
      initCanvas();
      regenerateSnowflakes();
      if (!loopStarted) {
        loopStarted = true;
        requestAnimationFrame(loop);
      }
    });
  }

  // ✅ Public function
  window.initSnowWithImages = function (images) {
    imageList = images;
    initCanvas(); // nếu canvas chưa có thì tạo
    regenerateSnowflakes(); // làm mới tuyết với hình mới
  };
})();

// // Tuyết rơi toàn màn hình sử dụng draw.circle và lerp
// (function () {
//   // Lerp function
//   function lerp(a, b, t) {
//     return a + (b - a) * t;
//   }

//   // Snowflake class
//   class Snowflake {
//     constructor(width, height) {
//       this.reset(width, height);
//     }
//     reset(width, height) {
//       this.x = Math.random() * width;
//       this.y = Math.random() * -height;
//       this.radius = lerp(1.5, 4.5, Math.random());
//       this.speed = lerp(1, 2.5, Math.random());
//       this.wind = lerp(-0.5, 0.5, Math.random());
//       this.opacity = lerp(0.6, 1, Math.random());
//       this.t = Math.random();
//     }
//     update(width, height) {
//       this.t += 0.01 + Math.random() * 0.01;
//       this.x += this.wind + Math.sin(this.t) * 0.3;
//       this.y += this.speed;
//       if (this.y - this.radius > height) {
//         this.reset(width, height);
//         this.y = -this.radius;
//       }
//       if (this.x < -this.radius) this.x = width + this.radius;
//       if (this.x > width + this.radius) this.x = -this.radius;
//     }
//     draw(ctx) {
//       draw.circle(ctx, this.x, this.y, this.radius, {
//         fillStyle: `rgba(255,255,255,${this.opacity})`,
//       });
//     }
//   }

//   // Main snow effect
//   const SNOW_COUNT = 80;
//   let snowflakes = [];
//   let width = 0, height = 0;
//   let canvas, ctx;

//   function resize() {
//     width = document.body.clientWidth;
//     height = window.innerHeight;
//     canvas.width = width;
//     canvas.height = height;
//   }

//   function init() {
//     canvas = document.createElement('canvas');
//     canvas.style.position = 'fixed';
//     canvas.style.left = 0;
//     canvas.style.top = 0;
//     canvas.style.width = '100vw';
//     canvas.style.height = '100vh';
//     canvas.style.pointerEvents = 'none';
//     canvas.style.zIndex = 1000;
//     canvas.style.background = 'transparent'; // Đảm bảo nền trong suốt
//     canvas.style.backdropFilter = 'none'; // Không hiệu ứng nền
//     document.body.appendChild(canvas);
//     ctx = canvas.getContext('2d');
//     resize();
//     snowflakes = Array.from({ length: SNOW_COUNT }, () => new Snowflake(width, height));
//     window.addEventListener('resize', resize);
//     requestAnimationFrame(loop);
//   }

//   function loop() {
//     ctx.clearRect(0, 0, width, height);
//     for (const snow of snowflakes) {
//       snow.update(width, height);
//       snow.draw(ctx);
//     }
//     requestAnimationFrame(loop);
//   }

//   if (typeof window !== 'undefined' && typeof draw !== 'undefined') {
//     window.addEventListener('DOMContentLoaded', init);
//   }
// })();
