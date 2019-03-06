export default class OrientationState {
    constructor(alpha, beta, gamma) {
        this.alpha = alpha;
        this.beta = beta;
        this.gamma = gamma;

        Object.seal(this);
    }
}