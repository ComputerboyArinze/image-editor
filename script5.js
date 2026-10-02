
/* =========================================================
   1. ELEMENT REFERENCES
   ========================================================= */
const img = document.getElementById('editorImage');
const wrapper = document.getElementById('imageWrapper');
const cropOverlay = document.getElementById('cropOverlay');
const textOverlay = document.getElementById('textOverlay');
const textEditor = document.getElementById('textEditor');
const fileInput = document.getElementById('fileInput');
const toastEl = document.getElementById('toast');
const applyCropBtn = document.getElementById('applyCropBtn');
const applyTextBtn = document.getElementById('applyTextBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const sliderContainer = document.getElementById('sliderContainer');
const sliderThumb = document.getElementById('sliderThumb');

/* =========================================================
   2. STATE
   ========================================================= */
let filters = { 
    brightness: 1, 
    contrast: 1, 
    saturate: 1, 
    'hue-rotate': 0, 
    sepia: 0, 
    grayscale: 0, 
    blur: 0, 
    invert: 0, 
    opacity: 1 
};

let transforms = { 
    rotation: 0, 
    flipH: 1, 
    flipV: 1 
};

let currentSliderMode = 'brightness';

let cropActive = false;
let cropRect = { 
    x: 0.15, 
    y: 0.15, 
    w: 0.7, 
    h: 0.7 
};

let textActive = false;

let textData = { 
    text: 'Your Text', 
    color: '#ffffff', 
    size: 24, 
    x: 0.5, 
    y: 0.5 
};

// History: stores full state including imageData (base64) so crop is undoable
let history = [];
let historyIndex = -1;

/* =========================================================
   3. HELPERS
   ========================================================= */
function showToast(msg, duration = 1800) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.remove('show'), duration);
}

function buildCssFilterString() {
    return [
        `brightness(${filters.brightness * 100}%)`,
        `contrast(${filters.contrast * 100}%)`,
        `saturate(${filters.saturate * 100}%)`,
        `hue-rotate(${filters['hue-rotate']}deg)`,
        `sepia(${filters.sepia * 100}%)`,
        `grayscale(${filters.grayscale * 100}%)`,
        `blur(${filters.blur}px)`,
        `invert(${filters.invert * 100}%)`,
        `opacity(${filters.opacity * 100}%)`
    ].join(' ');
}

function updateImageStyle() {
    img.style.filter = buildCssFilterString();
    img.style.transform = `rotate(${transforms.rotation}deg) scale(${transforms.flipH}, ${transforms.flipV})`;

    // Update text overlay visual
    textOverlay.textContent = textData.text;
    textOverlay.style.color = textData.color;
    textOverlay.style.fontSize = textData.size + 'px';
    positionTextOverlay();
}

function positionTextOverlay() {
    const rect = wrapper.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    textOverlay.style.left = `${textData.x * rect.width}px`;
    textOverlay.style.top = `${textData.y * rect.height}px`;
    textOverlay.style.transform = 'translate(-50%, -50%)';
}

/* =========================================================
   4. HISTORY  (stores image data so crop is undoable)
   ========================================================= */
function captureState() {
    return {
        filters: { ...filters },
        transforms: { ...transforms },
        textData: { ...textData },
        textActive,
        imageSrc: img.src // base64 dataURL after first load
    };
}

const img = document.getElementById('editorImage');
const wrapper = document.getElementById('imageWrapper');
const cropOverlay = document.getElementById('cropOverlay');
const textOverlay = document.getElementById('textOverlay');
const textEditor = document.getElementById('textEditor');
const fileInput = document.getElementById('fileInput');
const toastEl = document.getElementById('toast');
const applyCropBtn = document.getElementById('applyCropBtn');
const applyTextBtn = document.getElementById('applyTextBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const sliderContainer = document.getElementById('sliderContainer');
const sliderThumb = document.getElementById('sliderThumb');

/* =========================================================
   2. STATE
   ========================================================= */
let filters = { 
    brightness: 1, 
    contrast: 1, 
    saturate: 1, 
    'hue-rotate': 0, 
    sepia: 0, 
    grayscale: 0, 
    blur: 0, 
    invert: 0, 
    opacity: 1 
};

let transforms = { 
    rotation: 0, 
    flipH: 1, 
    flipV: 1 
};

let currentSliderMode = 'brightness';

let cropActive = false;
let cropRect = { 
    x: 0.15, 
    y: 0.15, 
    w: 0.7, 
    h: 0.7 
};

let textActive = false;

let textData = { 
    text: 'Your Text', 
    color: '#ffffff', 
    size: 24, 
    x: 0.5, 
    y: 0.5 
};

// History: stores full state including imageData (base64) so crop is undoable
let history = [];
let historyIndex = -1;

/* =========================================================
   3. HELPERS
   ========================================================= */
function showToast(msg, duration = 1800) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.remove('show'), duration);
}

