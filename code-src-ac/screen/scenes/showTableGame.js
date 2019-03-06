import drawGameTableScene from '../../../code-gen-ac/screen/drawGameTableScene.js';
import * as Scene from '../../common/constants/Scene.js';
import { NONE } from '../../common/constants/CursorColor.js';
import Sprites from '../../../code-src-h5x/render/Sprites.js';
import * as SubImage from '../../../code-gen-ac/screen/SubImage.js';
import {
    INVALID_INDEX,
    VERSION_BITS
} from '../../../code-src-h5x/render/constants/BaseECS.js';
import { assetStore } from '../../../code-src-h5x/render/setupWebGL.js';
import { DIM_ELEMENTS } from '../../../code-src-h5x/render/constants/DimBuffer.js';
import * as GameTableScenePoint from '../../../code-gen-ac/screen/GameTableScenePoint.js';
import * as GameTableSceneSprite from '../../../code-gen-ac/screen/GameTableSceneSprite.js';
import PositionAnimations from '../../../code-src-h5x/render/animations/PositionAnimations.js';
import { EASE_IN_QUAD } from '../../../code-src-h5x/render/animations/Transform.js';
import {
    getDeck,
    shuffle
} from '../model/entity/Decks.js';
import {
    getHighestHandOfFiveCards,
    compareSameRank
} from '../model/entity/Ranks.js';
import Card from '../model/entity/Card.js';
import * as CursorColor from '../../common/constants/CursorColor.js';
import Audio from '../../../code-src-h5x/audio/Audio.js';
import {
    SHOT,
    CARDS_ON_TABLE,
    DRAW_CARD,
    WHISTLE,
    HORN,
    HORN_ALT
} from '../../../code-gen-ac/screen/SFXSegment.js';

