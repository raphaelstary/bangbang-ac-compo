import {
    FRAME,
    FRAME_BYTE_SIZE
} from '../../common/constants/Protocol.js';

/**
 * for details of the protocol
 * @see {FRAME_BYTE_SIZE}
 *
 * @type {ArrayBuffer}
 */
const buffer = new ArrayBuffer(FRAME_BYTE_SIZE);
const flagView = new Uint8Array(buffer, 48, 2);
const cursorView = new Float32Array(buffer, 0, 12);

/**
 * set 1 of 6 buffered frames [0..5].
 *
 * buffer 6 frames of input, then send all the frames together as buffer to the screen (server).
 *
 * @param {number} index [0..5]
 * @param {boolean} backBtnFired
 * @param {boolean} shootBtnFired
 * @param {number} x cursor value
 * @param {number} y cursor value
 */
export function setFrame(index, backBtnFired, shootBtnFired, x, y) {
    if (backBtnFired) {
        flagView[0] |= FRAME[index];
    }

    if (shootBtnFired) {
        flagView[1] |= FRAME[index];
    }

    cursorView[index * 2] = x;
    cursorView[index * 2 + 1] = y;
}

/**
 * clear the buffer data - zero it out
 */
export function clear() {
    flagView[0] = 0;
    flagView[1] = 0;
    for (let i = 0; i < cursorView.length; i++) {
        cursorView[i] = 0;
    }
}

/**
 * get reference to the buffer data
 *
 * @return {ArrayBuffer}
 */
export function get() {
    return buffer;
}