function buildCssFilterString() {
    return [
        `brightness(${filters.brightness * 100}%)`,
        `contrast(${filters.contrast * 100}%)`,
        `saturate(${filters.saturate * 100}%)`,
        `hue-rotate(${filters['hue-rotate']}deg)`,
        `sepia(${filters.sepia * 100}%)`,
        `grayscale(${filters.grayscale * 100}%)`,
        `blur(${filters.blur}px)`,
        `invert(${filters.invert * 100}%)`,
        `opacity(${filters.opacity * 100}%)`
    ].join(' ');
}

function updateImageStyle() {
    img.style.filter = buildCssFilterString();
    img.style.transform = `rotate(${transforms.rotation}deg) scale(${transforms.flipH}, ${transforms.flipV})`;

    // Update text overlay visual
    textOverlay.textContent = textData.text;
    textOverlay.style.color = textData.color;
    textOverlay.style.fontSize = textData.size + 'px';
    positionTextOverlay();
}

function positionTextOverlay() {
    const rect = wrapper.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    textOverlay.style.left = `${textData.x * rect.width}px`;
    textOverlay.style.top = `${textData.y * rect.height}px`;
    textOverlay.style.transform = 'translate(-50%, -50%)';
}

/* =========================================================
   4. HISTORY  (stores image data so crop is undoable)
   ========================================================= */
function captureState() {
    return {
        filters: { ...filters },
        transforms: { ...transforms },
        textData: { ...textData },
        textActive,
        imageSrc: img.src // base64 dataURL after first load
    };
}

function pushState() {
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    history.push(captureState());
    if (history.length > 30) history.shift(); // cap memory
    historyIndex = history.length - 1;
    updateHistoryButtons();
}

function restoreState(state) {
    filters = { ...state.filters };
    transforms = { ...state.transforms };
    textData = { ...state.textData };
    textActive = state.textActive;

    img.src = state.imageSrc;
    img.onload = () => {
        updateImageStyle();
        resetSliderThumb();
        textOverlay.style.display = textActive ? 'block' : 'none';
        // Hide crop overlay whenever we restore
        cropActive = false;
        cropOverlay.style.display = 'none';
        applyCropBtn.classList.add('hidden');
    };
}

function updateHistoryButtons() {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= history.length - 1;
}

undoBtn.addEventListener('click', () => {
    if (historyIndex > 0) { historyIndex--; restoreState(history[historyIndex]); updateHistoryButtons(); }
});
redoBtn.addEventListener('click', () => {
    if (historyIndex < history.length - 1) { historyIndex++; restoreState(history[historyIndex]); updateHistoryButtons(); }
});

/* =========================================================
   5. IMAGE LOADING (Local file only — prevents CORS taint)
   ========================================================= */
document.getElementById('pickBtn').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        img.onload = () => {
            // Reset everything
            filters = { brightness: 1, contrast: 1, saturate: 1, 'hue-rotate': 0, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 };
            transforms = { rotation: 0, flipH: 1, flipV: 1 };
            textData = { text: 'Your Text', color: '#ffffff', size: 24, x: 0.5, y: 0.5 };
            textActive = false;
            textOverlay.style.display = 'none';
            cropActive = false;
            cropOverlay.style.display = 'none';
            applyCropBtn.classList.add('hidden');

            updateImageStyle();
            resetSliderThumb();

            // Reset history with this image as the base
            history = [];
            historyIndex = -1;
            pushState();
        };
        img.src = ev.target.result;
        showToast('Image loaded');
    };
    reader.readAsDataURL(file);
    fileInput.value = ''; // allow re-selecting same file
});

/* =========================================================
   6. ROTATE / FLIP
   ========================================================= */
document.querySelectorAll('.tool-item').forEach(item => {
    item.addEventListener('click', () => {
        const tool = item.dataset.tool;
        document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('active'));
        item.classList.add('active');

        if (tool === 'rotate') {
            transforms.rotation = (transforms.rotation + 90) % 360;
            updateImageStyle();
            pushState();
        } else if (tool === 'horizontal') {
            transforms.flipH *= -1;
            updateImageStyle();
            pushState();
        } else if (tool === 'vertical') {
            transforms.flipV *= -1;
            updateImageStyle();
            pushState();
        } else if (tool === 'crop') {
            toggleCropMode();
        } else if (tool === 'text') {
            toggleTextMode();
        }
    });
});

