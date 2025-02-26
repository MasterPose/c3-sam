import { SamRegistryRecord } from "../types/plugin";
import delay from "../utils/delay";
import { dbToLinear, newAudioContext, playSound } from "../utils/sound";
import SamJs from 'sam-js';

const DOM_ID = 'MasterPose_SamTTS:DOM_Handler';

const registry = new Map<string, SamRegistryRecord>();

const HANDLER_CLASS = class Handler extends globalThis.DOMHandler {
    constructor(iRuntime: IRuntimeInterface) {
        super(iRuntime, DOM_ID);

        this.AddRuntimeMessageHandler(
            'PlaySpeech',
            async (data: any) => {
                return this.PlaySpeech(
                    data.text,
                    data.speed,
                    data.pitch,
                    data.throat,
                    data.mouth,
                    data.volume,
                    data.tag
                )
            }
        );

        this.AddRuntimeMessageHandler(
            'StopSpeech',
            (data: any) => this.StopSpeech(data.tag)
        );

        this.AddRuntimeMessageHandler(
            'StopAllSpeeches',
            () => this.StopAllSpeeches()
        )
    }
    async PlaySpeech(
        text: string,
        speed: number,
        pitch: number,
        throat: number,
        mouth: number,
        volume: number,
        tag: string
    ) {
        const sam = new SamJs({
            speed,
            pitch,
            throat,
            mouth,
        });

        let record: SamRegistryRecord;

        const exists = registry.has(tag);

        if (exists) {
            record = registry.get(tag)!;

            if (record.playing) {
                record.playing!.disconnect();

                await delay(10); // Needed delay, AudioContext won't disconnect without it
            }

            record.instance = sam;
        } else {
            const { context, gain } = newAudioContext();

            record = {
                context,
                gain,
                instance: sam,
                playing: undefined
            }
        }

        const buffer = sam.buf32(text) as Float32Array<ArrayBufferLike>;

        record.gain.gain.value = dbToLinear(volume);

        const playingSound = playSound(record.context, record.gain, buffer);

        record.playing = playingSound;

        if (!exists) {
            registry.set(tag, record);
        }

        // @ts-ignore
        this.PostToRuntime('OnSpeechStart', {
            tag,
            buffer
        });

        await record.playing.promise.then(() => {
            this.PostToRuntime('OnSpeechEnd', {
                tag
            });
        }).catch((error) => {
            if (error === '') return;

            this.PostToRuntime('OnSpeechError', {
                tag,
                error
            });
        }).finally(() => {
            record.playing = undefined;
        })

        return true;
    }
    StopSpeech(tag: string) {
        const record = registry.get(tag);

        if (!record?.playing) return;

        record.playing.disconnect();

        this.PostToRuntime('OnSpeechStop', {
            tag
        });
    }
    StopAllSpeeches() {
        for (const [tag, record] of registry) {
            if (record?.playing) {
                record.playing.disconnect();

                this.PostToRuntime('OnSpeechStop', {
                    tag
                });
            }
        }
    }
};

globalThis.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
