export default class TouchArea {
    /**
     * @param {number} a_x
     * @param {number} a_y
     * @param {number} b_x
     * @param {number} b_y
     */
    constructor(a_x, a_y, b_x, b_y) {

        /** @type {number} */
        this.left = a_x;
        /** @type {number} */
        this.top = a_y;
        /** @type {number} */
        this.right = b_x;
        /** @type {number} */
        this.bottom = b_y;

        /** @type {boolean} */
        this.oldTouched = false;
        /** @type {boolean} */
        this.newTouched = false;

        Object.seal(this);
    }
}