/* =========================================================
   7. FILTER SLIDER
   ========================================================= */
document.querySelectorAll('.text-tool-item').forEach(el => {
    el.addEventListener('click', () => {
        document.querySelectorAll('.text-tool-item').forEach(t => t.classList.remove('active-text'));
        el.classList.add('active-text');
        currentSliderMode = el.dataset.slider;
        resetSliderThumb();
    });
});

function resetSliderThumb() {
    const rect = sliderContainer.getBoundingClientRect();
    let pct = 0.5;
    switch (currentSliderMode) {
        case 'brightness': case 'contrast': case 'saturate': case 'opacity':
            pct = filters[currentSliderMode] / 2; break;
        case 'hue-rotate': pct = filters[currentSliderMode] / 360; break;
        case 'sepia': case 'grayscale': case 'invert':
            pct = filters[currentSliderMode]; break;
        case 'blur': pct = filters[currentSliderMode] / 10; break;
    }
    pct = Math.max(0, Math.min(1, pct));
    sliderThumb.style.left = `${pct * rect.width}px`;
}

let isDraggingSlider = false;
function setSliderFromX(clientX) {
    const rect = sliderContainer.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    sliderThumb.style.left = `${x}px`;
    const pct = x / rect.width;
    switch (currentSliderMode) {
        case 'brightness': case 'contrast': case 'saturate': case 'opacity':
            filters[currentSliderMode] = pct * 2; break;
        case 'hue-rotate': filters[currentSliderMode] = pct * 360; break;
        case 'sepia': case 'grayscale': case 'invert':
            filters[currentSliderMode] = pct; break;
        case 'blur': filters[currentSliderMode] = pct * 10; break;
    }
    updateImageStyle();
}
sliderContainer.addEventListener('pointerdown', (e) => {
    isDraggingSlider = true;
    sliderContainer.setPointerCapture(e.pointerId);
    setSliderFromX(e.clientX);
});
sliderContainer.addEventListener('pointermove', (e) => { if (isDraggingSlider) setSliderFromX(e.clientX); });
sliderContainer.addEventListener('pointerup', () => { if (isDraggingSlider) { isDraggingSlider = false; pushState(); } });

/* =========================================================
   8. PRESETS
   ========================================================= */
const PRESETS = {
    none:      { brightness: 1, contrast: 1, saturate: 1, 'hue-rotate': 0, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 },
    vintage:   { brightness: 0.95, contrast: 1.1, saturate: 0.8, 'hue-rotate': 0, sepia: 0.5, grayscale: 0, blur: 0, invert: 0, opacity: 1 },
    bw:        { brightness: 1, contrast: 1.2, saturate: 1, 'hue-rotate': 0, sepia: 0, grayscale: 1, blur: 0, invert: 0, opacity: 1 },
    cinematic: { brightness: 0.9, contrast: 1.3, saturate: 0.85, 'hue-rotate': -10, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 },
    warm:      { brightness: 1.05, contrast: 1, saturate: 1.2, 'hue-rotate': -15, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 },
    cool:      { brightness: 1, contrast: 1, saturate: 1.1, 'hue-rotate': 20, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 },
    dramatic:  { brightness: 0.85, contrast: 1.5, saturate: 1.2, 'hue-rotate': 0, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 },
    fade:      { brightness: 1.1, contrast: 0.85, saturate: 0.7, 'hue-rotate': 0, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 }
};

document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        filters = { ...PRESETS[btn.dataset.preset] };
        updateImageStyle();
        resetSliderThumb();
        pushState();
        showToast(btn.textContent);
    });
});

/* =========================================================
   9. AUTO ENHANCE
   ========================================================= */
document.getElementById('autoBtn').addEventListener('click', () => {
    filters.brightness = 1.05;
    filters.contrast = 1.2;
    filters.saturate = 1.25;
    updateImageStyle();
    resetSliderThumb();
    pushState();
    showToast('Auto enhanced');
});

/* =========================================================
   10. CROP  (works correctly with rotation/flip)
   ========================================================= */
