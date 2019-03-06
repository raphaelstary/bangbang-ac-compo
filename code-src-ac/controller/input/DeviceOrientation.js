/** @type {OrientationState} */
let center;
/** @type {OrientationState} */
let current;

/**
 * setting an object reference
 *
 * @param {OrientationState} centerOrientation
 */
export function reset(centerOrientation) {
    center = centerOrientation;
}

/**
 * setting an object reference
 *
 * @param {OrientationState} currentOrientation
 */
export function set(currentOrientation) {
    current = currentOrientation;
}

class NormalizedOrientation {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        Object.seal(this);
    }
}

const normal = new NormalizedOrientation(0, 0);

/**
 * updating the singleton object reference
 *
 * @return {NormalizedOrientation} singleton of the normalized orientation state
 */
export function normalize() {

    let centeredAlpha = current.alpha - center.alpha;

    let wrappedAlpha = (centeredAlpha + 180) % 360;
    if (wrappedAlpha < 0) {
        wrappedAlpha += 360;
    }
    let normalizedAlpha = wrappedAlpha - 180;

    const xNormalized = (normalizedAlpha + 45) / 90;
    let xScaled = xNormalized * 2 - 1;
    if (xScaled < -1) {
        xScaled = -1;
    } else if (xScaled > 1) {
        xScaled = 1;
    }
    normal.x = xScaled * -1;

    let yNormalized = (current.beta - (center.beta - 25)) / 50;
    let yScaled = yNormalized * 2 - 1;
    if (yScaled < -1) {
        yScaled = -1;
    } else if (yScaled > 1) {
        yScaled = 1;
    }
    normal.y = yScaled;

    return normal;
}