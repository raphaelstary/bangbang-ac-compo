import showTitle from './showTitle.js';
import * as Scene from '../../common/constants/Scene.js';
import showConnect from './showConnect.js';
import showTableGame from './showTableGame.js';
import showScoreBoard from './showScoreBoard.js';
import showPostGame from './showPostGame.js';
import showRules from './showRules.js';

/**
 *
 * @param {AirConsole} air
 * @param {<function>[]} updateFunctions
 * @param {{connectUpdate: boolean, disconnectUpdate: boolean, profileUpdate: boolean}} airState
 */
export default function runMyScenes(air, updateFunctions, airState) {

    function nextScene(scene) {
        if (scene == Scene.CONNECT) {
            showConnect(air, updateFunctions, airState)
                .then(nextScene);
        } else if (scene == Scene.GAME) {
            showTableGame(air, updateFunctions, airState)
                .then(nextScene);
        } else if (scene == Scene.SCORE_BOARD) {
            showScoreBoard(air, updateFunctions, airState)
                .then(nextScene);
        } else if (scene == Scene.POST_GAME) {
            showPostGame(air, updateFunctions, airState)
                .then(nextScene);
        } else if (scene == Scene.RULES) {
            showRules(air, updateFunctions, airState)
                .then(nextScene);
        }
    }

    showTitle(air, updateFunctions, airState)
        .then(nextScene);
}
