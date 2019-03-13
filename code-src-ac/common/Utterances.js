const synthSupport = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

export function hasSpeechSynthesis() {
    return synthSupport;
}

let zira;

/**
 * @param {string} text
 * @param {number} rate=1
 * @return {SpeechSynthesisUtterance}
 */
export function getUtterance(text, rate = 1) {
    const utterance = new SpeechSynthesisUtterance(text);

    if (rate != 1) {
        utterance.rate = rate;
    }

    if (zira) {
        utterance.voice = zira;

    } else {
        zira = window.speechSynthesis.getVoices().filter(voice => voice.name.startsWith('Microsoft Zira'))[0];

        if (zira) {
            utterance.voice = zira;
        } else {
            utterance.lang = 'en-US';
        }
    }

    return utterance;
}