function toggleCropMode() {
    cropActive = !cropActive;
    cropOverlay.style.display = cropActive ? 'block' : 'none';
    applyCropBtn.classList.toggle('hidden', !cropActive);

    // Reset crop rect to defaults when opening
    if (cropActive) {
        cropRect = { x: 0.15, y: 0.15, w: 0.7, h: 0.7 };
        updateCropOverlayPosition();
        textOverlay.style.display = 'none';
    } else {
        textOverlay.style.display = textActive ? 'block' : 'none';
    }
}

function updateCropOverlayPosition() {
    cropOverlay.style.left = `${cropRect.x * 100}%`;
    cropOverlay.style.top = `${cropRect.y * 100}%`;
    cropOverlay.style.width = `${cropRect.w * 100}%`;
    cropOverlay.style.height = `${cropRect.h * 100}%`;
}

let dragState = null;
function onDragStart(e) {
    const target = e.target;
    let corner = null;
    if (target.classList.contains('crop-handle')) corner = target.dataset.corner;
    else if (target === cropOverlay) corner = 'move';
    else return;

    dragState = {
        corner,
        startX: e.clientX,
        startY: e.clientY,
        startRect: { ...cropRect }
    };
    // Only preventDefault when NOT in a passive listener (handled by using pointer events below)
}

function onDragMove(e) {
    if (!dragState) return;
    const rect = wrapper.getBoundingClientRect();
    const dx = (e.clientX - dragState.startX) / rect.width;
    const dy = (e.clientY - dragState.startY) / rect.height;

    let r = { ...dragState.startRect };

    if (dragState.corner === 'move') {
        r.x = Math.max(0, Math.min(1 - r.w, dragState.startRect.x + dx));
        r.y = Math.max(0, Math.min(1 - r.h, dragState.startRect.y + dy));
    } else {
        if (dragState.corner.includes('l')) { r.x = Math.max(0, dragState.startRect.x + dx); r.w = Math.max(0.1, dragState.startRect.w - dx); }
        if (dragState.corner.includes('r')) { r.w = Math.max(0.1, dragState.startRect.w + dx); }
        if (dragState.corner.includes('t')) { r.y = Math.max(0, dragState.startRect.y + dy); r.h = Math.max(0.1, dragState.startRect.h - dy); }
        if (dragState.corner.includes('b')) { r.h = Math.max(0.1, dragState.startRect.h + dy); }

        if (r.x + r.w > 1) r.w = 1 - r.x;
        if (r.y + r.h > 1) r.h = 1 - r.y;
    }

    cropRect = r;
    updateCropOverlayPosition();
}

function onDragEnd() { dragState = null; }

// Use Pointer Events (unified mouse + touch). NOT passive, so no warnings.
cropOverlay.addEventListener('pointerdown', onDragStart);
cropOverlay.querySelectorAll('.crop-handle').forEach(h => h.addEventListener('pointerdown', onDragStart));
window.addEventListener('pointermove', onDragMove);
window.addEventListener('pointerup', onDragEnd);
window.addEventListener('pointercancel', onDragEnd);

applyCropBtn.addEventListener('click', () => {
    if (!cropActive) return;

    // ---- CROP IN NATURAL IMAGE SPACE ----
    // Build a canvas at natural size, apply current transforms+flip, THEN crop.
    // This ensures crop matches what's on screen after rotation.
    const natW = img.naturalWidth;
    const natH = img.naturalHeight;

    // Determine display dims after rotation
    const rotated = transforms

function restoreState(state) {
    filters = { ...state.filters };
    transforms = { ...state.transforms };
    textData = { ...state.textData };
    textActive = state.textActive;

    img.src = state.imageSrc;
    img.onload = () => {
        updateImageStyle();
        resetSliderThumb();
        textOverlay.style.display = textActive ? 'block' : 'none';
        // Hide crop overlay whenever we restore
        cropActive = false;
        cropOverlay.style.display = 'none';
        applyCropBtn.classList.add('hidden');
    };
}

function updateHistoryButtons() {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= history.length - 1;
}

undoBtn.addEventListener('click', () => {
    if (historyIndex > 0) { historyIndex--; restoreState(history[historyIndex]); updateHistoryButtons(); }
});
redoBtn.addEventListener('click', () => {
    if (historyIndex < history.length - 1) { historyIndex++; restoreState(history[historyIndex]); updateHistoryButtons(); }
});

/* =========================================================
   5. IMAGE LOADING (Local file only — prevents CORS taint)
   ========================================================= */
document.getElementById('pickBtn').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        img.onload = () => {
            // Reset everything
            filters = { brightness: 1, contrast: 1, saturate: 1, 'hue-rotate': 0, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 };
            transforms = { rotation: 0, flipH: 1, flipV: 1 };
            textData = { text: 'Your Text', color: '#ffffff', size: 24, x: 0.5, y: 0.5 };
            textActive = false;
            textOverlay.style.display = 'none';
            cropActive = false;
            cropOverlay.style.display = 'none';
            applyCropBtn.classList.add('hidden');

            updateImageStyle();
            resetSliderThumb();

            // Reset history with this image as the base
            history = [];
            historyIndex = -1;
            pushState();
        };
        img.src = ev.target.result;
        showToast('Image loaded');
    };
    reader.readAsDataURL(file);
    fileInput.value = ''; // allow re-selecting same file
});

