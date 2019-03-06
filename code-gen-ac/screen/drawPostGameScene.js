
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';

export default function drawPostGameScene() {
    const dict = new Map();
    const all = new Set();

    const WINNER_PIC = Sprites.create(131, 0, 2.9458333333333337, -4.5001);
    dict.set(0, WINNER_PIC);
    all.add(WINNER_PIC);

    const WINNER = Sprites.create(98, 0, 2.8833333333333333, -4.5);
    dict.set(1, WINNER);
    all.add(WINNER);

    const WON_LABEL = Sprites.create(103, 0.004166666666666667, 1.4708333333333332, -4.5);
    dict.set(2, WON_LABEL);
    all.add(WON_LABEL);

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
