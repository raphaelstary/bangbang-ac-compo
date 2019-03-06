import drawConnectScene from '../../../code-gen-ac/controller/drawConnectScene.js';
import { NEXT_SCENE } from '../../common/constants/Command.js';
import Sprites from '../../../code-src-h5x/render/Sprites.js';
import { INVALID_INDEX } from '../../../code-src-h5x/render/constants/BaseECS.js';
import {
    SHOOT_ACTIVE_BUTTON,
    SHOOT_BUTTON,
    RESET_ACTIVE_BUTTON,
    RESET_BUTTON
} from '../../../code-gen-ac/controller/SubImage.js';
import * as ConnectSceneSprite from '../../../code-gen-ac/controller/ConnectSceneSprite.js';
import * as ConnectSceneTouch from '../../../code-gen-ac/controller/ConnectSceneTouch.js';
import * as PacketBuffer from '../net/PacketBuffer.js';
import Audio from '../../../code-src-h5x/audio/Audio.js';
import {
    GUNSHOT,
    RELOAD
} from '../../../code-gen-ac/controller/SFXSegment.js';

export default function showConnect(air, updateFunctions, deviceOrientation, calibratedCenter, cursor) {
    const {dict, touches, removeSprites, removeTouches} = drawConnectScene();

    const shootBtn = touches.get(ConnectSceneTouch.SHOOT_BTN);
    const resetBtn = touches.get(ConnectSceneTouch.RESET_BTN);
    const shootBtnId = dict.get(ConnectSceneSprite.SHOOT_BTN);
    const resetBtnId = dict.get(ConnectSceneSprite.RESET_BTN);

    let frame = 0;
    const inputBuffer = PacketBuffer.get();
    const inputDataView = new Uint8Array(inputBuffer);

    function updateInput() {
        if (nextScene) {
            removeTouches();
            removeSprites();
            air.onMessage = undefined;
            updateFunctions.splice(inputIdx, 1);

            itIsOver(nextScene);
            return;
        }

        let shoot = false;

        if (!shootBtn.oldTouched && shootBtn.newTouched) {
            shoot = true;
            air.vibrate(100);

            Audio.playSound(GUNSHOT);

            const idx = Sprites.getIndex(shootBtnId);
            if (idx != INVALID_INDEX) {
                Sprites.setSubImage(idx, SHOOT_ACTIVE_BUTTON);
            }

        } else if (shootBtn.oldTouched && !shootBtn.newTouched) {

            const idx = Sprites.getIndex(shootBtnId);
            if (idx != INVALID_INDEX) {
                Sprites.setSubImage(idx, SHOOT_BUTTON);
            }
        }

        if (!resetBtn.oldTouched && resetBtn.newTouched) {
            calibratedCenter.alpha = deviceOrientation.alpha;
            calibratedCenter.beta = deviceOrientation.beta;
            calibratedCenter.gamma = deviceOrientation.gamma;

            cursor.x = 0;
            cursor.y = 0;

            Audio.playSound(RELOAD);

            const idx = Sprites.getIndex(resetBtnId);
            if (idx != INVALID_INDEX) {
                Sprites.setSubImage(idx, RESET_ACTIVE_BUTTON);
            }

        } else if (resetBtn.oldTouched && !resetBtn.newTouched) {

            const idx = Sprites.getIndex(resetBtnId);
            if (idx != INVALID_INDEX) {
                Sprites.setSubImage(idx, RESET_BUTTON);
            }
        }

        PacketBuffer.setFrame(frame, false, shoot, cursor.x, cursor.y);
        if (frame == 5) {
            air.message(AirConsole.SCREEN, inputDataView);
            PacketBuffer.clear();
            frame = 0;
        } else {
            frame++;
        }
    }

    const inputIdx = updateFunctions.push(updateInput) - 1;

    let nextScene;
    let itIsOver;

    air.onMessage = (device_id, data) => {
        if (data[0] == NEXT_SCENE) {
            nextScene = data[1];
        }
    };

    return new Promise(resolve => itIsOver = resolve);
}
