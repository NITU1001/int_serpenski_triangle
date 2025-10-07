const canvas = document.getElementById('sierpinski');
const ctx = canvas.getContext('2d');
const depthSlider = document.getElementById('depth');
const depthValue = document.getElementById('depth-value');
const colorPicker = document.getElementById('color');
const modeToggle = document.getElementById('mode-toggle');
const modeLabel = document.getElementById('mode-label');

function drawTriangle(ax, ay, bx, by, cx, cy, color) {
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function sierpinski(ax, ay, bx, by, cx, cy, depth, color) {
    if (depth === 0) {
        drawTriangle(ax, ay, bx, by, cx, cy, color);
    } else {
        const abx = (ax + bx) / 2;
        const aby = (ay + by) / 2;
        const bcx = (bx + cx) / 2;
        const bcy = (by + cy) / 2;
        const cax = (cx + ax) / 2;
        const cay = (cy + ay) / 2;

        sierpinski(ax, ay, abx, aby, cax, cay, depth - 1, color);
        sierpinski(bx, by, bcx, bcy, abx, aby, depth - 1, color);
        sierpinski(cx, cy, cax, cay, bcx, bcy, depth - 1, color);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const depth = parseInt(depthSlider.value, 10);
    const color = colorPicker.value;
    // Calculate triangle points
    const ax = canvas.width / 2, ay = 20;
    const bx = 20, by = canvas.height - 20;
    const cx = canvas.width - 20, cy = canvas.height - 20;
    sierpinski(ax, ay, bx, by, cx, cy, depth, color);
}

function animateShadow() {
    const color = colorPicker.value;
    function lightenColor(hex, amt) {
        let num = parseInt(hex.replace('#',''),16);
        let r = Math.min(255, (num >> 16) + amt);
        let g = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        let b = Math.min(255, (num & 0x0000FF) + amt);
        return `rgba(${r},${g},${b},0.70)`;
    }
    const glowColor = lightenColor(color, 72);
    let shadow = `0 0 0 6px ${glowColor}, 0 2px 18px 0 rgba(0,0,0,0.18)`;
    if (document.body.classList.contains('dark-mode')) {
        shadow += ', 0 0 8px 2px rgba(255,255,255,0.15)';
    }
    canvas.style.boxShadow = shadow;
    canvas.classList.add('elevated');
    setTimeout(() => {
        canvas.style.boxShadow = '';
        canvas.classList.remove('elevated');
    }, 700);
}

function setControlsColor(hexColor) {
    document.documentElement.style.setProperty('--triangle-color', hexColor);
    document.documentElement.style.setProperty('--range-bar-color', hexColor);

    if (document.body.classList.contains('dark-mode')) {
        document.documentElement.style.setProperty('--toggle-bar-color', '#fff');
        document.documentElement.style.setProperty('--toggle-ball-color', hexColor);
        document.documentElement.style.setProperty('--range-thumb-color', hexColor);
        document.documentElement.style.setProperty('--range-thumb-shadow', '0 2px 8px rgba(255,255,255,0.15)');
    } else {
        document.documentElement.style.setProperty('--toggle-bar-color', hexColor);
        document.documentElement.style.setProperty('--toggle-ball-color', '#fff');
        document.documentElement.style.setProperty('--range-thumb-color', '#fff');
        document.documentElement.style.setProperty('--range-thumb-shadow', '0 2px 8px rgba(0,0,0,0.15)');
    }
}

depthSlider.addEventListener('input', () => {
    depthValue.textContent = depthSlider.value;
    draw();
    animateShadow();
});
colorPicker.addEventListener('input', () => {
    setControlsColor(colorPicker.value);
    draw();
    animateShadow();
});

modeToggle.addEventListener('change', () => {
    if (modeToggle.checked) {
        document.body.classList.add('dark-mode');
        modeLabel.textContent = 'Dark Mode';
    } else {
        document.body.classList.remove('dark-mode');
        modeLabel.textContent = 'Light Mode';
    }
    setControlsColor(colorPicker.value);
    draw();
});

setControlsColor(colorPicker.value);
draw();