import loadAssets from './net/loadAssets.js';
import { processAssets } from '../../code-src-h5x/render/setupWebGL.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';
import eventLoop from '../../code-src-h5x/app/eventLoop.js';
import runMyScenes from './scenes/runMyScenes.js';
import { VERSION_BITS } from '../../code-src-h5x/render/constants/BaseECS.js';
import createACStub from '../common/createACStub.js';
import { update as updatePointers } from './input/Pointers.js';
import OrientationState from './input/OrientationState.js';
import {
    set as setOrientation,
    normalize as normalizeOrientation,
    reset as resetOrientation
} from './input/DeviceOrientation.js';

loadAssets.then(processAssets).then(() => {

    function makeSmaller(char) {
        Sprites.setScale(char >> VERSION_BITS, 0.6);
    }

    function hide(id) {
        Sprites.setZ(id >> VERSION_BITS, 1.0);
    }

    // where to put those lines ... ?
    const fpsTxt = Sprites.createDebugText('00 fps', 7.0 * 0.5, -3.8 * 2, -8);
    fpsTxt.forEach(makeSmaller);
    const msTxt = Sprites.createDebugText('00  ms', 7.0 * 0.5, -3.8 * 2 - 0.2, -8);
    msTxt.forEach(makeSmaller);

    const leftThumbX = Sprites.createDebugText('n0.00', 8.0 * 0.5, -3.6 * 2, -8);
    leftThumbX.forEach(makeSmaller);
    leftThumbX.forEach(hide);
    const leftThumbY = Sprites.createDebugText('n0.00', 8.0 * 0.5, -3.6 * 2 - 0.2, -8);
    leftThumbY.forEach(makeSmaller);
    leftThumbY.forEach(hide);

    const forceX = Sprites.createDebugText('n0.00', 8.0 * 0.5, -3.4 * 2, -8);
    forceX.forEach(makeSmaller);
    forceX.forEach(hide);
    const forceY = Sprites.createDebugText('n0.00', 8.0 * 0.5, -3.4 * 2 - 0.2, -8);
    forceY.forEach(makeSmaller);
    forceY.forEach(hide);

    const fpsMin = Sprites.createDebugText('00 min', 8.0 * 0.5, -3.8 * 2, -8);
    fpsMin.forEach(makeSmaller);
    const msMax = Sprites.createDebugText('00 max', 8.0 * 0.5, -3.8 * 2 - 0.2, -8);
    msMax.forEach(makeSmaller);

    const updateFunctions = [updatePointers];
    eventLoop(updateFunctions);

    const air =
        window.TEST_SERVER ?
            createACStub(WS_URL, false, true, true, AirConsole.ORIENTATION_PORTRAIT)
            :
            new AirConsole({
                orientation: AirConsole.ORIENTATION_PORTRAIT,
                device_motion: 16
            });

    const deviceOrientation = new OrientationState(0, 0, 0);
    setOrientation(deviceOrientation);
    const centerOrientation = new OrientationState(0, 0, 0);
    resetOrientation(centerOrientation);
    const cursor = normalizeOrientation();

    /**
     * @param {{alpha: number, beta: number, gamma: number}} data - gyroscope data
     */
    air.onDeviceMotion = ({alpha, beta, gamma}) => {
        deviceOrientation.alpha = alpha;
        deviceOrientation.beta = beta;
        deviceOrientation.gamma = gamma;
    };

    updateFunctions.push(normalizeOrientation);

    runMyScenes(air, updateFunctions, deviceOrientation, centerOrientation, cursor);
});
