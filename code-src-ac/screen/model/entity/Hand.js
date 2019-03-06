export default class Hand {
    constructor(cards, rank, name, kickers, kicker, quadruplet, triplet, pair, highPair, lowPair) {
        this.cards = cards;
        this.rank = rank;
        this.name = name;

        this.kickers = kickers;
        this.kicker = kicker;
        this.quadruplet = quadruplet;
        this.triplet = triplet;
        this.pair = pair;
        this.highPair = highPair;
        this.lowPair = lowPair;

        Object.seal(this);
    }
}
