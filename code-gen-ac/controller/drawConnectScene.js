
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';
import { add as addTouch, remove as removeTouch } from '../../code-src-ac/controller/input/Pointers.js';
import TouchArea from '../../code-src-ac/controller/input/TouchArea.js';

export default function drawConnectScene() {
    const touches = new Map();
    const dict = new Map();
    const all = new Set();

    const SHOOT_BTNTouch = new TouchArea(0, 0.378125, 1, 1);
    touches.set(0, SHOOT_BTNTouch);
    addTouch(SHOOT_BTNTouch);

    const RESET_BTNTouch = new TouchArea(0, 0.17083333333333334, 1, 0.36302083333333335);
    touches.set(1, RESET_BTNTouch);
    addTouch(RESET_BTNTouch);

    const SHOOT_BTNSprite = Sprites.create(1, 0, -2.85, -8);
    dict.set(0, SHOOT_BTNSprite);
    all.add(SHOOT_BTNSprite);

    const RESET_BTNSprite = Sprites.create(8, 0, 3.7333333333333334, -8);
    dict.set(1, RESET_BTNSprite);
    all.add(RESET_BTNSprite);

    all.add(Sprites.create(16, 0, 6.758333333333334, -8));

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
