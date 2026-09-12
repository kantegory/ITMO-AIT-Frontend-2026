const wrapper = document.getElementById('detect-wrapper');
const confirmBtn = document.getElementById('confirm-btn');

let boxes = [];
let nextId = 0;

let isDrawing = false;
let drawStart = { x: 0, y: 0 };
let drawEl = null;
let drawId = null;

let resizing = null; // { box, corner, startMouse, startBox }

function getRelPos(e) {
    const rect = wrapper.getBoundingClientRect();
    return {
        x: Math.max(0, Math.min(e.clientX - rect.left, rect.width)),
        y: Math.max(0, Math.min(e.clientY - rect.top, rect.height))
    };
}

function applyBoxStyle(el, x, y, w, h) {
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = w + 'px';
    el.style.height = h + 'px';
}

function removeBox(id) {
    const idx = boxes.findIndex(b => b.id === id);
    if (idx === -1) return;
    boxes[idx].el.remove();
    boxes.splice(idx, 1);
    confirmBtn.disabled = boxes.length === 0;
}

function buildBoxEl(id) {
    const el = document.createElement('div');
    el.className = 'bbox';

    const del = document.createElement('button');
    del.className = 'bbox-delete';
    del.textContent = '×';
    del.addEventListener('mousedown', e => e.stopPropagation());
    del.addEventListener('click', (e) => {
        e.stopPropagation();
        removeBox(id);
    });
    el.appendChild(del);

    ['nw', 'ne', 'sw', 'se'].forEach(corner => {
        const handle = document.createElement('div');
        handle.className = `bbox-handle bbox-handle-${corner}`;
        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const box = boxes.find(b => b.id === id);
            if (!box) return;
            resizing = {
                box,
                corner,
                startMouse: getRelPos(e),
                startBox: { x: box.x, y: box.y, w: box.w, h: box.h }
            };
        });
        el.appendChild(handle);
    });

    return el;
}

wrapper.addEventListener('mousedown', (e) => {
    if (e.target !== wrapper && !e.target.matches('#detect-img')) return;
    e.preventDefault();
    const pos = getRelPos(e);
    drawStart = pos;
    isDrawing = true;
    drawId = nextId++;

    const el = buildBoxEl(drawId);
    applyBoxStyle(el, pos.x, pos.y, 0, 0);
    wrapper.appendChild(el);
    drawEl = el;
});

document.addEventListener('mousemove', (e) => {
    if (isDrawing && drawEl) {
        const pos = getRelPos(e);
        const x = Math.min(drawStart.x, pos.x);
        const y = Math.min(drawStart.y, pos.y);
        const w = Math.abs(pos.x - drawStart.x);
        const h = Math.abs(pos.y - drawStart.y);
        applyBoxStyle(drawEl, x, y, w, h);
        return;
    }

    if (resizing) {
        const { box, corner, startMouse, startBox } = resizing;
        const pos = getRelPos(e);
        const dx = pos.x - startMouse.x;
        const dy = pos.y - startMouse.y;
        const MIN = 20;

        let { x, y, w, h } = startBox;
        if (corner === 'nw') { x += dx; y += dy; w -= dx; h -= dy; }
        else if (corner === 'ne') { y += dy; w += dx; h -= dy; }
        else if (corner === 'sw') { x += dx; w -= dx; h += dy; }
        else if (corner === 'se') { w += dx; h += dy; }

        if (w < MIN) { if (corner === 'nw' || corner === 'sw') x = startBox.x + startBox.w - MIN; w = MIN; }
        if (h < MIN) { if (corner === 'nw' || corner === 'ne') y = startBox.y + startBox.h - MIN; h = MIN; }

        box.x = x; box.y = y; box.w = w; box.h = h;
        applyBoxStyle(box.el, x, y, w, h);
    }
});

document.addEventListener('mouseup', () => {
    if (isDrawing && drawEl) {
        isDrawing = false;
        const w = parseFloat(drawEl.style.width);
        const h = parseFloat(drawEl.style.height);

        if (w < 10 || h < 10) {
            drawEl.remove();
        } else {
            const box = {
                id: drawId,
                el: drawEl,
                x: parseFloat(drawEl.style.left),
                y: parseFloat(drawEl.style.top),
                w,
                h
            };
            boxes.push(box);
            confirmBtn.disabled = false;
        }
        drawEl = null;
        drawId = null;
    }

    if (resizing) {
        resizing = null;
    }
});
