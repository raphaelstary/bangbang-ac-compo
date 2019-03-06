import drawScoreBoardScene from '../../../code-gen-ac/screen/drawScoreBoardScene.js';
import { NONE } from '../../common/constants/CursorColor.js';
import Sprites from '../../../code-src-h5x/render/Sprites.js';
import {
    INVALID_INDEX,
    VERSION_BITS
} from '../../../code-src-h5x/render/constants/BaseECS.js';
import PositionAnimations from '../../../code-src-h5x/render/animations/PositionAnimations.js';
import { EASE_IN_QUAD } from '../../../code-src-h5x/render/animations/Transform.js';
import * as SubImage from '../../../code-gen-ac/screen/SubImage.js';
import * as ScoreBoardScenePoint from '../../../code-gen-ac/screen/ScoreBoardScenePoint.js';
import * as Scene from '../../common/constants/Scene.js';
import Card from '../model/entity/Card.js';
import { assetStore } from '../../../code-src-h5x/render/setupWebGL.js';
import { DIM_ELEMENTS } from '../../../code-src-h5x/render/constants/DimBuffer.js';
import Audio from '../../../code-src-h5x/audio/Audio.js';
import {
    SHOT,
    DRAW_CARD
} from '../../../code-gen-ac/screen/SFXSegment.js';

export default function showScoreBoard(air, updateFunctions, airState) {
    const {all, dict, removeSprites} = drawScoreBoardScene();

    const cards = [];
    const holes = [];
    const RADIUS = assetStore.spriteDimensions[SubImage.BULLET_HOLE * DIM_ELEMENTS];

    function updateScene() {

        if (airState.disconnectUpdate) {
            // todo handle player dropping out
        }


        for (const player of airState.players.values()) {
            if (!player.calibrated || player.color == NONE) {
                continue;
            }

            {
                if (player.buffering) {
                    // console.log(player.device + ' has to buffer');
                    continue;
                }

                const cursorView = player.currentLow ? player.cursorViewLow : player.cursorViewHigh;

                player.x = cursorView[player.currentFrame * 2] * 8;
                player.y = cursorView[player.currentFrame * 2 + 1] * 4.5;

                const idx = Sprites.getIndex(player.cursor);
                if (idx != INVALID_INDEX) {
                    Sprites.setX(idx, player.x);
                    Sprites.setY(idx, player.y);
                }

                const flagView = player.currentLow ? player.flagViewHigh : player.flagViewLow;
                if (flagView[0]) {
                    // secondary action fired
                }

                if (flagView[1]) {
                    flagView[1] = 0;

                    let hit = false;

                    Audio.playSound(SHOT);

                    for (let i = cards.length - 1; i >= 0; i--) {
                        const card = cards[i];

                        if (player.x + RADIUS > card.left && player.x - RADIUS < card.right && player.y + RADIUS
                            > card.top && player.y - RADIUS < card.bottom) {

                            cards.splice(i, 1);

                            Sprites.setColor(card.sprite >> VERSION_BITS, 0, 0, 0, 0.5);
                            const discardingResumeCard = PositionAnimations.create(card.sprite, 20, 1, -5, -4, EASE_IN_QUAD);

                            PositionAnimations.setCallback(discardingResumeCard >> VERSION_BITS, endScene);

                            hit = true;
                            break;
                        }
                    }

                    if (hit) {
                        holes.push(Sprites.create(SubImage.BULLET_HOLE, player.x, player.y, -4.4999));
                    } else {
                        holes.push(Sprites.create(SubImage.BULLET_HOLE, player.x, player.y, -4.5001));
                    }
                }


                if (player.currentFrame == 5) {
                    player.currentFrame = 0;
                    player.buffering = player.currentLow == player.lastSetLow;
                    player.currentLow = player.lastSetLow;
                } else {
                    player.currentFrame++;
                }
            }
        }

    }

    const updateIdx = updateFunctions.push(updateScene) - 1;

    function drawResumeCard() {
        const card = new Card();
        const sprite = Sprites.create(SubImage.CARD_RESUME, -1, 5, -4);
        all.add(sprite);

        const point = ScoreBoardScenePoint.RESUME_1;
        const posAnim = PositionAnimations.create(sprite, 30, point.x, point.y, point.z, EASE_IN_QUAD);
        PositionAnimations.delay(posAnim >> VERSION_BITS, 60);

        const idx = sprite >> VERSION_BITS;
        const widthHalf = Sprites.getWidthHalf(idx);
        const heightHalf = Sprites.getHeightHalf(idx);

        card.sprite = sprite;
        card.left = point.x - widthHalf;
        card.top = point.y - heightHalf;
        card.right = point.x + widthHalf;
        card.bottom = point.y + heightHalf;

        PositionAnimations.setCallback(posAnim >> VERSION_BITS, () => {
            Audio.playSound(DRAW_CARD);
            cards.push(card);
        });
    }

    function remove(sprite) {
        const idx = Sprites.getIndex(sprite);
        if (idx != INVALID_INDEX) {
            Sprites.remove(idx);
        }
    }

    function endScene() {
        updateFunctions.splice(updateIdx, 1);

        holes.forEach(remove);
        removeSprites();

        if (gameOver) {
            nextScene(Scene.POST_GAME);
        } else {
            nextScene(Scene.GAME);
        }
    }

    let gameOver = false;

    let i = 0;
    for (const player of airState.players.values()) {

        const avatarPoint = ScoreBoardScenePoint[`PIC_${i}`];
        const avatar = Sprites.create(assetStore.avatarSubImages.get(player.name), avatarPoint.x, avatarPoint.y, avatarPoint.z);
        all.add(avatar);

        const phonePoint = ScoreBoardScenePoint['P' + i];
        const phone = Sprites.create(player.phone, phonePoint.x, phonePoint.y, phonePoint.z);
        Sprites.setColor(phone >> VERSION_BITS, player.colorRef.r, player.colorRef.g, player.colorRef.b, 0.5);
        all.add(phone);

        const medalPoints = [
            ScoreBoardScenePoint[`M0_P${i}`],
            ScoreBoardScenePoint[`M1_P${i}`],
            ScoreBoardScenePoint[`M2_P${i}`],
            ScoreBoardScenePoint[`M3_P${i}`],
            ScoreBoardScenePoint[`M4_P${i}`]
        ];

        const medals = [
            Sprites.create(SubImage.MEDAL, medalPoints[0].x, medalPoints[0].y, medalPoints[0].z),
            Sprites.create(SubImage.MEDAL, medalPoints[1].x, medalPoints[1].y, medalPoints[1].z),
            Sprites.create(SubImage.MEDAL, medalPoints[2].x, medalPoints[2].y, medalPoints[2].z),
            Sprites.create(SubImage.MEDAL, medalPoints[3].x, medalPoints[3].y, medalPoints[3].z),
            Sprites.create(SubImage.MEDAL, medalPoints[4].x, medalPoints[4].y, medalPoints[4].z)
        ];

        medals.forEach(medal => all.add(medal));

        if (player.won >= 5) {
            gameOver = true;
        }

        let u = player.won - 1;

        while (u >= 0) {
            const medalId = medals[u];
            Sprites.setSubImage(medalId >> VERSION_BITS, player.medal);
            u--;
        }

        i++;
    }

    if (gameOver) {
        setTimeout(endScene, 16 * 30);
    } else {
        drawResumeCard();
    }

    let nextScene;
    return new Promise(resolve => nextScene = resolve);
}