
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';

export default function drawMenuScene() {
    const dict = new Map();
    const all = new Set();

    all.add(Sprites.create(92, 0, -0.004166666666666667, -4.5));

    all.add(Sprites.create(110, 5.3, -3.75, -4.5));

    all.add(Sprites.create(109, 4.904166666666667, -3.0500000000000003, -4.5));

    all.add(Sprites.create(259, 3.675, 3.1416666666666666, -4.5));

    all.add(Sprites.create(114, 1.6583333333333334, 3.720833333333333, -4.5));

    all.add(Sprites.create(0, -3.7708333333333335, -0.30833333333333335, -4.5));

    all.add(Sprites.create(125, -5.1875, 3.7125, -4.5));

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
