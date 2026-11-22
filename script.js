// ===== ១. មុខងារគណនាថ្លៃផ្ញើរយានជំនិះ =====
const vehicleTypeEl = document.getElementById('vehicleType');
const timeInEl = document.getElementById('timeIn');
const timeOutEl = document.getElementById('timeOut');
const feeRielEl = document.getElementById('feeRiel');
const feeDollarEl = document.getElementById('feeDollar');
const durationInfoEl = document.getElementById('durationInfo');
const calcBtn = document.getElementById('calcBtn');

const EXCHANGE_RATE = 4000; // 1$ = 4000៛

function calculateParkingFee() {
  const vehicle = vehicleTypeEl.value;
  const timeIn = timeInEl.value;
  const timeOut = timeOutEl.value;

  if (!timeIn || !timeOut) {
    durationInfoEl.textContent = 'សូមបញ្ចូលម៉ោងចូល និងម៉ោងចេញជាមុនសិន!';
    return;
  }

  const [inH, inM] = timeIn.split(':').map(Number);
  const [outH, outM] = timeOut.split(':').map(Number);

  let startMinutes = inH * 60 + inM;
  let endMinutes = outH * 60 + outM;

  // ប្រសិនបើម៉ោងចេញតូចជាងម៉ោងចូល (ផ្ញើរឆ្លងយប់) បូកថែម ២៤ ម៉ោង
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  const diffMinutes = endMinutes - startMinutes;
  const totalHours = Math.ceil(diffMinutes / 60); // បង្គត់ឡើងជាម៉ោងពេញ

  let totalRiel = 0;

  if (vehicle === 'car') {
    // ឡាន៖ <= 8h -> 500៛/h, លើស 8h -> 1000៛/h
    if (totalHours <= 8) {
      totalRiel = totalHours * 500;
    } else {
      totalRiel = (8 * 500) + ((totalHours - 8) * 1000);
    }
  } else {
    // ម៉ូតូ៖ <= 8h -> 200៛/h, លើស 8h -> 300៛/h
    if (totalHours <= 8) {
      totalRiel = totalHours * 200;
    } else {
      totalRiel = (8 * 200) + ((totalHours - 8) * 300);
    }
  }

  const totalDollar = totalRiel / EXCHANGE_RATE;

  // បង្ហាញលទ្ធផល
  feeRielEl.value = totalRiel.toLocaleString('en-US');
  feeDollarEl.value = totalDollar.toFixed(2);

  const displayH = Math.floor(diffMinutes / 60);
  const displayM = diffMinutes % 60;
  durationInfoEl.textContent = `រយៈពេលផ្ញើរសរុប៖ ${displayH} ម៉ោង ${displayM} នាទី (គិតជា ${totalHours} ម៉ោង)`;
}

calcBtn.addEventListener('click', calculateParkingFee);

// ===== ២. ចលនាព្រិលធ្លាក់រដូវរងា (Moderate Snowfall) =====
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');
const toggleSnowBtn = document.getElementById('toggleSnowBtn');

let snowActive = true;
let snowflakes = [];
const SNOW_COUNT = 110;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createSnowflakes() {
  snowflakes = [];
  for (let i = 0; i < SNOW_COUNT; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.8 + 1.2,
      speedY: Math.random() * 1.3 + 0.6,
      speedX: Math.random() * 0.6 - 0.3,
      opacity: Math.random() * 0.6 + 0.35
    });
  }
}

function drawSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (snowActive) {
    for (const flake of snowflakes) {
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      ctx.fill();

      flake.y += flake.speedY;
      flake.x += flake.speedX + Math.sin(flake.y * 0.015) * 0.3;

      if (flake.y > canvas.height) {
        flake.y = -5;
        flake.x = Math.random() * canvas.width;
      }
      if (flake.x > canvas.width) flake.x = 0;
      if (flake.x < 0) flake.x = canvas.width;
    }
  }

  requestAnimationFrame(drawSnow);
}

toggleSnowBtn.addEventListener('click', () => {
  snowActive = !snowActive;
  toggleSnowBtn.textContent = snowActive ? '❄️ ព្រិល: កំពុងធ្លាក់' : '❄️ ព្រិល: បានផ្អាក';
  if (!snowActive) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

window.addEventListener('resize', () => {
  resizeCanvas();
  createSnowflakes();
});

resizeCanvas();
createSnowflakes();
drawSnow();
// ===== ៣. មុខងារជ្រើសរើសរូបភាព Background =====
const bgUpload = document.getElementById('bgUpload');

function applyBackground(imageUrl) {
  document.body.style.backgroundImage = `linear-gradient(rgba(10, 15, 25, 0.45), rgba(10, 15, 25, 0.55)), url('${imageUrl}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundAttachment = 'fixed';
}

// ទាញយករូបភាពចាស់មកបង្ហាញវិញ ប្រសិនបើធ្លាប់បានជ្រើសរើស
const savedBg = localStorage.getItem('customBgImage');
if (savedBg) {
  applyBackground(savedBg);
}

bgUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const imageUrl = e.target.result;
    applyBackground(imageUrl);
    try {
      localStorage.setItem('customBgImage', imageUrl);
    } catch (err) {
      // បើរូបភាពធំពេក វានៅតែបង្ហាញធម្មតា គ្រាន់តែមិន Save ទុកក្នុង localStorage
    }
  };
  reader.readAsDataURL(file);
});