export default function showTableGame(air, updateFunctions, airState) {

    const {all, dict, removeSprites} = drawGameTableScene();

    const COUNTDOWN = 10; // standard countdown - 1st round / pre-flop or flop
    const COUNTDOWN_SHORT = 5; // countdown 2nd round / river, turn
    const COUNTDOWN_READY = 3; // "ready, 3 2 1 go" - dealing before shooting

    let countdownRunning = false;
    let timeLeft;
    let lastTimerNow;

    const numberOfPlayers = Array.from(airState.players.values()).filter(player => player.color != CursorColor.NONE).length;

    let rounds;
    // 20 cards / 2 player = 10 cards
    if (numberOfPlayers == 2) {
        rounds = [
            {patternId: 3, patternLength: 13, duration: COUNTDOWN},
            {patternId: 36, patternLength: 7, duration: COUNTDOWN_SHORT}
        ];
    }

    // 24 cards / 3 player = 8 cards
    if (numberOfPlayers == 3) {
        rounds = [
            {patternId: 10, patternLength: 15, duration: COUNTDOWN},
            {patternId: 2, patternLength: 9, duration: COUNTDOWN_SHORT}
        ];
    }

    // 32 cards / 4 player = 8 cards
    if (numberOfPlayers == 4) {
        rounds = [
            {patternId: 1, patternLength: 19, duration: COUNTDOWN},
            {patternId: 34, patternLength: 13, duration: COUNTDOWN_SHORT}
        ];
    }

    // 40 cards / 5 player = 8 cards
    if (numberOfPlayers == 5) {
        rounds = [
            {patternId: 1, patternLength: 19, duration: COUNTDOWN},
            {patternId: 34, patternLength: 13, duration: COUNTDOWN},
            {patternId: 25, patternLength: 8, duration: COUNTDOWN_SHORT}
        ];
    }

    // 45 cards / 6 player = 7.5 cards
    if (numberOfPlayers == 6) {
        rounds = [
            {patternId: 1, patternLength: 19, duration: COUNTDOWN},
            {patternId: 34, patternLength: 13, duration: COUNTDOWN},
            {patternId: 14, patternLength: 13, duration: COUNTDOWN_SHORT}
        ];
    }

    // 49 cards / 7 player = 7 cards
    if (numberOfPlayers == 7) {
        rounds = [
            {patternId: 1, patternLength: 19, duration: COUNTDOWN},
            {patternId: 34, patternLength: 13, duration: COUNTDOWN},
            {patternId: 23, patternLength: 10, duration: COUNTDOWN_SHORT},
            {patternId: 37, patternLength: 7, duration: COUNTDOWN_SHORT}
        ];
    }

    // 52 cards / 8 player = 6.5 cards
    if (numberOfPlayers == 8) {
        rounds = [
            {patternId: 1, patternLength: 19, duration: COUNTDOWN},
            {patternId: 10, patternLength: 15, duration: COUNTDOWN},
            {patternId: 15, patternLength: 9, duration: COUNTDOWN_SHORT},
            {patternId: 2, patternLength: 9, duration: COUNTDOWN_SHORT}
        ];
    }

    const cards = [];
    const holes = [];
    const burntCards = [];
    const discardPile = [];

    const nextTasks = [];
    let postGame = false;
    let readyForTask = false;

    const RADIUS = assetStore.spriteDimensions[SubImage.BULLET_HOLE * DIM_ELEMENTS];

    function updateScene() {

        let nextRoundTriggered = false;

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
                            const slot = slots.get(player.device);

                            if (postGame) {

                                Sprites.setColor(card.sprite >> VERSION_BITS, 0, 0, 0, 0.5);
                                const discardingResumeCard = PositionAnimations.create(card.sprite, 20, 1, -5, -4, EASE_IN_QUAD);

                                PositionAnimations.setCallback(discardingResumeCard >> VERSION_BITS, () => readyForTask = true);


                            } else {

                                if (slot.cards.length + slot.hitCards.length < 5) {
                                    slot.hitCards.push(card);
                                    Sprites.setColor(card.sprite >> VERSION_BITS, player.colorRef.r, player.colorRef.g, player.colorRef.b, 0.5);
                                } else {
                                    burntCards.push(card);
                                    Sprites.setColor(card.sprite >> VERSION_BITS, 0, 0, 0, 0.5);
                                }
                            }

                            hit = true;
                            break;
                        }
                    }

                    if (hit) {
                        holes.push(Sprites.create(player.bulletHole, player.x, player.y, -4.4999));
                    } else {
                        holes.push(Sprites.create(player.bulletHole, player.x, player.y, -4.5001));
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


        if (countdownRunning) {
            const now = Date.now();
            const deltaTime = Math.floor((now - lastTimerNow) / 1000);
            if (deltaTime > 0) {
                lastTimerNow = now;
                timeLeft -= deltaTime;

                const digitMinTenIdx = Sprites.getIndex(timerSprites[3]);
                if (digitMinTenIdx != INVALID_INDEX) {
                    Sprites.setSubImage(digitMinTenIdx, SubImage['NUMBER_' + Math.floor(timeLeft / 60 / 10)]);
                }

                const digitMinOneIdx = Sprites.getIndex(timerSprites[2]);
                if (digitMinOneIdx != INVALID_INDEX) {
                    Sprites.setSubImage(digitMinOneIdx, SubImage['NUMBER_' + Math.floor(timeLeft / 60)]);
                }

                const digitTenIdx = Sprites.getIndex(timerSprites[1]);
                if (digitTenIdx != INVALID_INDEX) {
                    Sprites.setSubImage(digitTenIdx, SubImage['NUMBER_' + Math.floor(timeLeft / 10)]);
                }
                const digitOneIdx = Sprites.getIndex(timerSprites[0]);
                if (digitOneIdx != INVALID_INDEX) {
                    Sprites.setSubImage(digitOneIdx, SubImage['NUMBER_' + (timeLeft % 10)]);
                }
            }

            if (timeLeft <= 0) {

                Audio.playSound(HORN_ALT);

                countdownRunning = false;

                const digitTenIdx = Sprites.getIndex(timerSprites[1]);
                if (digitTenIdx != INVALID_INDEX) {
                    Sprites.setSubImage(digitTenIdx, SubImage.NUMBER_0);
                }
                const digitOneIdx = Sprites.getIndex(timerSprites[0]);
                if (digitOneIdx != INVALID_INDEX) {
                    Sprites.setSubImage(digitOneIdx, SubImage.NUMBER_0);
                }

                nextRoundTriggered = true;
            }
        }


        if (!postGame && nextRoundTriggered) {

            holes.forEach(hole => {
                const idx = Sprites.getIndex(hole);
                if (idx != INVALID_INDEX) {
                    Sprites.remove(idx);
                }
            });

            Promise.all(cards.splice(0).map(card => {
                discardPile.push(card);
                const a = PositionAnimations.create(card.sprite, 20, 1, -5, -4, EASE_IN_QUAD);

                return new Promise(resolve => {
                    Sprites.remove(card.sprite >> VERSION_BITS);
                    return PositionAnimations.setCallback(a >> VERSION_BITS, resolve);
                });

            }))
                .then(() =>
                    Promise.all(
                        Array.from(slots.values()).map(slot => {
                                const j = slot.cards.length;
                                return Promise.all(slot.hitCards.splice(0).map((card, i) => {
                                    slot.cards.push(card);
                                    const a = PositionAnimations.create(card.sprite, 20, slot.cardPoints[i + j].x, slot.cardPoints[i + j].y, slot.cardPoints[i + j].z, EASE_IN_QUAD);
                                    return new Promise(resolve => PositionAnimations.setCallback(a >> VERSION_BITS, resolve));
                                }));
                            }
                        )
                    ))
                .then(() =>
                    Promise.all(burntCards.splice(0).map(card => {
                        discardPile.push(card);
                        const a = PositionAnimations.create(card.sprite, 20, 1, -5, -4, EASE_IN_QUAD);

                        return new Promise(resolve => {
                            Sprites.remove(card.sprite >> VERSION_BITS);
                            return PositionAnimations.setCallback(a >> VERSION_BITS, resolve);
                        });
                    })))
                .then(() => {
                    if (rounds.length > 0) {
                        startRound(rounds.shift());

                    } else {

                        // calc hands + ranks + winner
                        {
                            postGame = true;

                            const winningSlots = [];

                            for (const slot of slots.values()) {
                                if (slot.cards.length == 5) {
                                    slot.hand = getHighestHandOfFiveCards(...slot.cards);

                                    if (winningSlots.length == 0) {
                                        winningSlots.push(slot);

                                    } else if (slot.hand.rank < winningSlots[0].hand.rank) {
                                        winningSlots.splice(0, winningSlots.length, slot);

                                    } else if (slot.hand.rank == winningSlots[0].hand.rank) {

                                        const comparison = compareSameRank(slot.hand, winningSlots[0].hand);

                                        if (comparison < 0) {
                                            winningSlots.splice(0, winningSlots.length, slot);

                                        } else if (comparison == 0) {
                                            winningSlots.push(slot);
                                        }
                                    }
                                }
                            }

                            winningSlots.forEach(slot => {
                                airState.medals.push(slot.player.medal);
                                slot.player.won++;
                            });

                            const secondSlots = [];

                            for (const slot of slots.values()) {
                                if (winningSlots.includes(slot))
                                    continue;

                                if (slot.cards.length == 5) {

                                    if (secondSlots.length == 0) {
                                        secondSlots.push(slot);

                                    } else if (slot.hand.rank < secondSlots[0].hand.rank) {
                                        secondSlots.splice(0, secondSlots.length, slot);

                                    } else if (slot.hand.rank == secondSlots[0].hand.rank) {

                                        const comparison = compareSameRank(slot.hand, secondSlots[0].hand);

                                        if (comparison < 0) {
                                            secondSlots.splice(0, secondSlots.length, slot);

                                        } else if (comparison == 0) {
                                            secondSlots.push(slot);
                                        }
                                    }
                                }
                            }

                            const thirdSlots = [];

                            for (const slot of slots.values()) {
                                if (winningSlots.includes(slot) || secondSlots.includes(slot))
                                    continue;

                                if (slot.cards.length == 5) {

                                    if (thirdSlots.length == 0) {
                                        thirdSlots.push(slot);

                                    } else if (slot.hand.rank < thirdSlots[0].hand.rank) {
                                        thirdSlots.splice(0, thirdSlots.length, slot);

                                    } else if (slot.hand.rank == thirdSlots[0].hand.rank) {

                                        const comparison = compareSameRank(slot.hand, thirdSlots[0].hand);

                                        if (comparison < 0) {
                                            thirdSlots.splice(0, thirdSlots.length, slot);

                                        } else if (comparison == 0) {
                                            thirdSlots.push(slot);
                                        }
                                    }
                                }
                            }

                            if (thirdSlots.length > 0) {
                                showDown(thirdSlots, GameTableSceneSprite.PLACE_3);
                                if (secondSlots.length > 0)
                                    nextTasks.push(showDown.bind(undefined, secondSlots, GameTableSceneSprite.PLACE_2));
                                if (winningSlots.length > 0)
                                    nextTasks.push(showDown.bind(undefined, winningSlots, GameTableSceneSprite.WON_LABEL));
                                nextTasks.push(endScene);

                            } else if (secondSlots.length > 0) {
                                showDown(secondSlots, GameTableSceneSprite.PLACE_2);
                                if (winningSlots.length > 0)
                                    nextTasks.push(showDown.bind(undefined, winningSlots, GameTableSceneSprite.WON_LABEL));
                                nextTasks.push(endScene);

                            } else if (winningSlots.length > 0) {
                                showDown(winningSlots, GameTableSceneSprite.WON_LABEL);
                                nextTasks.push(endScene);

                            } else {

                                const noWinnerTxt = dict.get(GameTableSceneSprite.NO_WIN);
                                const noWinnerTxtIdx = Sprites.getIndex(noWinnerTxt);
                                if (noWinnerTxtIdx != INVALID_INDEX) {
                                    Sprites.setZ(noWinnerTxtIdx, -4.5);
                                }

                                drawResumeCard();

                                nextTasks.push(endScene);
                            }
                        }
                    }
                });
        }

        if (readyForTask) {
            readyForTask = false;
            nextTasks.shift()();
        }
    }

    const updateIdx = updateFunctions.push(updateScene) - 1;

    function remove(sprite) {
        const idx = Sprites.getIndex(sprite);
        if (idx != INVALID_INDEX) {
            Sprites.remove(idx);
        }
    }

    let alreadyOver = false;

    function endScene() {
        if (alreadyOver) {
            return;
        }
        alreadyOver = true;

        updateFunctions.splice(updateIdx, 1);

        holes.forEach(remove);
        removeSprites();

        roundIsOver(Scene.SCORE_BOARD);
    }

    const currentShowDown = [];

    function showDown(slots, placeLabelId) {

        holes.forEach(remove);

        const promises = currentShowDown.length > 0 ?
            currentShowDown.splice(0).map(sprite => {
                const a = PositionAnimations.create(sprite, 20, 1, -5, -4, EASE_IN_QUAD);

                return new Promise(resolve => {
                    Sprites.remove(sprite >> VERSION_BITS);
                    return PositionAnimations.setCallback(a >> VERSION_BITS, resolve);
                });
            })
            :
            [Promise.resolve()];


        Promise.all(promises).then(() =>

            Promise.all(slots.map((slot, index, array) => {

                    const phonePoint = GameTableScenePoint[`W${index}_OF_${array.length}`];
                    const avatarPoint = GameTableScenePoint[`W${index}_PIC_OF_${array.length}`];

                    currentShowDown.push(slot.phone, slot.avatar);

                    const animPhone = PositionAnimations.create(slot.phone, 15, phonePoint.x, phonePoint.y, phonePoint.z, EASE_IN_QUAD);
                    const animAvatar = PositionAnimations.create(slot.avatar, 15, avatarPoint.x, avatarPoint.y, avatarPoint.z, EASE_IN_QUAD);

                    return Promise.all([
                        new Promise(resolve => PositionAnimations.setCallback(animPhone >> VERSION_BITS, resolve)),
                        new Promise(resolve => PositionAnimations.setCallback(animAvatar >> VERSION_BITS, resolve)),

                        ...slot.cards.map((card, i) => {
                            currentShowDown.push(card.sprite);

                            const anim = PositionAnimations.create(card.sprite, 30,
                                GameTableScenePoint['WIN_C' + i].x,
                                GameTableScenePoint['WIN_C' + i].y,
                                GameTableScenePoint['WIN_C' + i].z - index * 0.001,
                                EASE_IN_QUAD);

                            return new Promise(resolve => PositionAnimations.setCallback(anim >> VERSION_BITS, resolve));
                        })
                    ]);
                }
            )))
            .then(() => {

                const placeLabel = dict.get(placeLabelId);
                const placeIdx = Sprites.getIndex(placeLabel);
                if (placeIdx != INVALID_INDEX) {
                    Sprites.setZ(placeIdx, -4.5);
                    currentShowDown.push(placeLabel);
                }

                const handRank = dict.get(GameTableSceneSprite.HND_RNK);
                const handIdx = Sprites.getIndex(handRank);
                if (handIdx != INVALID_INDEX) {
                    Sprites.setZ(handIdx, -4.5);

                    Sprites.setSubImage(handIdx, SubImage['HAND_RANK_' + slots[0].hand.rank]);
                }

                drawResumeCard();
            });
    }

    function drawResumeCard() {
        const card = new Card();
        const sprite = Sprites.create(SubImage.CARD_RESUME, -1, 5, -4);
        all.add(sprite);

        const point = GameTableScenePoint.RESUME_1;
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

    function startCountdown(duration) {
        Audio.playSound(WHISTLE);

        timeLeft = duration;
        lastTimerNow = Date.now();
        countdownRunning = true;

        const digitMinTenIdx = Sprites.getIndex(timerSprites[3]);
        if (digitMinTenIdx != INVALID_INDEX) {
            Sprites.setSubImage(digitMinTenIdx, SubImage['NUMBER_' + Math.floor(timeLeft / 60 / 10)]);
        }

        const digitMinOneIdx = Sprites.getIndex(timerSprites[2]);
        if (digitMinOneIdx != INVALID_INDEX) {
            Sprites.setSubImage(digitMinOneIdx, SubImage['NUMBER_' + Math.floor(timeLeft / 60)]);
        }

        const digitTenIdx = Sprites.getIndex(timerSprites[1]);
        if (digitTenIdx != INVALID_INDEX) {
            Sprites.setSubImage(digitTenIdx, SubImage['NUMBER_' + Math.floor(duration / 10)]);
        }

        const digitOneIdx = Sprites.getIndex(timerSprites[0]);
        if (digitOneIdx != INVALID_INDEX) {
            Sprites.setSubImage(digitOneIdx, SubImage['NUMBER_' + (duration % 10)]);
        }
    }

    ///////////////////////////// init scene
    ///////////////////////////// init scene
    ///////////////////////////// init scene start

    const timerColonSprite = dict.get(GameTableSceneSprite.TIMER_COLON);
    const timerSprites = [
        Sprites.create(SubImage.NUMBER_0, GameTableScenePoint.TIMER_SEC_0.x, GameTableScenePoint.TIMER_SEC_0.y, GameTableScenePoint.TIMER_SEC_0.z),
        Sprites.create(SubImage.NUMBER_0, GameTableScenePoint.TIMER_SEC_1.x, GameTableScenePoint.TIMER_SEC_1.y, GameTableScenePoint.TIMER_SEC_1.z),
        Sprites.create(SubImage.NUMBER_0, GameTableScenePoint.TIMER_MIN_0.x, GameTableScenePoint.TIMER_MIN_0.y, GameTableScenePoint.TIMER_MIN_0.z),
        Sprites.create(SubImage.NUMBER_0, GameTableScenePoint.TIMER_MIN_1.x, GameTableScenePoint.TIMER_MIN_1.y, GameTableScenePoint.TIMER_MIN_1.z)
    ];
    timerSprites.forEach(s => all.add(s));

    const currentRound = Sprites.create(SubImage.NUMBER_S_1, GameTableScenePoint.ROUND_X.x, GameTableScenePoint.ROUND_X.y, GameTableScenePoint.ROUND_X.z);
    all.add(currentRound);
    const maxRound = Sprites.create(SubImage['NUMBER_S_' + rounds.length], GameTableScenePoint.ROUND_MAX.x, GameTableScenePoint.ROUND_MAX.y, GameTableScenePoint.ROUND_MAX.z);
    all.add(maxRound);

    /** @type {Map<number, Slot>} */
    const slots = new Map();

    class Slot {
        constructor(slotIdx, player, avatar, phone, avatarPoint, phonePoint, cardPoints) {
            this.id = slotIdx;
            this.player = player;
            this.avatar = avatar;
            this.phone = phone;
            this.avatarPoint = avatarPoint;
            this.phonePoint = phonePoint;
            this.cardPoints = cardPoints;

            this.hitCards = [];
            this.cards = [];
            this.hand = undefined;

            Object.seal(this);
        }
    }


    const postfix = '_OF_' + airState.players.size;

    for (const player of airState.players.values()) {

        const slotIdx = slots.size;

        const avatarPoint = GameTableScenePoint[`PIC_${slotIdx}${postfix}`];
        const avatar = Sprites.create(assetStore.avatarSubImages.get(player.name), avatarPoint.x, avatarPoint.y, avatarPoint.z);
        all.add(avatar);

        const phonePoint = GameTableScenePoint['PHONE_' + slotIdx + postfix];
        const phone = Sprites.create(player.phone, phonePoint.x, phonePoint.y, phonePoint.z);
        Sprites.setColor(phone >> VERSION_BITS, player.colorRef.r, player.colorRef.g, player.colorRef.b, 0.5);
        all.add(phone);

        const cardPoints = [
            GameTableScenePoint[`S${slotIdx}_C0${postfix}`],
            GameTableScenePoint[`S${slotIdx}_C1${postfix}`],
            GameTableScenePoint[`S${slotIdx}_C2${postfix}`],
            GameTableScenePoint[`S${slotIdx}_C3${postfix}`],
            GameTableScenePoint[`S${slotIdx}_C4${postfix}`]
        ];

        slots.set(player.device, new Slot(slotIdx, player, avatar, phone, avatarPoint, phonePoint, cardPoints));
    }


    const deck = shuffle(getDeck());

    function drawCard(point, index) {

        const card = deck.pop();

        const sprite = Sprites.create(card.img, -1, 5, -4);
        all.add(sprite);

        const posAnim = PositionAnimations.create(sprite, 30, point.x, point.y, point.z, EASE_IN_QUAD);
        PositionAnimations.delay(posAnim >> VERSION_BITS, index * 5);

        const idx = sprite >> VERSION_BITS;
        const widthHalf = Sprites.getWidthHalf(idx);
        const heightHalf = Sprites.getHeightHalf(idx);

        card.sprite = sprite;
        card.left = point.x - widthHalf;
        card.top = point.y - heightHalf;
        card.right = point.x + widthHalf;
        card.bottom = point.y + heightHalf;

        return new Promise(resolve => PositionAnimations.setCallback(posAnim >> VERSION_BITS, () => {
            Audio.playSound(DRAW_CARD);
            resolve(card);
        }));
    }

    let currentRoundKey = 0;

    function startRound({patternId, patternLength, duration}) {
        if (deck.length < patternLength) {
            // alert('game over: no cards left');
            return;
        }

        Audio.playSound(CARDS_ON_TABLE);

        currentRoundKey++;

        const idx = Sprites.getIndex(currentRound);
        if (idx != INVALID_INDEX) {
            Sprites.setSubImage(idx, SubImage['NUMBER_S_' + currentRoundKey]);
        }

        const cardPoints = [];
        for (let i = 0; i < patternLength; i++) {
            cardPoints.push(GameTableScenePoint[`P${patternId}_CARD_${i}`]);
        }

        Promise.all(cardPoints.map(drawCard))
            .then(drawnCards => {
                cards.push(...drawnCards);
                startCountdown(duration);
            });
    }

    startRound(rounds.shift());

    ///////////////////////////// init scene end

    let roundIsOver;
    return new Promise(resolve => roundIsOver = resolve);
}