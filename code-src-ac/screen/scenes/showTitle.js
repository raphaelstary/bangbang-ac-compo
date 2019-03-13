import drawTitleScene from '../../../code-gen-ac/screen/drawTitleScene.js';
import { CONNECT } from '../../common/constants/Scene.js';
import { getUtterance } from '../../common/Utterances.js';

export default function showTitle(air, updateFunctions, airState, synth) {
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

    if (synth) {
        synth.speak(getUtterance('Welcome to Bang Bang Poker'));
    }

    return new Promise(resolve => itIsOver = resolve);
}
