import drawTitleScene from '../../../code-gen-ac/screen/drawTitleScene.js';
import { CONNECT } from '../../common/constants/Scene.js';

export default function showTitle(air, updateFunctions, airState) {
    const {removeSprites} = drawTitleScene();

    let itIsOver;

    function handleFirstPlayerConnect() {
        if (airState.connectUpdate) {
            airState.connectUpdate = false;

            removeSprites();
            updateFunctions.splice(updateIdx, 1);

            itIsOver(CONNECT);
        }
    }

    const updateIdx = updateFunctions.push(handleFirstPlayerConnect) - 1;

    return new Promise(resolve => itIsOver = resolve);
}
