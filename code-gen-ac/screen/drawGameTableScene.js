
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';

export default function drawGameTableScene() {
    const dict = new Map();
    const all = new Set();

    const TIMER_COLON = Sprites.create(262, 0.008333333333333333, 3.6, -4.5);
    dict.set(0, TIMER_COLON);
    all.add(TIMER_COLON);

    all.add(Sprites.create(257, 0.39166666666666666, 3.9458333333333333, -4.5));

    all.add(Sprites.create(261, -0.30416666666666664, 3.925, -4.5));

    const HND_RNK = Sprites.create(115, 0, -2.9125, -4.5);
    dict.set(1, HND_RNK);
    all.add(HND_RNK);
    Sprites.setZ(HND_RNK >> VERSION_BITS, 1.0);

    const PLACE_3 = Sprites.create(94, 0.004166666666666667, -0.004166666666666667, -4.5);
    dict.set(2, PLACE_3);
    all.add(PLACE_3);
    Sprites.setZ(PLACE_3 >> VERSION_BITS, 1.0);

    const PLACE_2 = Sprites.create(93, 0.004166666666666667, -0.004166666666666667, -4.5);
    dict.set(3, PLACE_2);
    all.add(PLACE_2);
    Sprites.setZ(PLACE_2 >> VERSION_BITS, 1.0);

    const WON_LABEL = Sprites.create(96, 0.004166666666666667, -0.004166666666666667, -4.5);
    dict.set(4, WON_LABEL);
    all.add(WON_LABEL);
    Sprites.setZ(WON_LABEL >> VERSION_BITS, 1.0);

    const NO_WIN = Sprites.create(16, 0.004166666666666667, -0.004166666666666667, -4.5);
    dict.set(5, NO_WIN);
    all.add(NO_WIN);
    Sprites.setZ(NO_WIN >> VERSION_BITS, 1.0);

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
