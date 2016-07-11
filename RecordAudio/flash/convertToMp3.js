﻿
var encoderWorker = new Worker('flash/lib/mp3Worker.js');
var i = 0;

function encode64(buffer) {
    var binary = '',
        bytes = new Uint8Array(buffer),
        len = bytes.byteLength;

    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function parseWav(wav) {
    function readInt(i, bytes) {
        var ret = 0,
            shft = 0;

        while (bytes) {
            ret += wav[i] << shft;
            shft += 8;
            i++;
            bytes--;
        }
        return ret;
    }
    if (readInt(20, 2) != 1) throw 'Invalid compression code, not PCM';
    if (readInt(22, 2) != 1) throw 'Invalid number of channels, not 1';
    return {
        sampleRate: readInt(24, 4),
        bitsPerSample: readInt(34, 2),
        samples: wav.subarray(44)
    };
}

function Uint8ArrayToFloat32Array(u8a) {
    var f32Buffer = new Float32Array(u8a.length);
    for (var i = 0; i < u8a.length; i++) {
        var value = u8a[i << 1] + (u8a[(i << 1) + 1] << 8);
        if (value >= 0x8000) value |= ~0x7FFF;
        f32Buffer[i] = value / 0x8000;
    }
    return f32Buffer;
}

function convertToMp3(wavFile, audioControl) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', wavFile, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (e) {
        var buffer = new Uint8Array(xhr.response),
            data = parseWav(buffer);

        encoderWorker.postMessage({
            cmd: 'init', config: {
                mode: 3,
                channels: 1,
                samplerate: data.sampleRate,
                bitlate: data.bitsPerSample
            }
        });

        encoderWorker.postMessage({ cmd: 'encode', buf: Uint8ArrayToFloat32Array(data.samples) });
        encoderWorker.postMessage({ cmd: 'finish' });
        encoderWorker.onmessage = function (e) {
            if (e.data.cmd == 'data') {

                audioControl.src = 'data:audio/mp3;base64,' + encode64(e.data.buf);
                audioControl.play();
            }
        };

    };

    xhr.send();
}
