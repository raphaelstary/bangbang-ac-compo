import { NONE } from '../common/constants/CursorColor.js';
import {
    BULLET_HOLE,
    PHONE_CONNECTED,
    MEDAL
} from '../../code-gen-ac/screen/SubImage.js';

export default class ACPlayer {
    constructor(device_id, nickname, uid) {
        /** @type {number} */
        this.device = device_id;
        /** @type {boolean} */
        this.calibrated = false;
        /**
         * value from CursorColor.NONE to CursorColor.VIOLET [-1..7]
         * @type {number}
         */
        this.color = NONE;
        /** @type {Color} */
        this.colorRef = undefined;
        /** @type {string} */
        this.name = nickname;
        /** @type {string} */
        this.uid = uid;
        /** @type {Image} */
        this.img = undefined;

        /** @type {number} */
        this.cursor = undefined;
        /** @type {number} */
        this.bulletHole = BULLET_HOLE;
        /** @type {number} */
        this.phone = PHONE_CONNECTED;
        /** @type {number} */
        this.x = 0;
        /** @type {number} */
        this.y = 0;

        /** @type {number} */
        this.medal = MEDAL;
        /** @type {number} */
        this.won = 0;

        const buffer = new ArrayBuffer(102);

        this.cursorViewLow = new Float32Array(buffer, 0, 12);
        this.flagViewLow = new Uint8Array(buffer, 48, 2);

        this.cursorViewHigh = new Float32Array(buffer, 52, 12);
        this.flagViewHigh = new Uint8Array(buffer, 100, 2);

        this.dataViewLow = new Uint8Array(buffer, 0, 50);
        this.dataViewHigh = new Uint8Array(buffer, 52, 50);

        this.currentLow = true;
        this.currentFrame = 0;
        this.lastSetLow = true;
        this.buffering = false;

        Object.seal(this);
    }

    /**
     * @param {ArrayLike<number>} buffer - buffer.length must be 50, values must be uint8
     */
    setDataLow(buffer) {
        for (let i = 0; i < 50; i++) {
            this.dataViewLow[i] = buffer[i];
        }
        this.lastSetLow = true;
        if (this.buffering) {
            this.buffering = false;
            this.currentLow = true;
        }
    }

    /**
     * @param {ArrayLike<number>} buffer - buffer.length must be 50, values must be uint8
     */
    setDataHigh(buffer) {
        for (let i = 0; i < 50; i++) {
            this.dataViewHigh[i] = buffer[i];
        }
        this.lastSetLow = false;
        if (this.buffering) {
            this.buffering = false;
            this.currentLow = false;
        }
    }
}
