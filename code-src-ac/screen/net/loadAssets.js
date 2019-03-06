import Audio from '../../../code-src-h5x/audio/Audio.js';

export default Promise.all([

    new Promise(resolve => window.onload = resolve),

    fetch('asset-gen-ac/screen/sub-images.h5')
        .then(response => {
            if (response.ok)
                return response.arrayBuffer();

            throw new Error('could not fetch sub-image-data');
        }),

    fetch('asset-gen-ac/screen/atlas_0.png')
        .then(response => {
            if (response.ok)
                return response.blob();

            throw new Error('could not fetch texture-atlas');
        })
        .then(blob => {
            console.log(`texture atlas file size: ${(blob.size / 1024 / 1024).toFixed(2)} mb`);

            return new Promise(resolve => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = URL.createObjectURL(blob);
            });
        }),

    fetch('asset-gen-ac/screen/atlas_1.png')
        .then(response => {
            if (response.ok)
                return response.blob();

            throw new Error('could not fetch texture-atlas');
        })
        .then(blob => {
            console.log(`texture atlas file size: ${(blob.size / 1024 / 1024).toFixed(2)} mb`);

            return new Promise(resolve => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = URL.createObjectURL(blob);
            });
        }),

    fetch('asset-gen-ac/screen/sprite-dimensions.h5')
        .then(response => {
            if (response.ok)
                return response.arrayBuffer();

            throw new Error('could not fetch sprite-dimension-data');
        }),

    fetch('asset-gen-ac/screen/sfx-segments.h5')
        .then(response => {
            if (response.ok)
                return response.arrayBuffer();

            throw new Error('could not fetch sfx audio-segment-data');
        }),

    fetch('asset-gen-ac/screen/sfx.wav')
        .then(response => {
            if (response.ok)
                return response.arrayBuffer();

            throw new Error('could not fetch sfx audio-sprite');
        })
        .then(
            /**
             * @param {Response | ArrayBuffer} buffer audio array buffer
             * @returns {Promise<AudioBuffer>} decoded audio data
             */
            buffer => {
                console.log(`encoded audio buffer size: ${(buffer.byteLength / 1024 / 1024).toFixed(2)} mb`);

                // thanks apple
                if (window.webkitAudioContext) {
                    return new Promise(resolve => {
                        // noinspection JSIgnoredPromiseFromCall
                        Audio.ctx.decodeAudioData(buffer, decodedData => resolve(decodedData), error => {
                            // reason => console.error('audio issue:', reason)
                            throw new Error('error while decoding audio data: ' + error.err);
                        });
                    });
                }

                return Audio.ctx.decodeAudioData(buffer);
            })
])
    .catch(error => console.log(error));

/**
 * @param {string} imgURL
 * @returns {Promise<Image>}
 */
export function loadProfilePicture(imgURL) {
    return fetch(imgURL)
        .then(response => {
            if (response.ok)
                return response.blob();

            throw new Error('could not fetch profile picture from ' + imgURL);
        })
        .then(blob => {
            console.log(`profile picture size: ${(blob.size / 1024 / 1024).toFixed(2)} mb`);

            return new Promise(resolve => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = URL.createObjectURL(blob);
            });
        });
}