/* =========================================================
   6. ROTATE / FLIP
   ========================================================= */
document.querySelectorAll('.tool-item').forEach(item => {
    item.addEventListener('click', () => {
        const tool = item.dataset.tool;
        document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('active'));
        item.classList.add('active');

        if (tool === 'rotate') {
            transforms.rotation = (transforms.rotation + 90) % 360;
            updateImageStyle();
            pushState();
        } else if (tool === 'horizontal') {
            transforms.flipH *= -1;
            updateImageStyle();
            pushState();
        } else if (tool === 'vertical') {
            transforms.flipV *= -1;
            updateImageStyle();
            pushState();
        } else if (tool === 'crop') {
            toggleCropMode();
        } else if (tool === 'text') {
            toggleTextMode();
        }
    });
});

/* =========================================================
   7. FILTER SLIDER
   ========================================================= */
document.querySelectorAll('.text-tool-item').forEach(el => {
    el.addEventListener('click', () => {
        document.querySelectorAll('.text-tool-item').forEach(t => t.classList.remove('active-text'));
        el.classList.add('active-text');
        currentSliderMode = el.dataset.slider;
        resetSliderThumb();
    });
});

function resetSliderThumb() {
    const rect = sliderContainer.getBoundingClientRect();
    let pct = 0.5;
    switch (currentSliderMode) {
        case 'brightness': case 'contrast': case 'saturate': case 'opacity':
            pct = filters[currentSliderMode] / 2; break;
        case 'hue-rotate': pct = filters[currentSliderMode] / 360; break;
        case 'sepia': case 'grayscale': case 'invert':
            pct = filters[currentSliderMode]; break;
        case 'blur': pct = filters[currentSliderMode] / 10; break;
    }
    pct = Math.max(0, Math.min(1, pct));
    sliderThumb.style.left = `${pct * rect.width}px`;
}

let isDraggingSlider = false;
function setSliderFromX(clientX) {
    const rect = sliderContainer.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    sliderThumb.style.left = `${x}px`;
    const pct = x / rect.width;
    switch (currentSliderMode) {
        case 'brightness': case 'contrast': case 'saturate': case 'opacity':
            filters[currentSliderMode] = pct * 2; break;
        case 'hue-rotate': filters[currentSliderMode] = pct * 360; break;
        case 'sepia': case 'grayscale': case 'invert':
            filters[currentSliderMode] = pct; break;
        case 'blur': filters[currentSliderMode] = pct * 10; break;
    }
    updateImageStyle();
}
sliderContainer.addEventListener('pointerdown', (e) => {
    isDraggingSlider = true;
    sliderContainer.setPointerCapture(e.pointerId);
    setSliderFromX(e.clientX);
});
sliderContainer.addEventListener('pointermove', (e) => { if (isDraggingSlider) setSliderFromX(e.clientX); });
sliderContainer.addEventListener('pointerup', () => { if (isDraggingSlider) { isDraggingSlider = false; pushState(); } });

/* =========================================================
   8. PRESETS
   ========================================================= */
const PRESETS = {
    none:      { brightness: 1, contrast: 1, saturate: 1, 'hue-rotate': 0, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 },
    vintage:   { brightness: 0.95, contrast: 1.1, saturate: 0.8, 'hue-rotate': 0, sepia: 0.5, grayscale: 0, blur: 0, invert: 0, opacity: 1 },
    bw:        { brightness: 1, contrast: 1.2, saturate: 1, 'hue-rotate': 0, sepia: 0, grayscale: 1, blur: 0, invert: 0, opacity: 1 },
    cinematic: { brightness: 0.9, contrast: 1.3, saturate: 0.85, 'hue-rotate': -10, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 },
    warm:      { brightness: 1.05, contrast: 1, saturate: 1.2, 'hue-rotate': -15, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 },
    cool:      { brightness: 1, contrast: 1, saturate: 1.1, 'hue-rotate': 20, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 },
    dramatic:  { brightness: 0.85, contrast: 1.5, saturate: 1.2, 'hue-rotate': 0, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 },
    fade:      { brightness: 1.1, contrast: 0.85, saturate: 0.7, 'hue-rotate': 0, sepia: 0, grayscale: 0, blur: 0, invert: 0, opacity: 1 }
};

