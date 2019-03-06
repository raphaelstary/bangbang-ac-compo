export const FRAME = Object.freeze({
    0: 0b00000001,
    1: 0b00000010,
    2: 0b00000100,
    3: 0b00001000,
    4: 0b00010000,
    5: 0b00100000
});

/**
 * [
 *  FRAME_0
 *  {
 *      {Float32} x                     4 byte
 *      {Float32} y                     4 byte
 *  }
 *  FRAME_1
 * {
 *      {Float32} x                     4 byte
 *      {Float32} y                     4 byte
 *  }
 *  FRAME_2
 * {
 *      {Float32} x                     4 byte
 *      {Float32} y                     4 byte
 *  }
 *  FRAME_3
 * {
 *      {Float32} x                     4 byte
 *      {Float32} y                     4 byte
 *  }
 *  FRAME_4
 * {
 *      {Float32} x                     4 byte
 *      {Float32} y                     4 byte
 *  }
 *  FRAME_5
 * {
 *      {Float32} x                     4 byte
 *      {Float32} y                     4 byte
 *  }
 * ]
 * {Uint8} sec.-action frame flags      1 byte
 * {Uint8} shoot frame flags            1 byte
 *
 * 1 byte + 1 byte + (6 * 8 byte) = 50 byte
 */
export const FRAME_BYTE_SIZE = 50;