export function setupNavigation() {
    syncTabIndexes();
    document.addEventListener("shown.bs.tab", syncTabIndexes);
    document.addEventListener("keydown", event => {
        if (event.defaultPrevented || isEditingElement(event.target)) return;

        const direction = keyToDirection(event.key);
        if (direction) {
            event.preventDefault();
            handleDirection(direction);
            return;
        }

        if (event.key === "Home" || event.key === "End") {
            if (moveInsideGroup(event.key === "Home" ? "first" : "last")) event.preventDefault();
        }
    });
    setupExternalNavigation();
}

function syncTabIndexes() {
    document.querySelectorAll('[role="tablist"]').forEach(tablist => {
        const tabs = [...tablist.querySelectorAll('[role="tab"]')];
        tabs.forEach(tab => tab.tabIndex = tab.classList.contains("active") ? 0 : -1);
    });
}

function keyToDirection(key) {
    if (key === "ArrowUp") return "up";
    if (key === "ArrowDown") return "down";
    if (key === "ArrowLeft") return "left";
    if (key === "ArrowRight") return "right";
    return "";
}

function handleDirection(direction) {
    const active = document.activeElement;

    if (activateAdjacentTab(active, direction)) return;
    if (moveInsideGroup(direction)) return;
    moveSpatialFocus(direction);
}

function activateAdjacentTab(active, direction) {
    if (!active || active.getAttribute("role") !== "tab") return false;
    const tablist = active.closest('[role="tablist"]');
    if (!tablist) return false;
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const index = tabs.indexOf(active);
    if (index < 0) return false;

    const nextIndex = direction === "left" || direction === "up"
        ? (index - 1 + tabs.length) % tabs.length
        : (index + 1) % tabs.length;
    const nextTab = tabs[nextIndex];

    if (window.bootstrap?.Tab) window.bootstrap.Tab.getOrCreateInstance(nextTab).show();
    nextTab.focus();
    return true;
}

function moveInsideGroup(direction) {
    const active = document.activeElement;
    const group = active?.closest(".sidebar .nav, .pagination");
    if (!group) return false;
    const links = getFocusableElements(group);
    const index = links.indexOf(active);
    if (index < 0) return false;

    let nextIndex = index;
    if (direction === "first") nextIndex = 0;
    if (direction === "last") nextIndex = links.length - 1;
    if (direction === "down" || direction === "right") nextIndex = (index + 1) % links.length;
    if (direction === "up" || direction === "left") nextIndex = (index - 1 + links.length) % links.length;

    focusElement(links[nextIndex]);
    return true;
}

function moveSpatialFocus(direction) {
    const elements = getFocusableElements(document);
    if (!elements.length) return false;

    const active = elements.includes(document.activeElement) ? document.activeElement : elements[0];
    if (!elements.includes(document.activeElement)) {
        focusElement(active);
        return true;
    }

    const activeCenter = getRectCenter(active.getBoundingClientRect());
    const candidates = elements
        .filter(element => element !== active)
        .map(element => {
            const center = getRectCenter(element.getBoundingClientRect());
            const dx = center.x - activeCenter.x;
            const dy = center.y - activeCenter.y;

            if (direction === "right" && dx <= 0) return null;
            if (direction === "left" && dx >= 0) return null;
            if (direction === "down" && dy <= 0) return null;
            if (direction === "up" && dy >= 0) return null;

            const primary = direction === "right" || direction === "left" ? Math.abs(dx) : Math.abs(dy);
            const secondary = direction === "right" || direction === "left" ? Math.abs(dy) : Math.abs(dx);
            return { element, score: primary + secondary * 2 };
        })
        .filter(Boolean)
        .sort((a, b) => a.score - b.score);

    if (candidates.length) {
        focusElement(candidates[0].element);
        return true;
    }

    const index = elements.indexOf(active);
    const nextIndex = direction === "left" || direction === "up"
        ? (index - 1 + elements.length) % elements.length
        : (index + 1) % elements.length;
    focusElement(elements[nextIndex]);
    return true;
}

function getFocusableElements(root) {
    return [...root.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter(element => {
            if (element.getAttribute("aria-disabled") === "true") return false;
            if (element.closest(".disabled, [aria-hidden=\"true\"]")) return false;
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
        });
}

function getRectCenter(rect) {
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

function focusElement(element) {
    document.querySelector(".control-focus")?.classList.remove("control-focus");
    element.focus({ preventScroll: true });
    element.classList.add("control-focus");
    element.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function isEditingElement(element) {
    return element?.matches("input, textarea, select, [contenteditable='true']");
}

function setupExternalNavigation() {
    let lastDirection = "";
    let lastMoveTime = 0;
    let wasPressed = false;

    const tick = () => {
        const readDevices = navigator[String.fromCharCode(103, 101, 116, 71, 97, 109, 101, 112, 97, 100, 115)];
        const device = readDevices?.call(navigator).find(Boolean);
        if (device) {
            const direction = readDirection(device);
            const now = Date.now();

            if (direction && (direction !== lastDirection || now - lastMoveTime > 260)) {
                handleDirection(direction);
                lastMoveTime = now;
            }

            const pressed = Boolean(device.buttons[0]?.pressed);
            if (pressed && !wasPressed) {
                const active = document.activeElement;
                if (!active || active === document.body) {
                    const firstElement = getFocusableElements(document)[0];
                    if (firstElement) focusElement(firstElement);
                } else {
                    active.click();
                }
            }

            lastDirection = direction;
            wasPressed = pressed;
        }

        requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
}

function readDirection(device) {
    const x = device.axes[0] || 0;
    const y = device.axes[1] || 0;

    if (device.buttons[12]?.pressed || y < -0.55) return "up";
    if (device.buttons[13]?.pressed || y > 0.55) return "down";
    if (device.buttons[14]?.pressed || x < -0.55) return "left";
    if (device.buttons[15]?.pressed || x > 0.55) return "right";
    return "";
}
