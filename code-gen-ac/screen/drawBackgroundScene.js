
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';

export default function drawBackgroundScene() {
    const dict = new Map();
    const all = new Set();

    all.add(Sprites.create(120, -7.2, -0.004166666666666667, -4.7));

    all.add(Sprites.create(120, -4.316666666666666, -0.0125, -4.7));

    all.add(Sprites.create(120, -1.4416666666666667, -0.0125, -4.7));

    all.add(Sprites.create(120, 1.4416666666666667, -0.0125, -4.7));

    all.add(Sprites.create(120, 4.316666666666666, -0.0125, -4.7));

    all.add(Sprites.create(120, 7.2, -0.0125, -4.7));

    all.add(Sprites.create(120, -5.758333333333334, 1.9375, -4.7));

    all.add(Sprites.create(120, -2.875, 1.9375, -4.7));

    all.add(Sprites.create(120, 0, 1.9375, -4.7));

    all.add(Sprites.create(120, 2.8833333333333333, 1.9375, -4.7));

    all.add(Sprites.create(120, 5.758333333333334, 1.9375, -4.7));

    all.add(Sprites.create(120, -5.758333333333334, -1.9541666666666666, -4.7));

    all.add(Sprites.create(120, -2.875, -1.9541666666666666, -4.7));

    all.add(Sprites.create(120, 0, -1.9541666666666666, -4.7));

    all.add(Sprites.create(120, 2.8833333333333333, -1.9541666666666666, -4.7));

    all.add(Sprites.create(120, 5.758333333333334, -1.9541666666666666, -4.7));

    all.add(Sprites.create(120, -7.2, 3.8875, -4.7));

    all.add(Sprites.create(120, -4.316666666666666, 3.879166666666667, -4.7));

    all.add(Sprites.create(120, -1.4416666666666667, 3.879166666666667, -4.7));

    all.add(Sprites.create(120, 1.4416666666666667, 3.879166666666667, -4.7));

    all.add(Sprites.create(120, 4.316666666666666, 3.879166666666667, -4.7));

    all.add(Sprites.create(120, 7.2, 3.879166666666667, -4.7));

    all.add(Sprites.create(120, -7.2, -3.8875, -4.7));

    all.add(Sprites.create(120, -4.316666666666666, -3.895833333333333, -4.7));

    all.add(Sprites.create(120, -1.4416666666666667, -3.895833333333333, -4.7));

    all.add(Sprites.create(120, 1.4416666666666667, -3.895833333333333, -4.7));

    all.add(Sprites.create(120, 4.316666666666666, -3.895833333333333, -4.7));

    all.add(Sprites.create(120, 7.2, -3.895833333333333, -4.7));

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
