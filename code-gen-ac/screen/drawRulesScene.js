
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';

export default function drawRulesScene() {
    const dict = new Map();
    const all = new Set();

    all.add(Sprites.create(1, 4.595833333333333, 0.6875, -4.5));

    all.add(Sprites.create(114, 4.816666666666666, 3.720833333333333, -4.5));

    all.add(Sprites.create(0, -0.4125, -0.30833333333333335, -4.5));

    all.add(Sprites.create(125, -1.8291666666666666, 3.7125, -4.5));

    all.add(Sprites.create(5, -5.570833333333334, 1.9625, -4.5));

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
