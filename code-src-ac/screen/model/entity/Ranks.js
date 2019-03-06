import Hand from './Hand.js';
import * as HandRank from '../constants/HandRank.js';
import * as HandName from '../constants/HandName.js';

/**
 *
 * @param {Card[]} cards - exactly 5 cards sorted by rank
 * @return {Hand}
 */
function getHand(cards) {

    const _1stCard = cards[0];
    const _1stSuit = cards[0].suit;
    const _1stRank = cards[0].rank;
    const _2ndCard = cards[1];
    const _2ndSuit = cards[1].suit;
    const _2ndRank = cards[1].rank;
    const _3rdCard = cards[2];
    const _3rdSuit = cards[2].suit;
    const _3rdRank = cards[2].rank;
    const _4thCard = cards[3];
    const _4thSuit = cards[3].suit;
    const _4thRank = cards[3].rank;
    const _5thCard = cards[4];
    const _5thSuit = cards[4].suit;
    const _5thRank = cards[4].rank;

    const suited = _1stSuit == _2ndSuit && _1stSuit == _3rdSuit && _1stSuit == _4thSuit && _1stSuit == _5thSuit;
    const straight = _1stRank == _2ndRank - 1 && _2ndRank == _3rdRank - 1 && _3rdRank == _4thRank - 1 && _4thRank
        == _5thRank - 1;

    if (suited && straight) {
        return new Hand(cards, HandRank.STRAIGHT_FLUSH, HandName.STRAIGHT_FLUSH);
    }
    if (suited) {
        return new Hand(cards, HandRank.FLUSH, HandName.FLUSH);
    }
    if (straight) {
        return new Hand(cards, HandRank.STRAIGHT, HandName.STRAIGHT);
    }

    const quadruplet1to4 = _3rdRank == _2ndRank && _3rdRank == _4thRank && _3rdRank == _1stRank;
    const quadruplet2to5 = quadruplet1to4 ?
        false :
        _3rdRank == _2ndRank && _3rdRank == _4thRank && _3rdRank == _5thRank;

    if (quadruplet1to4 || quadruplet2to5) {
        const fourOfAKind = new Hand(cards, HandRank.FOUR_OF_A_KIND, HandName.FOUR_OF_A_KIND);

        if (quadruplet1to4) {
            fourOfAKind.quadruplet = [_1stCard, _2ndCard, _3rdCard, _4thCard];
            fourOfAKind.kicker = _5thCard;
        } else {
            fourOfAKind.kicker = _1stCard;
            fourOfAKind.quadruplet = [_2ndCard, _3rdCard, _4thCard, _5thCard];
        }

        return fourOfAKind;
    }

    const triplet1to3 = _3rdRank == _2ndRank && _3rdRank == _1stRank;
    const triplet3to5 = triplet1to3 ? false : _3rdRank == _4thRank && _3rdRank == _5thRank;

    const pair4n5 = triplet3to5 ? false : _4thRank == _5thRank;

    if (triplet1to3) {

        if (pair4n5) {
            const fullHouseHigh = new Hand(cards, HandRank.FULL_HOUSE, HandName.FULL_HOUSE);

            fullHouseHigh.triplet = [_1stCard, _2ndCard, _3rdCard];
            fullHouseHigh.pair = [_4thCard, _5thCard];

            return fullHouseHigh;
        }

        const threeOfAKindHigh = new Hand(cards, HandRank.THREE_OF_A_KIND, HandName.THREE_OF_A_KIND);

        threeOfAKindHigh.triplet = [_1stCard, _2ndCard, _3rdCard];
        threeOfAKindHigh.kickers = [_4thCard, _5thCard];

        return threeOfAKindHigh;
    }

    const pair1n2 = _1stRank == _2ndRank;

    if (triplet3to5) {

        if (pair1n2) {
            const fullHouseLow = new Hand(cards, HandRank.FULL_HOUSE, HandName.FULL_HOUSE);

            fullHouseLow.pair = [_1stCard, _2ndCard];
            fullHouseLow.triplet = [_3rdCard, _4thCard, _5thCard];

            return fullHouseLow;
        }

        const threeOfAKindLow = new Hand(cards, HandRank.THREE_OF_A_KIND, HandName.THREE_OF_A_KIND);

        threeOfAKindLow.kickers = [_1stCard, _2ndCard];
        threeOfAKindLow.triplet = [_3rdCard, _4thCard, _5thCard];

        return threeOfAKindLow;
    }

    const triplet2to4 = pair1n2 || pair4n5 ? false : _3rdRank == _2ndRank && _3rdRank == _4thRank;

    if (triplet2to4) {
        const threeOfAKind = new Hand(cards, HandRank.THREE_OF_A_KIND, HandName.THREE_OF_A_KIND);

        threeOfAKind.triplet = [_2ndCard, _3rdCard, _4thCard];
        threeOfAKind.kickers = [_1stCard, _5thCard];

        return threeOfAKind;
    }

    if (pair1n2 && pair4n5) {
        const twoPairSplit = new Hand(cards, HandRank.TWO_PAIR, HandName.TWO_PAIR);

        twoPairSplit.highPair = [_1stCard, _2ndCard];
        twoPairSplit.kicker = _3rdCard;
        twoPairSplit.lowPair = [_4thCard, _5thCard];

        return twoPairSplit;
    }

    const pair2n3 = pair1n2 ? false : _2ndRank == _3rdRank;
    const pair3n4 = pair2n3 || pair4n5 ? false : _3rdRank == _4thRank;

    if (pair1n2 && pair3n4) {
        const twoPairHigh = new Hand(cards, HandRank.TWO_PAIR, HandName.TWO_PAIR);

        twoPairHigh.highPair = [_1stCard, _2ndCard];
        twoPairHigh.lowPair = [_3rdCard, _4thCard];
        twoPairHigh.kicker = _5thCard;

        return twoPairHigh;
    }

    if (pair2n3 && pair4n5) {
        const twoPairLow = new Hand(cards, HandRank.TWO_PAIR, HandName.TWO_PAIR);

        twoPairLow.kicker = _1stCard;
        twoPairLow.highPair = [_2ndCard, _3rdCard];
        twoPairLow.lowPair = [_4thCard, _5thCard];

        return twoPairLow;
    }

    if (pair1n2) {
        const pair1 = new Hand(cards, HandRank.ONE_PAIR, HandName.ONE_PAIR);
        pair1.pair = [_1stCard, _2ndCard];
        pair1.kickers = [_3rdCard, _4thCard, _5thCard];
        return pair1;
    }

    if (pair2n3) {
        const pair2 = new Hand(cards, HandRank.ONE_PAIR, HandName.ONE_PAIR);
        pair2.kickers = [_1stCard, _4thCard, _5thCard];
        pair2.pair = [_2ndCard, _3rdCard];
        return pair2;
    }

    if (pair3n4) {
        const pair3 = new Hand(cards, HandRank.ONE_PAIR, HandName.ONE_PAIR);
        pair3.kickers = [_1stCard, _2ndCard, _5thCard];
        pair3.pair = [_3rdCard, _4thCard];
        return pair3;
    }

    if (pair4n5) {
        const pair4 = new Hand(cards, HandRank.ONE_PAIR, HandName.ONE_PAIR);
        pair4.kickers = [_1stCard, _2ndCard, _3rdCard];
        pair4.pair = [_4thCard, _5thCard];
        return pair4;
    }

    return new Hand(cards, HandRank.HIGH_CARD, HandName.HIGH_CARD);
}

