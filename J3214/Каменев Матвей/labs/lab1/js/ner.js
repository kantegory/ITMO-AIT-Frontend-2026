const textContainer = document.getElementById('ner-text');
const popup = document.getElementById('ner-popup');

const ENTITIES = {
    fio:      { color: '#3b82f6' },
    dob:      { color: '#10b981' },
    passport: { color: '#f59e0b' }
};

let savedRange = null;

function showPopup(range) {
    const containerRect = textContainer.getBoundingClientRect();
    const rangeRect = range.getBoundingClientRect();
    const top = rangeRect.bottom - containerRect.top + textContainer.scrollTop + 6;
    const left = Math.max(0, rangeRect.left - containerRect.left);
    popup.style.top = top + 'px';
    popup.style.left = left + 'px';
    popup.classList.remove('d-none');
}

textContainer.addEventListener('mouseup', () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.toString().trim() === '') {
        return;
    }
    const range = sel.getRangeAt(0);
    if (!textContainer.contains(range.commonAncestorContainer)) return;
    savedRange = range.cloneRange();
    showPopup(range);
});

document.addEventListener('mousedown', (e) => {
    if (popup.contains(e.target)) return;
    popup.classList.add('d-none');
    savedRange = null;
});

document.querySelectorAll('.ner-entity-btn').forEach(btn => {
    btn.addEventListener('mousedown', e => e.preventDefault());
    btn.addEventListener('click', () => {
        if (!savedRange) return;
        const type = btn.dataset.entity;
        const color = ENTITIES[type].color;

        try {
            const mark = document.createElement('mark');
            mark.className = 'ner-mark';
            mark.dataset.entity = type;
            mark.style.background = color + '33';
            mark.style.borderBottom = `2px solid ${color}`;
            mark.style.borderRadius = '3px';

            savedRange.surroundContents(mark);

            mark.addEventListener('click', () => {
                const parent = mark.parentNode;
                while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
                parent.removeChild(mark);
                parent.normalize();
            });
        } catch {

        }

        window.getSelection().removeAllRanges();
        popup.classList.add('d-none');
        savedRange = null;
    });
});
