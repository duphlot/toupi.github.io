// Số lượng sọc và lượn sóng
let stripeCount = 10;
let waveCount = 15;
if (window.innerWidth <= 490) {
    waveCount = 10;
    stripeCount = 8;
}

// Thêm các sọc vào phần mái che
const awning = document.getElementById('awning');
for (let i = 0; i < stripeCount; i++) {
    const stripe = document.createElement('div');
    stripe.classList.add('stripe');
    awning.appendChild(stripe);
}

const drawwave = document.getElementById('draw-wave');
const waves = document.createElement('div');
waves.classList.add('waves');
drawwave.appendChild(waves);
for (let i = 0; i < waveCount; i++) {
    const wave = document.createElement('div');
    wave.classList.add('wave');
    waves.appendChild(wave);
}