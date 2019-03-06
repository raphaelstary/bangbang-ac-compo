
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';
import { add as addTouch, remove as removeTouch } from '../../code-src-ac/controller/input/Pointers.js';
import TouchArea from '../../code-src-ac/controller/input/TouchArea.js';

export default function drawJoinScene() {
    const touches = new Map();
    const dict = new Map();
    const all = new Set();

    const SHOOT_BTNTouch = new TouchArea(0, 0.378125, 1, 1);
    touches.set(0, SHOOT_BTNTouch);
    addTouch(SHOOT_BTNTouch);

    const RESET_BTNTouch = new TouchArea(0, 0.1921875, 1, 0.3453125);
    touches.set(1, RESET_BTNTouch);
    addTouch(RESET_BTNTouch);

    const CANCEL_BTNTouch = new TouchArea(0, 0.0296875, 1, 0.190625);
    touches.set(2, CANCEL_BTNTouch);
    addTouch(CANCEL_BTNTouch);

    const SHOOT_BTNSprite = Sprites.create(1, 0, -2.85, -8);
    dict.set(0, SHOOT_BTNSprite);
    all.add(SHOOT_BTNSprite);

    const RESET_BTNSprite = Sprites.create(8, 0, 3.7333333333333334, -8);
    dict.set(1, RESET_BTNSprite);
    all.add(RESET_BTNSprite);

    const CANCEL_BTNSprite = Sprites.create(4, 0, 6.133333333333334, -8);
    dict.set(2, CANCEL_BTNSprite);
    all.add(CANCEL_BTNSprite);

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
