const canvasContainer = document.getElementById('canvasContainer');
const colorPicker = document.getElementById('colorPicker');
const brushSizeInput = document.getElementById('brushSize');
const penTypeSelect = document.getElementById('penType');
const toggleEraserBtn = document.getElementById('toggleEraser');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const clearBtn = document.getElementById('clear');
const downloadBtn = document.getElementById('download');
const addLayerBtn = document.getElementById('addLayer');
const layerList = document.getElementById('layerList');
const toggleSymmetryBtn = document.getElementById('toggleSymmetry');

let layers = [];
let currentLayerIndex = 0;
let isDrawing = false;
let isEraser = false;
let lastPoint = null;
let rainbowHue = 0;
let symmetry = false;

function createLayer(index) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvasContainer.offsetWidth;
    canvas.height = canvasContainer.offsetHeight;
    canvas.className = 'absolute top-0 left-0';
    canvas.style.zIndex = index;
    canvasContainer.appendChild(canvas);

    const layerObj = {
    canvas,
    ctx,
    paths: [],
    undonePaths: []
    };

    layers.push(layerObj);
    updateLayerList();
    switchLayer(index);
}

function updateLayerList() {
    layerList.innerHTML = '';
    layers.forEach((layer, index) => {
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center gap-2';

    const btn = document.createElement('button');
    btn.textContent = `Layer ${index + 1}`;
    btn.className = `flex-grow text-left px-4 py-2 rounded ${index === currentLayerIndex ? 'bg-blue-700' : 'bg-gray-700'}`;
    btn.onclick = () => switchLayer(index);

    const delBtn = document.createElement('button');
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delBtn.title = `Delete Layer ${index + 1}`;
    delBtn.className = 'bg-red-600 hover:bg-red-700 px-2 py-2 rounded';
    delBtn.onclick = (e) => {
        e.stopPropagation();
        deleteLayer(index);
    };

    div.appendChild(btn);
    div.appendChild(delBtn);
    layerList.appendChild(div);
    });
}

function switchLayer(index) {
    if(index < 0 || index >= layers.length) return;
    currentLayerIndex = index;
    layers.forEach((l, i) => {
    l.canvas.style.pointerEvents = i === currentLayerIndex ? 'auto' : 'none';
    });
    updateLayerList();
}

function deleteLayer(index) {
    if (layers.length === 1) {
    alert("Cannot delete the only layer!");
    return;
    }
    const layer = layers[index];
    canvasContainer.removeChild(layer.canvas);
    layers.splice(index, 1);

    // Fix zIndex and re-append canvases to keep stacking order
    layers.forEach((l, i) => {
    l.canvas.style.zIndex = i;
    canvasContainer.appendChild(l.canvas);
    });

    if(currentLayerIndex === index){
    currentLayerIndex = Math.max(0, index - 1);
    } else if(currentLayerIndex > index){
    currentLayerIndex--;
    }
    updateLayerList();
    switchLayer(currentLayerIndex);
}

function getCurrentContext() {
    return layers[currentLayerIndex].ctx;
}

function draw(x, y) {
    const ctx = getCurrentContext();
    const size = brushSizeInput.value;

    if (!lastPoint) {
    lastPoint = { x, y };
    return;
    }

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, x, y);

    if (isEraser) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.shadowBlur = 0;
    } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    if (penTypeSelect.value === 'rainbow') {
        ctx.strokeStyle = `hsl(${rainbowHue}, 100%, 50%)`;
        rainbowHue = (rainbowHue + 1) % 360;
    } else if (penTypeSelect.value === 'glow') {
        ctx.shadowBlur = 15;
        ctx.shadowColor = colorPicker.value;
        ctx.strokeStyle = colorPicker.value;
    } else {
        ctx.strokeStyle = colorPicker.value;
    }
    }

    ctx.lineWidth = size;
    ctx.stroke();
    ctx.closePath();

    if(symmetry){
    const symX = ctx.canvas.width - x;
    const symLastX = ctx.canvas.width - lastPoint.x;
    ctx.beginPath();
    ctx.moveTo(symLastX, lastPoint.y);
    ctx.quadraticCurveTo(symLastX, lastPoint.y, symX, y);

    if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.shadowBlur = 0;
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 0;
        if (penTypeSelect.value === 'rainbow') {
        ctx.strokeStyle = `hsl(${(rainbowHue + 180) % 360}, 100%, 50%)`; // offset hue for symmetry
        } else if (penTypeSelect.value === 'glow') {
        ctx.shadowBlur = 15;
        ctx.shadowColor = colorPicker.value;
        ctx.strokeStyle = colorPicker.value;
        } else {
        ctx.strokeStyle = colorPicker.value;
        }
    }
    ctx.lineWidth = size;
    ctx.stroke();
    ctx.closePath();
    }

    lastPoint = { x, y };
}

function startDrawing(e) {
    isDrawing = true;
    lastPoint = { x: e.offsetX, y: e.offsetY };
}

function stopDrawing() {
    if (isDrawing) {
    const layer = layers[currentLayerIndex];
    // Save current canvas state as image data for undo
    layer.paths.push(layer.ctx.getImageData(0, 0, canvasContainer.offsetWidth, canvasContainer.offsetHeight));
    layer.undonePaths = [];
    }
    isDrawing = false;
    lastPoint = null;
}

function undo() {
    const layer = layers[currentLayerIndex];
    if (layer.paths.length > 0) {
    layer.undonePaths.push(layer.paths.pop());
    redraw();
    }
}

function redo() {
    const layer = layers[currentLayerIndex];
    if (layer.undonePaths.length > 0) {
    layer.paths.push(layer.undonePaths.pop());
    redraw();
    }
}

function redraw() {
    layers.forEach(layer => {
    layer.ctx.clearRect(0, 0, canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    layer.paths.forEach(imageData => {
        layer.ctx.putImageData(imageData, 0, 0);
    });
    });
}

function clearCanvas() {
    const ctx = getCurrentContext();
    ctx.clearRect(0, 0, canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    layers[currentLayerIndex].paths = [];
    layers[currentLayerIndex].undonePaths = [];
}

function downloadImage() {
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = canvasContainer.offsetWidth;
    compositeCanvas.height = canvasContainer.offsetHeight;
    const compositeCtx = compositeCanvas.getContext('2d');

    layers.forEach(layer => {
    compositeCtx.drawImage(layer.canvas, 0, 0);
    });

    const link = document.createElement('a');
    link.download = 'neural-sketch.png';
    link.href = compositeCanvas.toDataURL();
    link.click();
}

canvasContainer.addEventListener('mousedown', startDrawing);
canvasContainer.addEventListener('mouseup', stopDrawing);
canvasContainer.addEventListener('mouseout', stopDrawing);
canvasContainer.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    draw(e.offsetX, e.offsetY);
});

toggleEraserBtn.onclick = () => {
    isEraser = !isEraser;
    toggleEraserBtn.textContent = isEraser ? 'Eraser: ON' : 'Eraser: OFF';
};

undoBtn.onclick = undo;
redoBtn.onclick = redo;
clearBtn.onclick = clearCanvas;
downloadBtn.onclick = downloadImage;
addLayerBtn.onclick = () => createLayer(layers.length);
toggleSymmetryBtn.onclick = () => {
    symmetry = !symmetry;
    toggleSymmetryBtn.textContent = symmetry ? 'Symmetry: ON' : 'Symmetry: OFF';
};

// Initialize one default layer
createLayer(0);