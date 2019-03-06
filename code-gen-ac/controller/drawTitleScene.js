
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';
import { add as addTouch, remove as removeTouch } from '../../code-src-ac/controller/input/Pointers.js';
import TouchArea from '../../code-src-ac/controller/input/TouchArea.js';

export default function drawTitleScene() {
    const touches = new Map();
    const dict = new Map();
    const all = new Set();

    const SHOOT_BTNTouch = new TouchArea(0, 0.31302083333333336, 1, 1);
    touches.set(0, SHOOT_BTNTouch);
    addTouch(SHOOT_BTNTouch);

    const SHOOT_BTNSprite = Sprites.create(1, 0, -2.85, -8);
    dict.set(0, SHOOT_BTNSprite);
    all.add(SHOOT_BTNSprite);

    all.add(Sprites.create(10, 0, 2.85, -8));

    all.add(Sprites.create(15, 0, 4.441666666666666, -8));

    all.add(Sprites.create(9, 0, 6.166666666666667, -8));

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
