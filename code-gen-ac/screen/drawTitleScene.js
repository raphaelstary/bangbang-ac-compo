
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';

export default function drawTitleScene() {
    const dict = new Map();
    const all = new Set();

    all.add(Sprites.create(111, 0, -1.775, -4.5));

    all.add(Sprites.create(246, 4.141666666666667, 1.2458333333333333, -4.5));

    all.add(Sprites.create(15, 0, 1.9791666666666667, -4.5));

    return Object.freeze({
        all,
        dict,
        removeSprites() {
            for (const id of all) {
                const idx = Sprites.getIndex(id);
                if (idx == INVALID_INDEX)
                    continue;
                Sprites.remove(idx);
            }
        }
    });
}
