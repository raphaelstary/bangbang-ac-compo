import drawConnectScene from '../../../code-gen-ac/screen/drawConnectScene.js';
import Sprites from '../../../code-src-h5x/render/Sprites.js';
import {
    INVALID_INDEX,
    VERSION_BITS
} from '../../../code-src-h5x/render/constants/BaseECS.js';
import { AVATAR_SLOTS } from '../../../code-src-h5x/platform/constants/Platform.js';
import * as SubImage from '../../../code-gen-ac/screen/SubImage.js';
import * as JoinScenePoint from '../../../code-gen-ac/screen/JoinScenePoint.js';
import {
    assetStore,
    addAvatarAtlas
} from '../../../code-src-h5x/render/setupWebGL.js';
import createAtlas from '../../../code-src-h5x/platform/createAtlas.js';
import * as ConnectSceneSprite from '../../../code-gen-ac/screen/ConnectSceneSprite.js';
import { NEXT_SCENE } from '../../common/constants/Command.js';
import { CONNECT } from '../../common/constants/Scene.js';
import drawJoinScene from '../../../code-gen-ac/screen/drawJoinScene.js';
import PositionAnimations from '../../../code-src-h5x/render/animations/PositionAnimations.js';
import {
    EASE_IN_QUAD,
    EASE_IN_OUT_QUINT
} from '../../../code-src-h5x/render/animations/Transform.js';
import * as CursorColor from '../../common/constants/CursorColor.js';
import { DIM_ELEMENTS } from '../../../code-src-h5x/render/constants/DimBuffer.js';
import * as Scene from '../../common/constants/Scene.js';
import * as Color from '../../common/constants/Color.js';
import ScaleAnimations from '../../../code-src-h5x/render/animations/ScaleAnimations.js';
import { COLOR_TXT } from '../../../code-gen-ac/screen/JoinSceneSprite.js';
import {
    SHOT,
    DRAW_CARD
} from '../../../code-gen-ac/screen/SFXSegment.js';
import Audio from '../../../code-src-h5x/audio/Audio.js';
import { getUtterance } from '../../common/Utterances.js';

