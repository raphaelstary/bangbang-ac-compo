
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';

export default function drawRulesFlushScene() {
    const dict = new Map();
    const all = new Set();

    all.add(Sprites.create(undefined, 0.004166666666666667, -1.075, -4.5));

    all.add(Sprites.create(undefined, 2.720833333333333, 0.18333333333333335, -4.5));

    all.add(Sprites.create(undefined, 1.3625, 0.17916666666666667, -4.5));

    all.add(Sprites.create(undefined, -1.3541666666666667, 0.17916666666666667, -4.5));

    all.add(Sprites.create(undefined, 0.004166666666666667, 0.17916666666666667, -4.5));

    all.add(Sprites.create(undefined, -2.7125, 0.17916666666666667, -4.5));

    all.add(Sprites.create(undefined, -8, 4.5, -4.5));

    all.add(Sprites.create(undefined, -8, 4.5, -4.5));

    all.add(Sprites.create(undefined, -3.095833333333333, 3, -4.5));

    all.add(Sprites.create(undefined, -5.9125, 3.770833333333333, -4.5));

    all.add(Sprites.create(undefined, -8, 4.5, -4.5));

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
