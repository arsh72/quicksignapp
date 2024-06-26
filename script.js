const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const backgroundPicker = document.getElementById('backgroundPicker');
const fontSize = document.getElementById('fontSize');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const retrieveButton = document.getElementById('retrieveButton');

let painting = false;
let lineWidth = 5; // Default line width
ctx.lineCap = 'round'; // Rounded line ends

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
retrieveButton.addEventListener('click', retrieveCanvas);
colorPicker.addEventListener('input', changeColor);
backgroundPicker.addEventListener('input', changeBackground);
fontSize.addEventListener('input', changeFontSize);

function startPosition(e) {
    e.preventDefault();
    painting = true;
    const pos = getPointerPosition(e);
    ctx.moveTo(pos.x, pos.y); // Move to initial position
}

function endPosition() {
    painting = false;
    ctx.beginPath(); // Reset path for next drawing session
}

function draw(e) {
    if (!painting) return;
    e.preventDefault();
    const pos = getPointerPosition(e);

    ctx.lineWidth = lineWidth * (fontSize.value / 5); // Adjust line width based on fontSize
    ctx.strokeStyle = colorPicker.value;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    // Move to the current position to minimize the gap
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundPicker.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function saveCanvas() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'signature.png';
    link.click();
}

function retrieveCanvas() {
    const dataURL = localStorage.getItem('signature');
    if (dataURL) {
        const img = new Image();
        img.src = dataURL;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    } else {
        alert('No saved signature found.');
    }
}

function changeColor() {
    ctx.strokeStyle = colorPicker.value;
}

function changeBackground() {
    clearCanvas();
}

function changeFontSize() {
    lineWidth = 5 * (fontSize.value / 5); // Adjust line width based on fontSize
}

window.addEventListener('beforeunload', () => {
    const dataURL = canvas.toDataURL('image/png');
    localStorage.setItem('signature', dataURL);
});
