
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';

export default function drawRulesStraightScene() {
    const dict = new Map();
    const all = new Set();

    all.add(Sprites.create(undefined, -0.004166666666666667, -0.95, -4.5));

    all.add(Sprites.create(undefined, -5.766666666666667, 0.05, -4.5));

    all.add(Sprites.create(undefined, -5.054166666666666, -0.0375, -4.5));

    all.add(Sprites.create(undefined, -4.354166666666667, -0.004166666666666667, -4.5));

    all.add(Sprites.create(undefined, -3.6458333333333335, -0.06666666666666667, -4.5));

    all.add(Sprites.create(undefined, -1.7208333333333334, 0.30833333333333335, -4.5));

    all.add(Sprites.create(undefined, -0.8625, 0.30833333333333335, -4.5));

    all.add(Sprites.create(undefined, 0.004166666666666667, 0.3041666666666667, -4.5));

    all.add(Sprites.create(undefined, 0.8625, 0.3041666666666667, -4.5));

    all.add(Sprites.create(undefined, 1.7208333333333334, 0.30833333333333335, -4.5));

    all.add(Sprites.create(undefined, 3.6458333333333335, 0.029166666666666667, -4.5));

    all.add(Sprites.create(undefined, 4.354166666666667, -0.07083333333333333, -4.5));

    all.add(Sprites.create(undefined, 5.058333333333334, -0.029166666666666667, -4.5));

    all.add(Sprites.create(undefined, 5.770833333333333, 0.04583333333333334, -4.5));

    all.add(Sprites.create(undefined, -8, 4.5, -4.5));

    all.add(Sprites.create(undefined, -8, 4.5, -4.5));

    all.add(Sprites.create(undefined, -2.525, 3.0124999999999997, -4.5));

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
