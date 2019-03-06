import drawTitleScene from '../../../code-gen-ac/controller/drawTitleScene.js';
import { NEXT_SCENE } from '../../common/constants/Command.js';
import Sprites from '../../../code-src-h5x/render/Sprites.js';
import * as TitleSceneSprite from '../../../code-gen-ac/controller/TitleSceneSprite.js';
import * as TitleSceneTouch from '../../../code-gen-ac/controller/TitleSceneTouch.js';
import { INVALID_INDEX } from '../../../code-src-h5x/render/constants/BaseECS.js';
import {
    SHOOT_ACTIVE_BUTTON,
    SHOOT_BUTTON
} from '../../../code-gen-ac/controller/SubImage.js';
import * as PacketBuffer from '../net/PacketBuffer.js';
import { RELOAD } from '../../../code-gen-ac/controller/SFXSegment.js';
import Audio from '../../../code-src-h5x/audio/Audio.js';

export default function showTitle(air, updateFunctions, deviceOrientation, calibratedCenter, cursor) {

    const {dict, touches, removeSprites, removeTouches} = drawTitleScene();

    const shootBtn = touches.get(TitleSceneTouch.SHOOT_BTN);
    const shootBtnId = dict.get(TitleSceneSprite.SHOOT_BTN);

    let nextScene;
    let itIsOver;
    let calibrated = false;

    let frame = 0;
    let anotherFrame = 0;
    const inputBuffer = PacketBuffer.get();
    const inputDataView = new Uint8Array(inputBuffer);

    {
        calibratedCenter.alpha = deviceOrientation.alpha;
        calibratedCenter.beta = 0;
        calibratedCenter.gamma = 0;
    }

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

            {
                calibratedCenter.alpha = deviceOrientation.alpha;
                calibratedCenter.beta = deviceOrientation.beta;
                calibratedCenter.gamma = deviceOrientation.gamma;

                calibrated = true;
            }

            shoot = true;
            air.vibrate(100);

            Audio.playSound(RELOAD);

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

        {
            if (!calibrated && anotherFrame % 30 == 0) {
                calibratedCenter.alpha = deviceOrientation.alpha;

                if (-40 < deviceOrientation.beta && deviceOrientation.beta < 40) {
                    calibratedCenter.beta = deviceOrientation.beta;
                } else {
                    calibratedCenter.beta = 0;
                }

                if (-45 < deviceOrientation.gamma && deviceOrientation.gamma < 45) {
                    calibratedCenter.gamma = deviceOrientation.gamma;
                } else {
                    calibratedCenter.gamma = 0;
                }
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

        anotherFrame++;
    }

    const inputIdx = updateFunctions.push(updateInput) - 1;

    air.onMessage = (device_id, data) => {
        if (data[0] == NEXT_SCENE) {
            nextScene = data[1];
        }
    };

    return new Promise(resolve => itIsOver = resolve);
}
