const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

async function setupCamera() {
  // Bật camera
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => resolve(video);
  });
}

// Hàm vẽ avatar hoạt họa
function drawAvatar(landmarks) {
  // 1) Xóa canvas cũ
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2) Ví dụ: lấy một vài điểm chính
  //    - Mắt trái: (xEyeL, yEyeL)
  //    - Mắt phải: (xEyeR, yEyeR)
  //    - Mũi: (xNose, yNose)
  //    - Miệng: (xMouth, yMouth)
  // Chúng ta tìm ID landmark tương ứng trong MediaPipe:
  //   * Mắt trái: cỡ 33..133
  //   * Mắt phải: cỡ 362..263
  //   * Mũi đỉnh: 1 (hoặc 4)...
  // v.v. Tùy thuộc bạn muốn lấy vị trí nào.

  // Ở đây, ví dụ lấy tạm 1 điểm mũi (ID = 4),
  // và 2 điểm mắt (ID = 33 và 263).
  const nose = landmarks[4];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];

  if (!nose || !leftEye || !rightEye) return;

  // Lấy từng tọa độ x, y
  const [xNose, yNose] = nose;
  const [xLeftEye, yLeftEye] = leftEye;
  const [xRightEye, yRightEye] = rightEye;

  // 3) Bắt đầu vẽ theo ý tưởng riêng:
  //    Vẽ một hình đầu, 2 mắt hình tròn, mũi, miệng, râu v.v.
  //    Ta sẽ dùng Canvas 2D basics: fillRect, arc, fill, stroke...

  // Vẽ mặt (một hình tròn lấy mũi làm trung tâm ví dụ)
  ctx.fillStyle = "#FFDAB9"; // màu da tùy chọn
  ctx.beginPath();
  ctx.arc(xNose, yNose, 60, 0, 2 * Math.PI);
  ctx.fill();

  // Vẽ mắt trái
  ctx.fillStyle = "#000"; // màu đen
  ctx.beginPath();
  ctx.arc(xLeftEye, yLeftEye, 10, 0, 2 * Math.PI);
  ctx.fill();

  // Vẽ mắt phải
  ctx.beginPath();
  ctx.arc(xRightEye, yRightEye, 10, 0, 2 * Math.PI);
  ctx.fill();

  // Vẽ mũi (một chấm nhỏ)
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(xNose, yNose, 5, 0, 2 * Math.PI);
  ctx.fill();

  // v.v... Vẽ thêm râu, tóc, môi, tùy ý
}

async function loadModelAndDetect() {
  // Tải model Face Landmarks
  const model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
  );

  async function detect() {
    if (video.readyState === 4) {
      canvas.width = 320; // Bằng kích thước đã CSS
      canvas.height = 480;

      // Dò khuôn mặt
      const predictions = await model.estimateFaces({
        input: video,
        returnTensors: false,
        flipHorizontal: false,
      });

      if (predictions && predictions.length > 0) {
        // Lấy landmark của khuôn mặt đầu tiên (nếu có nhiều mặt, ta lặp)
        const keypoints = predictions[0].scaledMesh;
        drawAvatar(keypoints);
      } else {
        // Nếu không có mặt nào, xóa canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(detect);
  }
  detect();
}

(async () => {
  await setupCamera();
  await loadModelAndDetect();
})();
