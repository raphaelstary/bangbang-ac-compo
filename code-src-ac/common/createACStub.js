const Message = Object.freeze({
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    READY: 'ready',
    MESSAGE: 'message'
});

export default (url, isMainScreen = false, deviceMotion = false, fullscreen = false, screenOrientation) => {

    let __connected = false;
    let __id = isMainScreen ? 0 : undefined;

    const air = Object.seal({
        getDeviceId() {
            return __id;
        },
        message(id, data) {
            if (window.SANDBOX_MODE)
                return;

            socket.send(JSON.stringify({
                type: Message.MESSAGE,
                sender: __id,
                receiver: id,
                data: data
            }));
        },
        vibrate(time) {
            if (navigator.vibrate) {
                navigator.vibrate(time);
            }
        },
        broadcast(data) {
            if (window.SANDBOX_MODE)
                return;

            socket.send(JSON.stringify({
                type: Message.MESSAGE,
                sender: __id,
                receiver: 'all',
                data: data
            }));
        },
        getNickname(id) {
            if (id == undefined) {
                return 'Guest ' + __id;
            }
            return 'Guest ' + id;
        },
        getProfilePicture(id) {
            const testURLs = [
                '//images-eds.xboxlive.com/image?url=z951ykn43p4FqWbbFvR2Ec.8vbDhj8G2Xe7JngaTToBrrCmIEEXHC9UNrdJ6P7KIoIeJ1sl4QgwrJRGcdRHOCqxWQ_UP1PHw2k5.dWyiRZbnEUeAIqFPUau1dor0LGez&format=png&w=64&h=64',
                '//images-eds.xboxlive.com/image?url=KT_QTPJeC5ZpnbX.xahcbrZ9enA_IV9WfFEWIqHGUb5P30TpCdy9xIzUMuqZVCfbfGniUVNHsDXsIvQ.5Xw1G1WVPy9kwuprNNtEI5Q92M42EPKc4F30jduAsZ9QwYcFgajGS2zFBMnxgXEJjsw6R7NaZbEgkjuMJtMhNtXvTQQ-&format=png&w=64&h=64'
            ];

            return testURLs[Math.floor(Math.random() * testURLs.length)];
        },
        getUID(id) {
            return 'test_' + id;
        },
        onReady: undefined,
        onConnect: undefined,
        onDisconnect: undefined,
        onMessage: undefined,
        onDeviceMotion: undefined
    });

    let socket;
    if (!window.SANDBOX_MODE) {

        socket = isMainScreen ? new WebSocket(url + '/main') : new WebSocket(url);

        socket.addEventListener('open', event => {
            __connected = true;
        });
        socket.addEventListener('close', event => {
            __connected = false;
        });
        socket.addEventListener('message', event => {
            const msg = JSON.parse(event.data);

            if (msg.type == Message.CONNECT) {
                if (__id == undefined) {
                    __id = msg.id;
                } else if (air.onConnect) {
                    air.onConnect(msg.id);
                }
            } else if (msg.type == Message.DISCONNECT) {
                // todo

            } else if (msg.type == Message.READY) {
                if (air.onReady) {
                    air.onReady(msg.code);
                }

            } else if (msg.type == Message.MESSAGE) {
                if (air.onMessage) {
                    air.onMessage(msg.sender, msg.data);
                }
            }
        });

    }

    if (deviceMotion) {
        window.addEventListener('deviceorientation', event => {
            if (air.onDeviceMotion)
                air.onDeviceMotion(event);
        });
    }

    function oneTimeClick(event) {
        event.preventDefault();

        document.documentElement.removeEventListener('click', oneTimeClick);

        if (document.fullscreenEnabled && document.fullscreenElement == null) {
            document.documentElement.requestFullscreen() // with webkitRequestFullscreen() you get no smart buttons displayed on android ... funny? right
            // document.documentElement.webkitRequestFullscreen();
                .then(() => {
                    console.log('went full screen');
                    if (screenOrientation) {
                        window.screen.orientation.lock(screenOrientation)
                            .then(() => console.log('screen locked'))
                            .catch((reason) => console.log('could not lock screen: ' + reason));
                    }
                })
                .catch((reason) => console.log('could not go full screen: ' + reason));
        }
    }

    if (fullscreen) {
        document.documentElement.addEventListener('click', oneTimeClick);
    }


    return air;
}