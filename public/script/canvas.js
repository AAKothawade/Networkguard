const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.append(canvas);
let rects = [];
let SIZE = 0;
let SPACE = 0;
let width = 0;
let height = 0;
let columns = 0;
let rows = 0;
let mouseX = -1;
let mouseY = -1;
let smoothMouseX = 0;
let smoothMouseY = 0;
let img;
let tID = 0;
function onMouseMove(e) {
    clearTimeout(tID);
    mouseX = e.pageX - window.pageXOffset;
    mouseY = e.pageY - window.pageYOffset;
    tID = setTimeout(() => {
        mouseX = -1;
        mouseY = -1;
    }, 350);
}
window.addEventListener("mousemove", (e) => {
    onMouseMove(e);
    smoothMouseX = mouseX;
    smoothMouseY = mouseY;
    window.addEventListener("mousemove", onMouseMove);
}, { once: true });
function onResize() {
    rects = [];
    width = window.innerWidth;
    height = window.innerHeight;
    if (width < 768) {
        SIZE = 2;
        SPACE = 2;
    }
    else {
        SIZE = 3;
        SPACE = 2;
    }
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = "#fff";
    columns = Math.ceil(width / SIZE / SPACE);
    rows = Math.ceil(height / SIZE / SPACE);
    for (let i = 0; i < columns * rows; i++) {
        const col = i % columns;
        const row = Math.floor(i / columns);
        rects.push({
            x: col * SPACE * SIZE,
            y: row * SPACE * SIZE,
            delay: Math.random() * 15000,
            duration: Math.random() * 5000 + 1000,
            c: [255, 255, 255, 25],
            row,
            col
        });
    }
    img = ctx.createImageData(width, height);
}
const colors = [
    [26, 188, 156], // Turquoise
    [46, 204, 113], // Emerald
    [52, 152, 219], // Peter River
    [155, 89, 182], // Amethyst
    [52, 73, 94], // Wet Asphalt
    [22, 160, 133], // Green Sea
    [39, 174, 96], // Nephritis
    [41, 128, 185], // Belize Hole
    [142, 68, 173], // Wisteria
    [44, 62, 80], // Midnight Blue
    [241, 196, 15], // Sun Flower
    [230, 126, 34], // Carrot
    [231, 76, 60], // Alizarin
    [236, 240, 241], // Clouds
    [243, 156, 18], // Orange
    [211, 84, 0], // Pumpkin
    [192, 57, 43], // Pomegranate
    [254, 174, 188]
];
let then = performance.now() * -20;
function animate(now) {
    requestAnimationFrame(animate);
    const diff = now - then;
    then = now - diff;
    const data = img.data;
    if (mouseX !== -1) {
        smoothMouseX += (mouseX - smoothMouseX) * 0.13;
        smoothMouseY += (mouseY - smoothMouseY) * 0.13;
    }
    const dd = Math.min(Math.max(Math.hypot(smoothMouseX - mouseX, smoothMouseY - mouseY) * 0.7, 25), 140);
    for (let i = 0; i < rects.length; i++) {
        const r = rects[i];
        const time = r.duration + r.delay;
        const delta = diff % time;
        const finished = delta > time;
        const c = r.c;
        if (!finished && c[0] !== 255) {
            c[3] -= c[3] * 0.02;
        }
        if (c[3] <= 50) {
            c[0] = 18;
            c[1] = 248;
            c[2] = 173;
            c[3] = delta > r.delay ? 50 : 25;
        }
        if (mouseX != -1 && Math.random() > 0.4) {
            const d = Math.hypot(smoothMouseX - r.x, smoothMouseY - r.y);
            if (d < dd * Math.random()) {
                const newC = colors[Math.floor(Math.random() * colors.length)];
                c[0] = newC[0];
                c[1] = newC[1];
                c[2] = newC[2];
                c[3] = 230 * Math.random() + 25;
            }
        }
        for (let j = 0; j <= SIZE; j++) {
            for (let k = 0; k <= SIZE; k++) {
                // const n = (r.x + j + (r.y + k + j) * width) * 4;
                const n = (r.x + j + (r.y + k) * width) * 4;
                data[n] = c[0];
                data[n + 1] = c[1];
                data[n + 2] = c[2];
                data[n + 3] = c[3];
            }
        }
    }
    ctx.putImageData(img, 0, 0);
}
function start() {
    onResize();
    requestAnimationFrame(animate);
}
addEventListener("resize", onResize);
document.fonts.ready.then(start);
