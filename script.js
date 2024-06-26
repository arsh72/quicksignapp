const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');

let painting = false;

function getPointerPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', startPosition);
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', draw);

clearButton.addEventListener('click', clearCanvas);
saveButton.addEventListener('click', saveCanvas);
colorPicker.addEventListener('input', changeColor);

function startPosition(e) {
    e.preventDefault();
    painting = true;
    draw(e);
}

function endPosition() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;
    e.preventDefault();
    const pos = getPointerPosition(e);

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveCanvas() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'signature.png';
    link.click();
}

function changeColor() {
    ctx.strokeStyle = colorPicker.value;
}
