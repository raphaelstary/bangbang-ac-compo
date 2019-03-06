import showTitle from './showTitle.js';
import { CONNECT } from '../../common/constants/Scene.js';
import showConnect from './showConnect.js';

export default function runMyScenes(air, updateFunctions, deviceOrientation, calibratedCenter, cursor) {

    function nextScene(scene) {
        if (scene == CONNECT) {
            showConnect(air, updateFunctions, deviceOrientation, calibratedCenter, cursor)
                .then(nextScene);

        }
    }

    showTitle(air, updateFunctions, deviceOrientation, calibratedCenter, cursor)
        .then(nextScene);
}