document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        filters = { ...PRESETS[btn.dataset.preset] };
        updateImageStyle();
        resetSliderThumb();
        pushState();
        showToast(btn.textContent);
    });
});

/* =========================================================
   9. AUTO ENHANCE
   ========================================================= */
document.getElementById('autoBtn').addEventListener('click', () => {
    filters.brightness = 1.05;
    filters.contrast = 1.2;
    filters.saturate = 1.25;
    updateImageStyle();
    resetSliderThumb();
    pushState();
    showToast('Auto enhanced');
});

/* =========================================================
   10. CROP  (works correctly with rotation/flip)
   ========================================================= */
function toggleCropMode() {
    cropActive = !cropActive;
    cropOverlay.style.display = cropActive ? 'block' : 'none';
    applyCropBtn.classList.toggle('hidden', !cropActive);

    // Reset crop rect to defaults when opening
    if (cropActive) {
        cropRect = { x: 0.15, y: 0.15, w: 0.7, h: 0.7 };
        updateCropOverlayPosition();
        textOverlay.style.display = 'none';
    } else {
        textOverlay.style.display = textActive ? 'block' : 'none';
    }
}

function updateCropOverlayPosition() {
    cropOverlay.style.left = `${cropRect.x * 100}%`;
    cropOverlay.style.top = `${cropRect.y * 100}%`;
    cropOverlay.style.width = `${cropRect.w * 100}%`;
    cropOverlay.style.height = `${cropRect.h * 100}%`;
}

let dragState = null;
function onDragStart(e) {
    const target = e.target;
    let corner = null;
    if (target.classList.contains('crop-handle')) corner = target.dataset.corner;
    else if (target === cropOverlay) corner = 'move';
    else return;

    dragState = {
        corner,
        startX: e.clientX,
        startY: e.clientY,
        startRect: { ...cropRect }
    };
    // Only preventDefault when NOT in a passive listener (handled by using pointer events below)
}

function onDragMove(e) {
    if (!dragState) return;
    const rect = wrapper.getBoundingClientRect();
    const dx = (e.clientX - dragState.startX) / rect.width;
    const dy = (e.clientY - dragState.startY) / rect.height;

    let r = { ...dragState.startRect };

    if (dragState.corner === 'move') {
        r.x = Math.max(0, Math.min(1 - r.w, dragState.startRect.x + dx));
        r.y = Math.max(0, Math.min(1 - r.h, dragState.startRect.y + dy));
    } else {
        if (dragState.corner.includes('l')) { r.x = Math.max(0, dragState.startRect.x + dx); r.w = Math.max(0.1, dragState.startRect.w - dx); }
        if (dragState.corner.includes('r')) { r.w = Math.max(0.1, dragState.startRect.w + dx); }
        if (dragState.corner.includes('t')) { r.y = Math.max(0, dragState.startRect.y + dy); r.h = Math.max(0.1, dragState.startRect.h - dy); }
        if (dragState.corner.includes('b')) { r.h = Math.max(0.1, dragState.startRect.h + dy); }

        if (r.x + r.w > 1) r.w = 1 - r.x;
        if (r.y + r.h > 1) r.h = 1 - r.y;
    }

    cropRect = r;
    updateCropOverlayPosition();
}

function onDragEnd() { dragState = null; }

// Use Pointer Events (unified mouse + touch). NOT passive, so no warnings.
cropOverlay.addEventListener('pointerdown', onDragStart);
cropOverlay.querySelectorAll('.crop-handle').forEach(h => h.addEventListener('pointerdown', onDragStart));
window.addEventListener('pointermove', onDragMove);
window.addEventListener('pointerup', onDragEnd);
window.addEventListener('pointercancel', onDragEnd);

applyCropBtn.addEventListener('click', () => {
    if (!cropActive) return;

    // ---- CROP IN NATURAL IMAGE SPACE ----
    // Build a canvas at natural size, apply current transforms+flip, THEN crop.
    // This ensures crop matches what's on screen after rotation.
    const natW = img.naturalWidth;
    const natH = img.naturalHeight;

    // Determine display dims after rotation
    const rotated = transforms