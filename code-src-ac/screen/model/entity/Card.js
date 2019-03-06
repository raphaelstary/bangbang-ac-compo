export default class Card {
    constructor(rank, suit, img) {
        this.rank = rank;
        this.suit = suit;
        this.img = img;

        this.sprite = 0;
        this.left = 0;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;

        Object.seal(this);
    }
}