export default function showConnect(air, updateFunctions, airState, synth) {


    function hide(spriteId) {
        const idx = Sprites.getIndex(spriteId);
        if (idx != INVALID_INDEX) {
            Sprites.setZ(idx, 1.0);
        }
    }

    function show(spriteId, z = -4.5) {
        const idx = Sprites.getIndex(spriteId);
        if (idx != INVALID_INDEX) {
            Sprites.setZ(idx, z);
        }
    }

    const slots = new Map();
    const names = new Map();

    const sprites = drawConnectScene();

    const bullseye = sprites.dict.get(ConnectSceneSprite.BULLSEYE);
    const calibrateTxt = sprites.dict.get(ConnectSceneSprite.C_TXT);

    const pointLeft = sprites.dict.get(ConnectSceneSprite.POINT_L);
    const pointRight = sprites.dict.get(ConnectSceneSprite.POINT_R);
    const pointText = sprites.dict.get(ConnectSceneSprite.POINT_TXT);

    let joinSprites;

    let joinPartVisible = false;
    let playCardsVisible = false;
    let calibratingAgain = false;

    const cursorCards = [];
    const playCards = [];
    const holes = [];

    const playerCursorCardPair = new Map();

    const taskQueue = [];

    function wait(ticks) {
        return new Promise(resolve => taskQueue.push([tick + ticks, resolve]));
    }

    let tick = 0;

    function handleConnects() {
        if (airState.profileUpdate) {
            airState.profileUpdate = false;

            const {atlas, info} = createAtlas(Array.from(airState.players.values()).filter(player => player.img));
            addAvatarAtlas(atlas, info);

            updateAvatarAtlas(airState.players);
        }

        if (airState.connectUpdate) {
            airState.connectUpdate = false;

            addPlayers(airState.addedPlayers);
            airState.addedPlayers.clear();
        }

        if (airState.disconnectUpdate) {
            airState.disconnectUpdate = false;

            removePlayers(airState.removedPlayers);
            airState.removedPlayers.clear();
        }

        for (let i = taskQueue.length - 1; i >= 0; i--) {
            const [taskTick, resolvePromise] = taskQueue[i];
            if (taskTick == tick) {
                taskQueue.splice(i, 1);
                resolvePromise();
            }
        }

        let startGame = false;

        for (const player of airState.players.values()) {

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

                if (player.calibrated) {

                    let hit = false;

                    Audio.playSound(SHOT);

                    for (let i = 0; i < cursorCards.length; i++) {
                        const card = cursorCards[i];

                        if (card.hit) {
                            continue;
                        }

                        if (player.x + radius > card.left && player.x - radius < card.right && player.y + radius
                            > card.top && player.y - radius < card.bottom) {

                            card.hit = true;
                            hit = true;

                            Sprites.setColor(card.sprite >> VERSION_BITS, 1, 1, 1, 0.5);
                            setCursor(player, card);
                            if (playerCursorCardPair.has(player)) {
                                const lastCursorCard = playerCursorCardPair.get(player);
                                resetCursorCard(lastCursorCard);
                            }
                            playerCursorCardPair.set(player, card);
                            card.holes.push(Sprites.create(SubImage.BULLET_HOLE, player.x, player.y, -4.4999));

                            break;
                        }
                    }

                    for (let i = 0; !hit && i < playCards.length; i++) {
                        const card = playCards[i];

                        if (player.x + radius > card.left && player.x - radius < card.right && player.y + radius
                            > card.top && player.y - radius < card.bottom) {

                            hit = true;
                            startGame = true;

                            holes.push(Sprites.create(player.bulletHole, player.x, player.y, -4.4999));

                            break;
                        }
                    }


                    if (!hit) {
                        holes.push(Sprites.create(player.bulletHole, player.x, player.y, -4.5001));
                    }

                } else {
                    setCalibrated(player);
                    air.message(player.device, [NEXT_SCENE, CONNECT]);

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

        if (startGame) {
            updateFunctions.splice(connectIdx, 1);

            Promise.all([...cursorCards, ...playCards].map((card, i) => {
                const posAnim = PositionAnimations.create(card.sprite, 30, 1, -5, -4, EASE_IN_QUAD);
                PositionAnimations.delay(posAnim >> VERSION_BITS, i * 3);
                return new Promise(resolve => PositionAnimations.setCallback(posAnim >> VERSION_BITS, resolve));
            }))
                .then(() => {

                    const idx = ScaleAnimations.getIndex(bullseyeAnimation);
                    if (idx != INVALID_INDEX) {
                        ScaleAnimations.remove(idx);
                    }

                    cursorCards.forEach(card => {
                        card.holes.forEach(remove);
                        remove(card.sprite);
                    });
                    playCards.forEach(card => remove(card.sprite));
                    holes.forEach(remove);
                    sprites.removeSprites();
                    joinSprites.removeSprites();

                    endScene(Scene.RULES);
                });

            return;
        }

        if (joinPartVisible) {

            if (calibratingAgain && Array.from(airState.players.values()).every(player => player.calibrated)) {
                calibratingAgain = false;
                hide(bullseye);
                hide(calibrateTxt);
                show(joinSprites.dict.get(COLOR_TXT));
                cursorCards.push(...__cursorCards.splice(0));
                cursorCards.forEach(card => {
                    show(card.sprite);
                });

                if (synth) {
                    synth.speak(getUtterance('select your color.'));
                }
            }

            if (!playCardsVisible && airState.players.size > 1 && Array.from(airState.players.values()).every(player => player.color != CursorColor.NONE)) {

                playCardsVisible = true;

                Promise.all([
                    [SubImage.CARD_P, JoinScenePoint.P],
                    [SubImage.CARD_L, JoinScenePoint.L],
                    [SubImage.CARD_A, JoinScenePoint.A],
                    [SubImage.CARD_Y, JoinScenePoint.Y]
                ].map(([subImage, point], index) => drawCard(subImage, point, index * 5)))
                    .then(cards => playCards.push(...cards));

                if (synth) {
                    synth.speak(getUtterance(`Let's start, whenever you're ready.`));
                }
            }

        } else {
            if (Array.from(airState.players.values()).every(player => player.calibrated)) {

                hide(bullseye);
                hide(calibrateTxt);

                joinPartVisible = true;
                joinSprites = drawJoinScene();

                if (synth) {
                    if (synth.speaking)
                        synth.cancel();
                }

                Promise.all([
                    [
                        SubImage.CARD_YELLOW,
                        JoinScenePoint.YELLOW,
                        SubImage.CURSOR_YELLOW,
                        CursorColor.YELLOW,
                        SubImage.BULLET_HOLE_YELLOW,
                        SubImage.PHONE_CONNECTED,
                        SubImage.COLOR_YELLOW,
                        Color.YELLOW,
                        SubImage.MEDAL_YELLOW
                    ],
                    [
                        SubImage.CARD_CYAN,
                        JoinScenePoint.CYAN,
                        SubImage.CURSOR_CYAN,
                        CursorColor.CYAN,
                        SubImage.BULLET_HOLE_CYAN,
                        SubImage.PHONE_CONNECTED,
                        SubImage.COLOR_CYAN,
                        Color.CYAN,
                        SubImage.MEDAL_CYAN
                    ],
                    [
                        SubImage.CARD_MAGENTA,
                        JoinScenePoint.MAGENTA,
                        SubImage.CURSOR_MAGENTA,
                        CursorColor.MAGENTA,
                        SubImage.BULLET_HOLE_MAGENTA,
                        SubImage.PHONE_CONNECTED,
                        SubImage.COLOR_MAGENTA,
                        Color.MAGENTA,
                        SubImage.MEDAL_MAGENTA
                    ],
                    [
                        SubImage.CARD_GREEN,
                        JoinScenePoint.GREEN,
                        SubImage.CURSOR_GREEN,
                        CursorColor.GREEN,
                        SubImage.BULLET_HOLE_GREEN,
                        SubImage.PHONE_CONNECTED,
                        SubImage.COLOR_GREEN,
                        Color.GREEN,
                        SubImage.MEDAL_GREEN
                    ],
                    [
                        SubImage.CARD_BLUE,
                        JoinScenePoint.BLUE,
                        SubImage.CURSOR_BLUE,
                        CursorColor.BLUE,
                        SubImage.BULLET_HOLE_BLUE,
                        SubImage.PHONE_CONNECTED,
                        SubImage.COLOR_BLUE,
                        Color.BLUE,
                        SubImage.MEDAL_BLUE
                    ],
                    [
                        SubImage.CARD_ORANGE,
                        JoinScenePoint.ORANGE,
                        SubImage.CURSOR_ORANGE,
                        CursorColor.ORANGE,
                        SubImage.BULLET_HOLE_ORANGE,
                        SubImage.PHONE_CONNECTED,
                        SubImage.COLOR_ORANGE,
                        Color.ORANGE,
                        SubImage.MEDAL_ORANGE
                    ],
                    [
                        SubImage.CARD_RED,
                        JoinScenePoint.RED,
                        SubImage.CURSOR_RED,
                        CursorColor.RED,
                        SubImage.BULLET_HOLE_RED,
                        SubImage.PHONE_CONNECTED,
                        SubImage.COLOR_RED,
                        Color.RED,
                        SubImage.MEDAL_RED
                    ],
                    [
                        SubImage.CARD_VIOLET,
                        JoinScenePoint.VIOLET,
                        SubImage.CURSOR_VIOLET,
                        CursorColor.VIOLET,
                        SubImage.BULLET_HOLE_VIOLET,
                        SubImage.PHONE_CONNECTED,
                        SubImage.COLOR_VIOLET,
                        Color.VIOLET,
                        SubImage.MEDAL_VIOLET
                    ]
                ].map((cursorCardInfo, index) => drawCursorCard(cursorCardInfo, index * 5)))
                    .then(cards => {
                        if (synth) {
                            synth.speak(getUtterance('select your color, to get ready for the tournament.'));
                        }
                        return cursorCards.push(...cards);
                    });
            }
        }

        tick++;
    }

    const radius = assetStore.spriteDimensions[SubImage.BULLET_HOLE * DIM_ELEMENTS];

    function drawCursorCard([img, point, cursorImg, cursorColor, holeImg, phoneImg, txtImg, colorRef, medal], timeOffset) {
        const sprite = Sprites.create(img, -1, 5, -4);
        const posAnim = PositionAnimations.create(sprite, 30, point.x, point.y, point.z, EASE_IN_QUAD);
        PositionAnimations.delay(posAnim >> VERSION_BITS, timeOffset);

        const idx = sprite >> VERSION_BITS;
        const widthHalf = Sprites.getWidthHalf(idx);
        const left = point.x - widthHalf;
        const heightHalf = Sprites.getHeightHalf(idx);
        const top = point.y - heightHalf;
        const right = point.x + widthHalf;
        const bottom = point.y + heightHalf;

        const card = Object.seal({
            sprite,
            left,
            top,
            right,
            bottom,
            img,
            point,
            cursorImg,
            cursorColor,
            holeImg,
            phoneImg,
            txtImg,
            colorRef,
            medal,
            hit: false,
            holes: []
        });

        return new Promise(resolve => PositionAnimations.setCallback(posAnim >> VERSION_BITS, () => {
            Audio.playSound(DRAW_CARD);
            resolve(card);
        }));
    }

    function drawCard(subImage, point, timeOffset) {
        const sprite = Sprites.create(subImage, -1, 5, -4);
        const posAnim = PositionAnimations.create(sprite, 30, point.x, point.y, point.z, EASE_IN_QUAD);
        PositionAnimations.delay(posAnim >> VERSION_BITS, timeOffset);

        const idx = sprite >> VERSION_BITS;
        const widthHalf = Sprites.getWidthHalf(idx);
        const left = point.x - widthHalf;
        const heightHalf = Sprites.getHeightHalf(idx);
        const top = point.y - heightHalf;
        const right = point.x + widthHalf;
        const bottom = point.y + heightHalf;

        const card = Object.seal({
            sprite, left, top, right, bottom
        });

        return new Promise(resolve => PositionAnimations.setCallback(posAnim >> VERSION_BITS, () => {
            Audio.playSound(DRAW_CARD);
            resolve(card);
        }));
    }

    const connectIdx = updateFunctions.push(handleConnects) - 1;

    /////////////////////////////////////
    /////////////////////////////////////
    /////////////////////////////////////


    /**
     * @param {Map<number, ACPlayer>} playerDict
     */
    function updateAvatarAtlas(playerDict) {
        for (const [deviceId, slot] of slots) {

            const plusId = sprites.dict.get(ConnectSceneSprite['PLUS_' + slot]);
            const plusIdx = Sprites.getIndex(plusId);
            if (plusIdx != INVALID_INDEX) {
                Sprites.setZ(plusIdx, -4.5001);
                Sprites.setSubImage(plusIdx, assetStore.avatarSubImages.get(playerDict.get(deviceId).name));
            }
        }
    }

    function addPlayers(players) {

        for (const player of players) {
            const i = slots.size;
            slots.set(player.device, i);

            if (synth) {
                synth.speak(getUtterance(`Welcome ${player.name}! please shoot at the center to calibrate.`));
            }

            player.cursor = Sprites.create(SubImage.CURSOR, 0, 0, -4.48);

            const doneId = sprites.dict.get(ConnectSceneSprite['DONE_' + i]);
            const doneIdx = Sprites.getIndex(doneId);
            if (doneIdx != INVALID_INDEX) {
                Sprites.setZ(doneIdx, -4.5);

                // setting sub-image of done later with phone sub-image
                if (player.img) {
                    const plusId = sprites.dict.get(ConnectSceneSprite['PLUS_' + i]);
                    const plusIdx = Sprites.getIndex(plusId);
                    if (plusIdx != INVALID_INDEX) {
                        Sprites.setSubImage(plusIdx, assetStore.avatarSubImages.get(player.name));
                    }
                }

                const phoneId = sprites.dict.get(ConnectSceneSprite['PHONE_' + i]);
                const phoneIdx = Sprites.getIndex(phoneId);
                if (phoneIdx != INVALID_INDEX) {
                    if (player.calibrated) {
                        Sprites.setSubImage(phoneIdx, SubImage.PHONE_CONNECTED);
                    } else {
                        Sprites.setSubImage(doneIdx, SubImage.WAITING);
                        Sprites.setSubImage(phoneIdx, SubImage.PHONE_WAITING);
                    }

                    const connectId = sprites.dict.get(ConnectSceneSprite['CONNECT_' + i]);
                    const connectIdx = Sprites.getIndex(connectId);
                    if (connectIdx != INVALID_INDEX) {
                        Sprites.setZ(connectIdx, 1.0);
                        const name = Sprites.createDebugText(player.name, Sprites.getX(connectIdx) - Sprites.getWidthHalf(phoneIdx), Sprites.getY(connectIdx) - Sprites.getHeightHalf(connectIdx), -4.5);
                        names.set(player.device, names);
                        name.forEach(id => sprites.all.add(id));
                    }
                }
            }
        }


        {
            const i = slots.size;

            const plusId = sprites.dict.get(ConnectSceneSprite['PLUS_' + i]);
            const plusIdx = Sprites.getIndex(plusId);
            if (plusIdx != INVALID_INDEX) {
                Sprites.setZ(plusIdx, -4.5001);
            }

            const connectId = sprites.dict.get(ConnectSceneSprite['CONNECT_' + i]);
            const connectIdx = Sprites.getIndex(connectId);
            if (connectIdx != INVALID_INDEX) {
                Sprites.setZ(connectIdx, -4.5);
            }
        }

        if (joinPartVisible && !calibratingAgain) {
            hide(joinSprites.dict.get(COLOR_TXT));

            cursorCards.forEach(card => {
                hide(card.sprite);
            });

            __cursorCards = cursorCards.splice(0);

            show(bullseye, -4.4);
            show(calibrateTxt, -4.4);

            calibratingAgain = true;
        }
    }

    let __cursorCards;

    function removePlayers(players) {
        // todo continue here
    }

    function setCalibrated(player) {
        const i = slots.get(player.device);

        const doneId = sprites.dict.get(ConnectSceneSprite['DONE_' + i]);
        const doneIdx = Sprites.getIndex(doneId);
        if (doneIdx != INVALID_INDEX) {
            Sprites.setSubImage(doneIdx, SubImage.DONE);
        }

        const phoneId = sprites.dict.get(ConnectSceneSprite['PHONE_' + i]);
        const phoneIdx = Sprites.getIndex(phoneId);
        if (phoneIdx != INVALID_INDEX) {
            Sprites.setSubImage(phoneIdx, SubImage.PHONE_CONNECTED);
        }

        player.calibrated = true;
    }

    function resetCursorCard(card) {
        card.hit = false;
        Sprites.setAlpha(card.sprite >> VERSION_BITS, 0);

        card.holes.forEach(remove);
    }

    function remove(sprite) {
        const idx = Sprites.getIndex(sprite);
        if (idx != INVALID_INDEX) {
            Sprites.remove(idx);
        }
    }

    /* {img, point, cursorImg, cursorColor, holeImg, phoneImg, txtImg} */
    function setCursor(player, {cursorImg, cursorColor, holeImg, txtImg, phoneImg, colorRef, medal}) {

        Sprites.setSubImage(player.cursor >> VERSION_BITS, cursorImg);
        player.color = cursorColor;
        player.bulletHole = holeImg;
        player.phone = phoneImg;
        player.colorRef = colorRef;
        player.medal = medal;

        const i = slots.get(player.device);

        const doneId = sprites.dict.get(ConnectSceneSprite['DONE_' + i]);
        const doneIdx = Sprites.getIndex(doneId);
        if (doneIdx != INVALID_INDEX) {
            Sprites.setSubImage(doneIdx, txtImg);
        }

        const phoneId = sprites.dict.get(ConnectSceneSprite['PHONE_' + i]);
        const phoneIdx = Sprites.getIndex(phoneId);
        if (phoneIdx != INVALID_INDEX) {
            Sprites.setColor(phoneIdx, player.colorRef.r, player.colorRef.g, player.colorRef.b, 0.5);
            // Sprites.setSubImage(phoneIdx, phoneImg);
        }

        player.calibrated = true;

        if (synth) {
            synth.speak(getUtterance(`${player.name} is ${player.colorRef.name}`));
        }

    }


    /////////////////////////// create
    /////////////////////////// create
    /////////////////////////// create

    const players = Array.from(airState.players.values());
    airState.addedPlayers.clear();
    const connectedPlayers = players.length;

    for (let i = 0; i < AVATAR_SLOTS; i++) {
        if (i < connectedPlayers) {
            const player = players[i];

            if (synth) {
                synth.speak(getUtterance(`Hello ${player.name}`));
            }

            player.cursor = Sprites.create(SubImage.CURSOR, 0, 0, -4.48);

            slots.set(player.device, i);

            const doneId = sprites.dict.get(ConnectSceneSprite['DONE_' + i]);
            const doneIdx = Sprites.getIndex(doneId);
            if (doneIdx != INVALID_INDEX) {
                Sprites.setZ(doneIdx, -4.5);
            }

            // setting sub-image of done later with phone sub-image

            if (player.img) {
                const plusId = sprites.dict.get(ConnectSceneSprite['PLUS_' + i]);
                const plusIdx = Sprites.getIndex(plusId);
                if (plusIdx != INVALID_INDEX) {
                    Sprites.setZ(plusIdx, -4.5001);
                    Sprites.setSubImage(plusIdx, assetStore.avatarSubImages.get(player.name));
                }
            }

            const phoneId = sprites.dict.get(ConnectSceneSprite['PHONE_' + i]);
            const phoneIdx = Sprites.getIndex(phoneId);
            if (phoneIdx != INVALID_INDEX) {

                if (player.calibrated) {
                    Sprites.setSubImage(phoneIdx, SubImage.PHONE_CONNECTED);
                } else {
                    Sprites.setSubImage(doneIdx, SubImage.WAITING);
                    Sprites.setSubImage(phoneIdx, SubImage.PHONE_WAITING);
                }

                const connectId = sprites.dict.get(ConnectSceneSprite['CONNECT_' + i]);
                const connectIdx = Sprites.getIndex(connectId);
                if (connectIdx != INVALID_INDEX) {

                    const name = Sprites.createDebugText(player.name, Sprites.getX(connectIdx) - Sprites.getWidthHalf(phoneIdx), Sprites.getY(connectIdx) - Sprites.getHeightHalf(connectIdx), -4.5);
                    names.set(player.device, names);
                    name.forEach(id => sprites.all.add(id));
                }
            }

        } else if (i == connectedPlayers) {
            const plusId = sprites.dict.get(ConnectSceneSprite['PLUS_' + i]);
            const plusIdx = Sprites.getIndex(plusId);
            if (plusIdx != INVALID_INDEX) {
                Sprites.setZ(plusIdx, -4.5001);
            }

            const connectId = sprites.dict.get(ConnectSceneSprite['CONNECT_' + i]);
            const connectIdx = Sprites.getIndex(connectId);
            if (connectIdx != INVALID_INDEX) {
                Sprites.setZ(connectIdx, -4.5);
            }

        } else {
            break;
        }

    }

    let bullseyeAnimation;

    wait(30).then(() => {
        show(bullseye, -4.4);
        bullseyeAnimation = ScaleAnimations.create(bullseye, 30, 1.1, EASE_IN_OUT_QUINT);
        ScaleAnimations.setLoop(bullseyeAnimation >> VERSION_BITS, true);
    });
    wait(30).then(() => {
        show(pointLeft, -4.4);
        show(pointRight, -4.4);
    });

    if (synth) {
        const msg = `Your phone is a gun. Yes, you heard right, your phone is a gun. A LUGER pistol to be precise.
                        Point your gun at the center of your TV and shoot!
                        BANG, BANG, BANG, BANG, BANG!`;
        synth.speak(getUtterance(msg));
    }

    let endScene;
    return new Promise(resolve => endScene = resolve);
}