function compareStraightFlush(handA, handB) {
    return handA.cards[0].rank - handB.cards[0].rank;
}

function compareFourOfAKind(handA, handB) {
    const diff = handA.quadruplet[0].rank - handB.quadruplet[0].rank;
    if (diff == 0) {
        return handA.kicker.rank - handB.kicker.rank;
    }
    return diff;
}

function compareFullHouse(handA, handB) {
    const diff = handA.triplet[0].rank - handB.triplet[0].rank;
    if (diff == 0) {
        return handA.pair[0].rank - handB.pair[0].rank;
    }
    return diff;
}

function compareStraight(handA, handB) {
    return handA.cards[0].rank - handB.cards[0].rank;
}

function compareThreeOfAKind(handA, handB) {
    let diff = handA.triplet[0].rank - handB.triplet[0].rank;
    if (diff == 0) {
        diff = handA.kickers[0].rank - handB.kickers[0].rank;
        if (diff == 0) {
            return handA.kickers[1].rank - handB.kickers[1].rank;
        }
        return diff;
    }
    return diff;
}

function compareTwoPair(handA, handB) {
    let diff = handA.highPair[0].rank - handB.highPair[0].rank;
    if (diff == 0) {
        diff = handA.lowPair[0].rank - handB.lowPair[0].rank;
        if (diff == 0) {
            return handA.kicker.rank - handB.kicker.rank;
        }
        return diff;
    }
    return diff;
}

