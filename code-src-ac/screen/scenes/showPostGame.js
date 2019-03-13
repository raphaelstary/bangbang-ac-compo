import { NONE } from '../../common/constants/CursorColor.js';
import Sprites from '../../../code-src-h5x/render/Sprites.js';
import {
    INVALID_INDEX,
    VERSION_BITS
} from '../../../code-src-h5x/render/constants/BaseECS.js';
import PositionAnimations from '../../../code-src-h5x/render/animations/PositionAnimations.js';
import { EASE_IN_QUAD } from '../../../code-src-h5x/render/animations/Transform.js';
import * as SubImage from '../../../code-gen-ac/screen/SubImage.js';
import * as PostGameScenePoint from '../../../code-gen-ac/screen/PostGameScenePoint.js';
import * as PostGameSceneSprite from '../../../code-gen-ac/screen/PostGameSceneSprite.js';
import * as Scene from '../../common/constants/Scene.js';
import Card from '../model/entity/Card.js';
import { assetStore } from '../../../code-src-h5x/render/setupWebGL.js';
import { DIM_ELEMENTS } from '../../../code-src-h5x/render/constants/DimBuffer.js';
import drawPostGameScene from '../../../code-gen-ac/screen/drawPostGameScene.js';
import Audio from '../../../code-src-h5x/audio/Audio.js';
import {
    SHOT,
    DRAW_CARD
} from '../../../code-gen-ac/screen/SFXSegment.js';
import { getUtterance } from '../../common/Utterances.js';

export default function showScoreBoard(air, updateFunctions, airState, synth) {
    const {all, dict, removeSprites} = drawPostGameScene();

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

                const defaultFlagView = player.currentLow ? player.flagViewHigh : player.flagViewLow;

                if (player.flagViewHigh[0] || player.flagViewLow[0]) {
                    // secondary action fired

                    if (player.flagViewHigh[0] && player.flagViewLow[0]) {
                        defaultFlagView[0] = 0;
                    } else {
                        player.flagViewHigh[0] = 0;
                        player.flagViewLow[0] = 0;
                    }
                }

                if (player.flagViewHigh[1] || player.flagViewLow[1]) {
                    if (player.flagViewHigh[1] && player.flagViewLow[1]) {
                        defaultFlagView[1] = 0;
                    } else {
                        player.flagViewHigh[1] = 0;
                        player.flagViewLow[1] = 0;
                    }

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

        const point = PostGameScenePoint.RESUME_1;
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

        nextScene(Scene.GAME);
    }

    for (const player of airState.players.values()) {

        if (player.won == 5) {
            const phone = dict.get(PostGameSceneSprite.WINNER);
            const phoneIdx = Sprites.getIndex(phone);
            if (phoneIdx != INVALID_INDEX) {
                Sprites.setSubImage(phoneIdx, player.phone);
                Sprites.setColor(phone >> VERSION_BITS, player.colorRef.r, player.colorRef.g, player.colorRef.b, 0.5);
            }

            const avatar = dict.get(PostGameSceneSprite.WINNER_PIC);
            const avatarIdx = Sprites.getIndex(avatar);
            if (avatarIdx != INVALID_INDEX) {
                Sprites.setSubImage(avatarIdx, assetStore.avatarSubImages.get(player.name));
            }

            player.won = 0;

            if (synth) {
                synth.speak(getUtterance(`${player.name} a.k.a. ${player.colorRef.name} won the tournament! Congratulations!`));
            }

        } else {
            player.won = 0;
        }
    }

    const medals = airState.medals.map((medal, i) => {
        const point = PostGameScenePoint['M' + i];
        const spriteId = Sprites.create(medal, point.x, point.y, point.z);
        all.add(spriteId);

        return spriteId;
    });

    airState.medals.splice(0);

    drawResumeCard();

    let nextScene;
    return new Promise(resolve => nextScene = resolve);
}