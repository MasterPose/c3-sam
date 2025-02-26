import type { PlayingSound } from "../utils/sound"

declare type SpeakOptions = {
    speed: number,
    pitch: number,
    throat: number,
    mouth: number,
}

declare interface SamRegistryRecord {
    instance: SamJs
    context: AudioContext
    gain: GainNode
    playing: PlayingSound | undefined
}