function compareOnePair(handA, handB) {
    let diff = handA.pair[0].rank - handB.pair[0].rank;
    if (diff == 0) {
        for (let i = 0; i < 3; i++) {
            diff = handA.kickers[i].rank - handB.kickers[i].rank;
            if (diff != 0) {
                return diff;
            }
        }
    }
    return diff;
}

function compareHighCard(handA, handB) {
    let diff;
    for (let i = 0; i < 5; i++) {
        diff = handA.cards[i].rank - handB.cards[i].rank;
        if (diff != 0) {
            return diff;
        }
    }
    return diff;
}

export function compareSameRank(handA, handB) {
    const rank = handA.rank;
    if (rank == HandRank.STRAIGHT_FLUSH) {
        return compareStraightFlush(handA, handB);
    }
    if (rank == HandRank.FOUR_OF_A_KIND) {
        return compareFourOfAKind(handA, handB);
    }
    if (rank == HandRank.FULL_HOUSE) {
        return compareFullHouse(handA, handB);
    }
    if (rank == HandRank.STRAIGHT) {
        return compareStraight(handA, handB);
    }
    if (rank == HandRank.THREE_OF_A_KIND) {
        return compareThreeOfAKind(handA, handB);
    }
    if (rank == HandRank.TWO_PAIR) {
        return compareTwoPair(handA, handB);
    }
    if (rank == HandRank.ONE_PAIR) {
        return compareOnePair(handA, handB);
    }
    return compareHighCard(handA, handB);
}

function compareCards(cardA, cardB) {
    return cardA.rank - cardB.rank;
}

/**
 *
 * @param {Card[]} cards - exactly 7 cards
 * @return {Hand}
 */
export function getHighestHandOfSevenCards(...cards) {
    cards.sort(compareCards);

    const length = cards.length;
    let highestHand;
    let bestRank = HandRank.HIGH_CARD + 1;

    for (let a = 0; a < length - 4; a++) {
        for (let b = a + 1; b < length - 3; b++) {
            for (let c = b + 1; c < length - 2; c++) {
                for (let d = c + 1; d < length - 1; d++) {
                    for (let e = d + 1; e < length; e++) {

                        const cardsOfHand = [cards[a], cards[b], cards[c], cards[d], cards[e]];
                        const hand = getHand(cardsOfHand);

                        if (hand.rank < bestRank) {
                            bestRank = hand.rank;
                            highestHand = hand;
                        }
                    }
                }
            }
        }
    }

    return highestHand;
}

/**
 *
 * @param {Card[]} cards - exactly 5 cards
 * @return {Hand}
 */
export function getHighestHandOfFiveCards(...cards) {
    return getHand(cards.sort(compareCards));
}
