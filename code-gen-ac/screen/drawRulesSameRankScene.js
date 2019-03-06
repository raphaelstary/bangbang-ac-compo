
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';

export default function drawRulesSameRankScene() {
    const dict = new Map();
    const all = new Set();

    all.add(Sprites.create(undefined, 3.5208333333333335, -1.1666666666666665, -4.5));

    all.add(Sprites.create(undefined, 2.845833333333333, 0.0875, -4.5));

    all.add(Sprites.create(undefined, 3.225, 0.07916666666666668, -4.5));

    all.add(Sprites.create(undefined, 3.7125, 0.075, -4.5));

    all.add(Sprites.create(undefined, 4.204166666666667, 0.07083333333333333, -4.5));

    all.add(Sprites.create(undefined, 3.5166666666666666, 1.5375, -4.5));

    all.add(Sprites.create(undefined, -8, 4.5, -4.5));

    all.add(Sprites.create(undefined, -0.3625, -1.1666666666666665, -4.5));

    all.add(Sprites.create(undefined, -0.85, 0.07083333333333333, -4.5));

    all.add(Sprites.create(undefined, -0.37083333333333335, 0.07083333333333333, -4.5));

    all.add(Sprites.create(undefined, 0.11666666666666667, 0.07083333333333333, -4.5));

    all.add(Sprites.create(undefined, -0.37083333333333335, 1.5291666666666666, -4.5));

    all.add(Sprites.create(undefined, -8, 4.5, -4.5));

    all.add(Sprites.create(undefined, -3.8875, -1.1666666666666665, -4.5));

    all.add(Sprites.create(undefined, -4.204166666666667, 0.0875, -4.5));

    all.add(Sprites.create(undefined, -3.5708333333333333, 0.0875, -4.5));

    all.add(Sprites.create(undefined, -3.8875, 1.5291666666666666, -4.5));

    all.add(Sprites.create(undefined, -8, 4.5, -4.5));

    all.add(Sprites.create(undefined, -8, 4.5, -4.5));

    all.add(Sprites.create(undefined, -2.6333333333333333, 3.0083333333333333, -4.5));

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
