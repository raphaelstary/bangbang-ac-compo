const Pointer = Object.freeze({
    DOWN: 'down',
    MOVE: 'move',
    UP: 'up'
});

class CustomPointerEvt {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.type = Pointer.DOWN;

        Object.seal(this);
    }
}

/** @type {Map<number, CustomPointerEvt>} */
const activePointers = new Map();
/** @type {Set<CustomPointerEvt>} */
const pendingAdds = new Set();
/** @type {Set<number>} */
const pendingDeletes = new Set();
/** @type {Set<TouchArea>} */
const touchAreas = new Set();

/**
 * only call from within the event loop
 *
 * @param {TouchArea} touchArea
 */
export function add(touchArea) {
    touchAreas.add(touchArea);
}

/**
 * only call from within the event loop
 *
 * @param {TouchArea} touchArea
 */
export function remove(touchArea) {
    touchAreas.delete(touchArea);
}

export function update() {
    if (pendingAdds.size > 0) {
        for (const pointer of pendingAdds) {
            activePointers.set(pointer.id, pointer);
        }
        pendingAdds.clear();
    }

    for (const area of touchAreas) {
        area.oldTouched = area.newTouched;
        area.newTouched = false;
    }

    for (const pointer of activePointers.values()) {
        for (const area of touchAreas) {
            if ((pointer.type == Pointer.DOWN || pointer.type == Pointer.MOVE) &&
                pointer.x > area.left && pointer.x < area.right && pointer.y > area.top && pointer.y < area.bottom) {
                area.newTouched = true;
            }
        }
    }

    if (pendingDeletes.size > 0) {
        for (const id of pendingDeletes) {
            activePointers.delete(id);
        }
        pendingDeletes.clear();
    }
}

function pointerDown(event) {
    event.preventDefault();

    const x = (event.clientX - event.target.offsetLeft) / event.target.offsetWidth;
    const y = (event.clientY - event.target.offsetTop) / event.target.offsetHeight;
    pendingAdds.add(new CustomPointerEvt(event.pointerId, x, y));
}

function pointerMove(event) {
    event.preventDefault();
    const current = activePointers.get(event.pointerId);
    const x = (event.clientX - event.target.offsetLeft) / event.target.offsetWidth;
    const y = (event.clientY - event.target.offsetTop) / event.target.offsetHeight;
    if (current) {
        current.x = x;
        current.y = y;
        current.type = Pointer.MOVE;
    } else {
        pendingAdds.add(new CustomPointerEvt(event.pointerId, x, y));
    }

}

function pointerUp(event) {
    event.preventDefault();
    const current = activePointers.get(event.pointerId);
    if (current) {
        current.x = (event.clientX - event.target.offsetLeft) / event.target.offsetWidth;
        current.y = (event.clientY - event.target.offsetTop) / event.target.offsetHeight;
        current.type = Pointer.UP;
        pendingDeletes.add(current.id);
    } else {
        pendingDeletes.add(event.pointerId);
    }
}

function touchStart(event) {
    event.preventDefault();

    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const x = (touches[i].clientX - event.target.offsetLeft) / event.target.offsetWidth;
        const y = (touches[i].clientY - event.target.offsetTop) / event.target.offsetHeight;
        pendingAdds.add(new CustomPointerEvt(touches[i].identifier, x, y));
    }
}

function touchMove(event) {
    event.preventDefault();
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const ref = touches[i];
        const x = (ref.clientX - event.target.offsetLeft) / event.target.offsetWidth;
        const y = (ref.clientY - event.target.offsetTop) / event.target.offsetHeight;
        const current = activePointers.get(ref.identifier);
        if (current) {
            current.x = x;
            current.y = y;
            current.type = Pointer.MOVE;
        } else {
            pendingAdds.add(new CustomPointerEvt(touches[i].identifier, x, y));
        }
    }
}

function touchEnd(event) {
    event.preventDefault();
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const ref = touches[i];
        const current = activePointers.get(ref.identifier);
        if (current) {
            current.x = (ref.clientX - event.target.offsetLeft) / event.target.offsetWidth;
            current.y = (ref.clientY - event.target.offsetTop) / event.target.offsetHeight;
            current.type = Pointer.UP;
            pendingDeletes.add(current.id);
        } else {
            pendingDeletes.add(ref.identifier);
        }
    }
}

const canvas = document.getElementById('screen');

if (window.PointerEvent) {
    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerup', pointerUp);
    canvas.addEventListener('pointerout', pointerUp);

} else if ('ontouchstart' in window) {
    canvas.addEventListener('touchstart', touchStart);
    canvas.addEventListener('touchmove', touchMove);
    canvas.addEventListener('touchend', touchEnd);
    canvas.addEventListener('touchcancel', touchEnd);
}