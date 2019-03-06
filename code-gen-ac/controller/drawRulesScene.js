
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';
import { add as addTouch, remove as removeTouch } from '../../code-src-ac/controller/input/Pointers.js';
import TouchArea from '../../code-src-ac/controller/input/TouchArea.js';

export default function drawRulesScene() {
    const touches = new Map();
    const dict = new Map();
    const all = new Set();

    const SHOOT_BTNTouch = new TouchArea(0, 0.31302083333333336, 1, 1);
    touches.set(0, SHOOT_BTNTouch);
    addTouch(SHOOT_BTNTouch);

    const BACK_BTNTouch = new TouchArea(0, 0, 0.5, 0.146875);
    touches.set(1, BACK_BTNTouch);
    addTouch(BACK_BTNTouch);

    const SHOOT_BTNSprite = Sprites.create(1, 0, -2.85, -8);
    dict.set(0, SHOOT_BTNSprite);
    all.add(SHOOT_BTNSprite);

    all.add(Sprites.create(2, 0.5291666666666667, 4.5875, -8));

    const BACK_BTNSprite = Sprites.create(12, -3.3, 6.933333333333334, -8);
    dict.set(1, BACK_BTNSprite);
    all.add(BACK_BTNSprite);

    return Object.freeze({
        all,
        dict,
        touches,
        removeSprites() {
            for (const id of all) {
                const idx = Sprites.getIndex(id);
                if (idx == INVALID_INDEX)
                    continue;
                Sprites.remove(idx);
            }
        },
        removeTouches() {
            for (const touch of touches.values()) {
                removeTouch(touch);
            }
        }
    });
}
