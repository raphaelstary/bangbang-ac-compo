import * as CardRank from '../constants/CardRank.js';
import * as Suit from '../constants/Suit.js';
import * as SubImage from '../../../../code-gen-ac/screen/SubImage.js';
import Card from './Card.js';

export function getDeck() {
    return [
        new Card(CardRank.ACE, Suit.SPADES, SubImage.CARD_SA),
        new Card(CardRank.KING, Suit.SPADES, SubImage.CARD_SK),
        new Card(CardRank.QUEEN, Suit.SPADES, SubImage.CARD_SQ),
        new Card(CardRank.JACK, Suit.SPADES, SubImage.CARD_SJ),
        new Card(CardRank.TEN, Suit.SPADES, SubImage.CARD_S10),
        new Card(CardRank.NINE, Suit.SPADES, SubImage.CARD_S9),
        new Card(CardRank.EIGHT, Suit.SPADES, SubImage.CARD_S8),
        new Card(CardRank.SEVEN, Suit.SPADES, SubImage.CARD_S7),
        new Card(CardRank.SIX, Suit.SPADES, SubImage.CARD_S6),
        new Card(CardRank.FIVE, Suit.SPADES, SubImage.CARD_S5),
        new Card(CardRank.FOUR, Suit.SPADES, SubImage.CARD_S4),
        new Card(CardRank.THREE, Suit.SPADES, SubImage.CARD_S3),
        new Card(CardRank.TWO, Suit.SPADES, SubImage.CARD_S2),
        new Card(CardRank.ACE, Suit.HEARTS, SubImage.CARD_HA),
        new Card(CardRank.KING, Suit.HEARTS, SubImage.CARD_HK),
        new Card(CardRank.QUEEN, Suit.HEARTS, SubImage.CARD_HQ),
        new Card(CardRank.JACK, Suit.HEARTS, SubImage.CARD_HJ),
        new Card(CardRank.TEN, Suit.HEARTS, SubImage.CARD_H10),
        new Card(CardRank.NINE, Suit.HEARTS, SubImage.CARD_H9),
        new Card(CardRank.EIGHT, Suit.HEARTS, SubImage.CARD_H8),
        new Card(CardRank.SEVEN, Suit.HEARTS, SubImage.CARD_H7),
        new Card(CardRank.SIX, Suit.HEARTS, SubImage.CARD_H6),
        new Card(CardRank.FIVE, Suit.HEARTS, SubImage.CARD_H5),
        new Card(CardRank.FOUR, Suit.HEARTS, SubImage.CARD_H4),
        new Card(CardRank.THREE, Suit.HEARTS, SubImage.CARD_H3),
        new Card(CardRank.TWO, Suit.HEARTS, SubImage.CARD_H2),
        new Card(CardRank.ACE, Suit.DIAMONDS, SubImage.CARD_DA),
        new Card(CardRank.KING, Suit.DIAMONDS, SubImage.CARD_DK),
        new Card(CardRank.QUEEN, Suit.DIAMONDS, SubImage.CARD_DQ),
        new Card(CardRank.JACK, Suit.DIAMONDS, SubImage.CARD_DJ),
        new Card(CardRank.TEN, Suit.DIAMONDS, SubImage.CARD_D10),
        new Card(CardRank.NINE, Suit.DIAMONDS, SubImage.CARD_D9),
        new Card(CardRank.EIGHT, Suit.DIAMONDS, SubImage.CARD_D8),
        new Card(CardRank.SEVEN, Suit.DIAMONDS, SubImage.CARD_D7),
        new Card(CardRank.SIX, Suit.DIAMONDS, SubImage.CARD_D6),
        new Card(CardRank.FIVE, Suit.DIAMONDS, SubImage.CARD_D5),
        new Card(CardRank.FOUR, Suit.DIAMONDS, SubImage.CARD_D4),
        new Card(CardRank.THREE, Suit.DIAMONDS, SubImage.CARD_D3),
        new Card(CardRank.TWO, Suit.DIAMONDS, SubImage.CARD_D2),
        new Card(CardRank.ACE, Suit.CLUBS, SubImage.CARD_CA),
        new Card(CardRank.KING, Suit.CLUBS, SubImage.CARD_CK),
        new Card(CardRank.QUEEN, Suit.CLUBS, SubImage.CARD_CQ),
        new Card(CardRank.JACK, Suit.CLUBS, SubImage.CARD_CJ),
        new Card(CardRank.TEN, Suit.CLUBS, SubImage.CARD_C10),
        new Card(CardRank.NINE, Suit.CLUBS, SubImage.CARD_C9),
        new Card(CardRank.EIGHT, Suit.CLUBS, SubImage.CARD_C8),
        new Card(CardRank.SEVEN, Suit.CLUBS, SubImage.CARD_C7),
        new Card(CardRank.SIX, Suit.CLUBS, SubImage.CARD_C6),
        new Card(CardRank.FIVE, Suit.CLUBS, SubImage.CARD_C5),
        new Card(CardRank.FOUR, Suit.CLUBS, SubImage.CARD_C4),
        new Card(CardRank.THREE, Suit.CLUBS, SubImage.CARD_C3),
        new Card(CardRank.TWO, Suit.CLUBS, SubImage.CARD_C2)
    ];
}

export function shuffle(deck) {
    const shuffled = [];
    while (deck.length > 1) {
        const index = Math.floor(Math.random() * deck.length); // random int inclusive max [0 .. deck.length-1]
        shuffled.push(deck.splice(index, 1)[0]);
    }
    shuffled.push(deck[0]);

    return shuffled;
}
