
import { VERSION_BITS, INVALID_INDEX } from '../../code-src-h5x/render/constants/BaseECS.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';

export default function drawConnectScene() {
    const dict = new Map();
    const all = new Set();

    const DONE_0 = Sprites.create(265, -6.395833333333333, -2.0625, -4.5);
    dict.set(0, DONE_0);
    all.add(DONE_0);
    Sprites.setZ(DONE_0 >> VERSION_BITS, 1.0);

    const DONE_1 = Sprites.create(265, -4.570833333333334, -2.0625, -4.5);
    dict.set(1, DONE_1);
    all.add(DONE_1);
    Sprites.setZ(DONE_1 >> VERSION_BITS, 1.0);

    const DONE_2 = Sprites.create(265, -2.7375, -2.0625, -4.5);
    dict.set(2, DONE_2);
    all.add(DONE_2);
    Sprites.setZ(DONE_2 >> VERSION_BITS, 1.0);

    const DONE_3 = Sprites.create(265, -0.9125, -2.0625, -4.5);
    dict.set(3, DONE_3);
    all.add(DONE_3);
    Sprites.setZ(DONE_3 >> VERSION_BITS, 1.0);

    const DONE_4 = Sprites.create(265, 0.9125, -2.0625, -4.5);
    dict.set(4, DONE_4);
    all.add(DONE_4);
    Sprites.setZ(DONE_4 >> VERSION_BITS, 1.0);

    const DONE_5 = Sprites.create(265, 2.7375, -2.0625, -4.5);
    dict.set(5, DONE_5);
    all.add(DONE_5);
    Sprites.setZ(DONE_5 >> VERSION_BITS, 1.0);

    const DONE_6 = Sprites.create(265, 4.570833333333334, -2.0625, -4.5);
    dict.set(6, DONE_6);
    all.add(DONE_6);
    Sprites.setZ(DONE_6 >> VERSION_BITS, 1.0);

    const DONE_7 = Sprites.create(265, 6.395833333333333, -2.0625, -4.5);
    dict.set(7, DONE_7);
    all.add(DONE_7);
    Sprites.setZ(DONE_7 >> VERSION_BITS, 1.0);

    const PLUS_0 = Sprites.create(131, -6.408333333333333, -3.020833333333333, -4.5);
    dict.set(8, PLUS_0);
    all.add(PLUS_0);
    Sprites.setZ(PLUS_0 >> VERSION_BITS, 1.0);

    const PLUS_1 = Sprites.create(131, -4.583333333333333, -3.020833333333333, -4.5);
    dict.set(9, PLUS_1);
    all.add(PLUS_1);
    Sprites.setZ(PLUS_1 >> VERSION_BITS, 1.0);

    const PLUS_2 = Sprites.create(131, -2.75, -3.020833333333333, -4.5);
    dict.set(10, PLUS_2);
    all.add(PLUS_2);
    Sprites.setZ(PLUS_2 >> VERSION_BITS, 1.0);

    const PLUS_3 = Sprites.create(131, -0.925, -3.020833333333333, -4.5);
    dict.set(11, PLUS_3);
    all.add(PLUS_3);
    Sprites.setZ(PLUS_3 >> VERSION_BITS, 1.0);

    const PLUS_4 = Sprites.create(131, 0.9, -3.020833333333333, -4.5);
    dict.set(12, PLUS_4);
    all.add(PLUS_4);
    Sprites.setZ(PLUS_4 >> VERSION_BITS, 1.0);

    const PLUS_5 = Sprites.create(131, 2.725, -3.020833333333333, -4.5);
    dict.set(13, PLUS_5);
    all.add(PLUS_5);
    Sprites.setZ(PLUS_5 >> VERSION_BITS, 1.0);

    const PLUS_6 = Sprites.create(131, 4.558333333333334, -3.020833333333333, -4.5);
    dict.set(14, PLUS_6);
    all.add(PLUS_6);
    Sprites.setZ(PLUS_6 >> VERSION_BITS, 1.0);

    const PLUS_7 = Sprites.create(131, 6.383333333333334, -3.020833333333333, -4.5);
    dict.set(15, PLUS_7);
    all.add(PLUS_7);
    Sprites.setZ(PLUS_7 >> VERSION_BITS, 1.0);

    const CONNECT_0 = Sprites.create(270, -6.404166666666667, -3.9166666666666665, -4.5);
    dict.set(16, CONNECT_0);
    all.add(CONNECT_0);
    Sprites.setZ(CONNECT_0 >> VERSION_BITS, 1.0);

    const CONNECT_1 = Sprites.create(270, -4.579166666666667, -3.9166666666666665, -4.5);
    dict.set(17, CONNECT_1);
    all.add(CONNECT_1);
    Sprites.setZ(CONNECT_1 >> VERSION_BITS, 1.0);

    const CONNECT_2 = Sprites.create(270, -2.745833333333333, -3.9166666666666665, -4.5);
    dict.set(18, CONNECT_2);
    all.add(CONNECT_2);
    Sprites.setZ(CONNECT_2 >> VERSION_BITS, 1.0);

    const CONNECT_3 = Sprites.create(270, -0.9208333333333333, -3.9166666666666665, -4.5);
    dict.set(19, CONNECT_3);
    all.add(CONNECT_3);
    Sprites.setZ(CONNECT_3 >> VERSION_BITS, 1.0);

    const CONNECT_4 = Sprites.create(270, 0.9041666666666667, -3.9166666666666665, -4.5);
    dict.set(20, CONNECT_4);
    all.add(CONNECT_4);
    Sprites.setZ(CONNECT_4 >> VERSION_BITS, 1.0);

    const CONNECT_5 = Sprites.create(270, 2.7291666666666665, -3.9166666666666665, -4.5);
    dict.set(21, CONNECT_5);
    all.add(CONNECT_5);
    Sprites.setZ(CONNECT_5 >> VERSION_BITS, 1.0);

    const CONNECT_6 = Sprites.create(270, 4.5625, -3.9166666666666665, -4.5);
    dict.set(22, CONNECT_6);
    all.add(CONNECT_6);
    Sprites.setZ(CONNECT_6 >> VERSION_BITS, 1.0);

    const CONNECT_7 = Sprites.create(270, 6.3875, -3.9166666666666665, -4.5);
    dict.set(23, CONNECT_7);
    all.add(CONNECT_7);
    Sprites.setZ(CONNECT_7 >> VERSION_BITS, 1.0);

    const PHONE_0 = Sprites.create(98, -6.408333333333333, -3.0833333333333335, -4.5);
    dict.set(24, PHONE_0);
    all.add(PHONE_0);

    const PHONE_1 = Sprites.create(98, -4.583333333333333, -3.0833333333333335, -4.5);
    dict.set(25, PHONE_1);
    all.add(PHONE_1);

    const PHONE_2 = Sprites.create(98, -2.75, -3.0833333333333335, -4.5);
    dict.set(26, PHONE_2);
    all.add(PHONE_2);

    const PHONE_3 = Sprites.create(98, -0.925, -3.0833333333333335, -4.5);
    dict.set(27, PHONE_3);
    all.add(PHONE_3);

    const PHONE_4 = Sprites.create(98, 0.9, -3.0833333333333335, -4.5);
    dict.set(28, PHONE_4);
    all.add(PHONE_4);

    const PHONE_5 = Sprites.create(98, 2.725, -3.0833333333333335, -4.5);
    dict.set(29, PHONE_5);
    all.add(PHONE_5);

    const PHONE_6 = Sprites.create(98, 4.558333333333334, -3.0833333333333335, -4.5);
    dict.set(30, PHONE_6);
    all.add(PHONE_6);

    const PHONE_7 = Sprites.create(98, 6.383333333333334, -3.0833333333333335, -4.5);
    dict.set(31, PHONE_7);
    all.add(PHONE_7);

    const C_TXT = Sprites.create(105, 0.004166666666666667, 2.291666666666667, -4.5);
    dict.set(32, C_TXT);
    all.add(C_TXT);

    const POINT_R = Sprites.create(4, 6.370833333333334, 0.1125, -4.5);
    dict.set(33, POINT_R);
    all.add(POINT_R);
    Sprites.setZ(POINT_R >> VERSION_BITS, 1.0);

    const POINT_L = Sprites.create(3, -6.370833333333334, 0.1125, -4.5);
    dict.set(34, POINT_L);
    all.add(POINT_L);
    Sprites.setZ(POINT_L >> VERSION_BITS, 1.0);

    const BULLSEYE = Sprites.create(2, 0.09583333333333334, 0.1125, -4.5);
    dict.set(35, BULLSEYE);
    all.add(BULLSEYE);
    Sprites.setZ(BULLSEYE >> VERSION_BITS, 1.0);

    all.add(Sprites.create(99, 4.783333333333333, 3.6166666666666667, -4.5));

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
