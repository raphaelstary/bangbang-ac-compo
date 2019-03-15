
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';

export default function drawJoinScene() {
    const dict = new Map();
    const all = new Set();

    const COLOR_TXT = Sprites.create(108, -2.275, 3.325, -4.5);
    dict.set(0, COLOR_TXT);
    all.add(COLOR_TXT);

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
