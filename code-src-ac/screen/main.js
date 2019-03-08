import loadAssets, { loadProfilePicture } from './net/loadAssets.js';
import {
    processAssets,
    renderStore
} from '../../code-src-h5x/render/setupWebGL.js';
import Sprites from '../../code-src-h5x/render/Sprites.js';
import eventLoop from '../../code-src-h5x/app/eventLoop.js';
import runMyScenes from './scenes/runMyScenes.js';
import { VERSION_BITS } from '../../code-src-h5x/render/constants/BaseECS.js';
import createACStub from '../common/createACStub.js';
import ACPlayer from './ACPlayer.js';
import { NEXT_SCENE } from '../common/constants/Command.js';
import { FRAME_BYTE_SIZE } from '../common/constants/Protocol.js';
import drawBackgroundScene from '../../code-gen-ac/screen/drawBackgroundScene.js';

loadAssets.then(processAssets).then(() => {

    function makeSmaller(char) {
        return Sprites.setScale(char >> VERSION_BITS, 0.6);
    }

    function hide(id) {
        Sprites.setZ(id >> VERSION_BITS, 1.0);
    }

    // where to put those lines ... ?
    const fpsTxt = Sprites.createDebugText('00 fps', 6.45, -4.2, -4.5);
    fpsTxt.forEach(makeSmaller);

    const msTxt = Sprites.createDebugText('00  ms', 6.45, -4.4, -4.5);
    msTxt.forEach(makeSmaller);

    const leftThumbX = Sprites.createDebugText('-0.00', 7.25, -3.6, -4.5);
    leftThumbX.forEach(makeSmaller);
    leftThumbX.forEach(hide);
    const leftThumbY = Sprites.createDebugText('-0.00', 7.25, -3.8, -4.5);
    leftThumbY.forEach(makeSmaller);
    leftThumbY.forEach(hide);

    const forceX = Sprites.createDebugText('-0.00', 7.25, -3.0, -4.5);
    forceX.forEach(makeSmaller);
    forceX.forEach(hide);
    const forceY = Sprites.createDebugText('-0.00', 7.25, -3.2, -4.5);
    forceY.forEach(makeSmaller);
    forceY.forEach(hide);

    const fpsMin = Sprites.createDebugText('00 min', 7.25, -4.2, -4.5);
    fpsMin.forEach(makeSmaller);
    const msMax = Sprites.createDebugText('00 max', 7.25, -4.4, -4.5);
    msMax.forEach(makeSmaller);

    const {removeSprites} = drawBackgroundScene();

    const updateFunctions = [replayInput];

    eventLoop(updateFunctions);

    const air =
        window.TEST_SERVER ?
            createACStub(WS_URL, true)
            :
            new AirConsole();

    air.onReady = (code) => {
        console.log(`we're live at 📺 ${code} 😎 🕹📱🎮 💪`);
    };

    let inputStream = [];
    let inputRecording;
    let offset = 0;

    const DataType = Object.freeze({
        MESSAGE: 0,
        CONNECT: 1,
        DISCONNECT: 2
    });

    const INPUT_FRAME_SIZE = 56;
    window.exportRecording = function () {
        window.recording = false;

        /**
         * input frame/packet
         * {
         *   uint32 (4 bytes) frame
         *   uint8 (1 byte) deviceId
         *   uint8 (1 byte) data type
         *   byte[FRAME_BYTE_SIZE] (50 bytes) data {@see FRAME_BYTE_SIZE at Protocol.js}
         * }
         */

        const bufferLength = INPUT_FRAME_SIZE * inputStream.length;
        const buffer = new ArrayBuffer(bufferLength);
        const view = new DataView(buffer);

        inputStream.forEach((inputFrame, i) => {
            const offset = INPUT_FRAME_SIZE * i;

            view.setUint32(offset, inputFrame.frame, true);
            view.setUint8(offset + 4, inputFrame.id);
            view.setUint8(offset + 5, inputFrame.type);

            if (inputFrame.type == DataType.MESSAGE) {
                for (let i = 0; i < FRAME_BYTE_SIZE; i++) {
                    view.setUint8(offset + 6 + i, inputFrame.data[i]);
                }
            }
        });

        const downloadLink = document.createElement('a');

        const url = URL.createObjectURL(new Blob([buffer]));
        downloadLink.href = url;
        downloadLink.download = 'ac-input.h5x';
        downloadLink.style.display = 'none';

        document.body.appendChild(downloadLink);

        downloadLink.click();

        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    };

    window.loadRecording = function () {
        const uploadInput = document.createElement('input');

        uploadInput.type = 'file';
        uploadInput.style.display = 'none';

        uploadInput.addEventListener('change', event => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', event => {
                offset = 0;
                inputRecording = new DataView(event.target.result);

                console.log('loaded recording successfully');
                window.replaying = true;

                console.log(`current frame: ${renderStore.frame} 1st input: ${inputRecording.getUint32(offset, true)}`);
            });
            reader.readAsArrayBuffer(file);
        });

        document.body.appendChild(uploadInput);

        uploadInput.click();

        document.body.removeChild(uploadInput);
    };

    if (window.inputRecordingURL) {
        fetch(window.inputRecordingURL)
            .then(response => {
                if (response.ok)
                    return response.arrayBuffer();

                throw new Error('could not fetch recorded input data');
            })
            .then(buffer => {
                offset = 0;
                inputRecording = new DataView(buffer);

                console.log('loaded recording successfully');
                window.replaying = true;

                console.log(`current frame: ${renderStore.frame} 1st input: ${inputRecording.getUint32(offset, true)}`);
            });
    }

    function replayInput() {
        if (!window.replaying)
            return;

        if (inputRecording == undefined || offset >= inputRecording.byteLength)
            return;

        while (offset < inputRecording.byteLength && renderStore.frame == inputRecording.getUint32(offset, true)) {

            const deviceId = inputRecording.getUint8(offset + 4);
            const type = inputRecording.getUint8(offset + 5);

            if (type == DataType.MESSAGE) {
                const data = new Uint8Array(inputRecording.buffer, offset + 6, FRAME_BYTE_SIZE);
                air.onMessage(deviceId, data);

            } else if (type == DataType.CONNECT) {
                air.onConnect(deviceId);

            } else if (type == DataType.DISCONNECT) {
                air.onDisconnect(deviceId);
            }

            offset += INPUT_FRAME_SIZE;
        }
    }

    air.onMessage = function handleMessages(id, data) {
        if (window.recording) {
            inputStream.push(Object.freeze({frame: renderStore.frame, id, type: DataType.MESSAGE, data}));
        }

        const player = players.get(id);
        if (player) {
            player.setData(data);
        } else {
            console.warn(`got msg from unknown device ${id}`);
        }
    };

    const players = new Map();
    const addedPlayers = new Set();
    const removedPlayers = new Set();

    const airState = Object.seal({
        profileUpdate: false,
        connectUpdate: false,
        disconnectUpdate: false,
        players,
        addedPlayers,
        removedPlayers,
        medals: []
    });

    air.onConnect = id => {
        if (window.recording) {
            inputStream.push(Object.freeze({frame: renderStore.frame, id, type: DataType.CONNECT}));
        }

        const imgURL = air.getProfilePicture(id);
        const player = new ACPlayer(id, air.getNickname(id), air.getUID(id));

        loadProfilePicture(imgURL).then(img => {
            airState.profileUpdate = true;
            player.img = img;
        });

        players.set(id, player);
        addedPlayers.add(player);
        airState.connectUpdate = true;
    };

    air.onDisconnect = id => {
        if (window.recording) {
            inputStream.push(Object.freeze({frame: renderStore.frame, id, type: DataType.DISCONNECT}));
        }

        removedPlayers.add(players.get(id));
        players.delete(id);
        airState.disconnectUpdate = true;
    };

    runMyScenes(air, updateFunctions, airState);
});
