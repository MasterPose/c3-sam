function clamp(x: number, min: number, max: number) {
    return Math.max(Math.min(x, max), min);
}

export type PlayingSound = {
    promise: Promise<true>
    source: AudioBufferSourceNode,
    disconnect: () => void
};

export function playSound(context: AudioContext, gainNode: GainNode, audiobuffer: Float32Array): PlayingSound {
    let bufferSource: AudioBufferSourceNode;
    let promiseReject: (reason?: any) => void;
    let promise = new Promise<true>((resolve, reject) => {
        let rejected = false;
        let source = context.createBufferSource();
        let soundBuffer = context.createBuffer(1, audiobuffer.length, 22050);
        let buffer = soundBuffer.getChannelData(0);
        for (let i = 0; i < audiobuffer.length; i++) {
            buffer[i] = audiobuffer[i];
        }
        source.buffer = soundBuffer;
        source.connect(gainNode);
        source.onended = () => {
            if (rejected) return;

            resolve(true);
        };
        bufferSource = source;
        promiseReject = (reason) => {
            rejected = true;
            source.disconnect();
            reject(reason);
        }
        source.start(0);
    });

    return {
        promise,
        source: bufferSource!,
        disconnect: () => {
            promiseReject('');
        },
    };
}

export function newAudioContext() {
    const context = new AudioContext;
    const gain = context.createGain();

    gain.connect(context.destination);

    return { context, gain };
}

const MAX_VOLUME = 10;


export function dbToLinear(x: number) {
    return clamp(Math.pow(10, (!isFinite(x) ? 0 : x) / 20), 0, MAX_VOLUME);
}

export function linearToDb(x: number) {
    return Math.log10(clamp(x, 0, MAX_VOLUME)) * 20;
}