import { AceClass, Action, Condition, Expression, Param, Plugin, Trigger } from "c3-framework";
import Config from "./addon";
import { SpeakOptions } from "./types/plugin";

const DOM_ID = 'MasterPose_SamTTS:DOM_Handler';

const CHARACTERS = {
  elf: {
    speed: 72,
    pitch: 64,
    throat: 110,
    mouth: 160,
  },
  littleRobot: {
    speed: 92,
    pitch: 60,
    throat: 190,
    mouth: 190,
  },
  stuffyGuy: {
    speed: 82,
    pitch: 72,
    throat: 110,
    mouth: 105,
  },
  littleOldLady: {
    speed: 82,
    pitch: 32,
    throat: 145,
    mouth: 145,
  },
  extraTerrestrial: {
    speed: 100,
    pitch: 64,
    throat: 150,
    mouth: 200,
  },
  sam: {
    speed: 72,
    pitch: 64,
    throat: 128,
    mouth: 128,
  }
} as { [key: string]: SpeakOptions };

const speaking = new Set<String>;

@AceClass()
class Instance extends Plugin.Instance(Config, globalThis.ISDKInstanceBase) {
  _tag: string = '';
  _error: string = '';

  /** @readonly */
  _buffer: Float32Array<ArrayBufferLike> | undefined;

  _originalSpeed: number;
  _originalPitch: number;
  _originalThroat: number;
  _originalMouth: number;
  _originalVolume: number;

  _speed: number;
  _pitch: number;
  _throat: number;
  _mouth: number;
  _volume: number;

  constructor(opts: any) {
    super({ domComponentId: DOM_ID });

    const properties = this._getInitProperties();

    this._speed = this._originalSpeed = properties[0] as number ?? CHARACTERS.sam.speed;
    this._pitch = this._originalPitch = properties[1] as number ?? CHARACTERS.sam.pitch;
    this._throat = this._originalThroat = properties[2] as number ?? CHARACTERS.sam.throat;
    this._mouth = this._originalMouth = properties[3] as number ?? CHARACTERS.sam.mouth;
    this._volume = this._originalVolume = 0;

    this._registerDomHandlers();

  }

  @Action('Start Speech {0} (tag: {1})', {
    listName: 'Start Speech',
    description: 'Starts a speech using the global parameters.',
    highlight: true,
  })
  async startSpeech(
    @Param({ desc: 'The text to say.' })
    text: string,
    @Param({ desc: 'Tag to uniquely identify the speech.', autocompleteId: 'tag' })
    tag: string
  ): Promise<JSONValue> {
    return this.startSpeechWithParams(
      text,
      this._speed,
      this._pitch,
      this._throat,
      this._mouth,
      this._volume,
      tag,
    );
  }

  @Action({
    listName: "Start speech as",
    displayText: "Start speech {0} as {1} (tag: {2})",
    description: "Starts a speech using parameters from list a of pre-defined typical settings.",
  })
  async startSpeechCharacter(
    @Param({ desc: 'The text to say.' })
    text: string,
    @Param({
      desc: 'The character template to use',
      initialValue: 'sam',
      items: [
        { elf: "Elf" },
        { littleRobot: "Little Robot" },
        { stuffyGuy: "Stuffy Guy" },
        { littleOldLady: "Little Old Lady" },
        { extraTerrestrial: "Extra-terrestrial" },
        { sam: "SAM" },
      ]
    })
    character: combo,
    @Param({ desc: 'Tag to uniquely identify the speech.', autocompleteId: 'tag' })
    tag: string
  ): Promise<JSONValue> {
    const { mouth, pitch, speed, throat } = CHARACTERS[Object.keys(CHARACTERS)[character]];

    return this.startSpeechWithParams(
      text,
      speed,
      pitch,
      throat,
      mouth,
      this._volume,
      tag
    );
  }

  @Action({
    listName: "Start Speech Using Parameters",
    displayText: "Start speech {0} using ({1}, {2}, {3}, {4}, {5}, tag: {6})",
    description: "Starts a speech independently, manually setting all parameters."
  })
  async startSpeechWithParams(
    @Param({ desc: 'The text to say.' })
    text: string,
    @Param({ desc: 'The speed parameter.' })
    speed: number = 72,
    @Param({ desc: 'The pitch parameter.' })
    pitch: number = 64,
    @Param({ desc: 'The throat parameter.' })
    throat: number = 128,
    @Param({ desc: 'The mouth parameter.' })
    mouth: number = 128,
    @Param({
      name: 'db',
      desc: 'The attenuation in decibels (dB). 0 is original volume, -10 is about half as loud, etc.'
    })
    volume: number = 0,
    @Param({ desc: 'Tag to uniquely identify the speech.', autocompleteId: 'tag' })
    tag: string
  ): Promise<JSONValue> {
    return this._postToDOMAsync('PlaySpeech', {
      text,
      speed,
      pitch,
      throat,
      mouth,
      volume,
      tag,
    })
  }

  @Action({
    listName: 'Stop Speech',
    displayText: 'Stop Speech {0}',
    description: 'Stops a speech of a given tag.',
    highlight: true,
    category: 'stop'
  })
  stopSpeech(
    @Param({ desc: 'Tag to uniquely identify the speech.', autocompleteId: 'tag' })
    tag: string
  ): void {
    return this._postToDOM('StopSpeech', { tag });
  }

  @Action({
    description: 'Stops all playing speeches.',
    category: 'stop'
  })
  stopAllSpeeches(): void {
    return this._postToDOM('StopAllSpeeches');
  }

  /*
   * Conditions
   */

  @Condition({
    listName: 'Is Speaking',
    displayText: 'Is Speaking {0}',
  })
  isSpeaking(
    @Param({ desc: 'Tag to uniquely identify the speech.', autocompleteId: 'tag' })
    tag: string
  ): boolean {
    return speaking.has(tag);
  }

  @Condition({
    listName: 'Is Any Speaking',
    displayText: 'Is Any Speaking',
  })
  isAnySpeaking(): boolean {
    return speaking.size > 0;
  }

  /* ==========
   * Triggers
   ============ */

  @Trigger({
    description: 'Triggered when any speech starts.',
    category: 'triggerAll',
  })
  onAnySpeechStart(): true {
    return true;
  }

  @Trigger({
    description: 'Triggered when any speech ends.',
    category: 'triggerAll',
  })
  onAnySpeechEnd(): true {
    return true;
  }

  @Trigger({
    description: 'Triggered when any speech was stopped.',
    category: 'triggerAll',
  })
  onAnySpeechStop(): true {
    return true;
  }

  @Trigger({
    description: 'Triggered when any error happens.',
    category: 'triggerAll',
  })
  onAnyError(): true {
    return true;
  }

  @Trigger({
    displayText: 'On Speech {0} Start',
    description: 'Triggered when a speech has started.',
    category: 'triggerTag',
  })
  onSpeechStart(
    @Param({ desc: 'Tag to uniquely identify the speech.', autocompleteId: 'tag' })
    tag: string
  ): boolean {
    return tag === this._tag;
  }

  @Trigger({
    displayText: 'On Speech {0} End',
    description: 'Triggered when a speech has ended (not stopped).',
    category: 'triggerTag',
  })
  onSpeechEnd(
    @Param({ desc: 'Tag to uniquely identify the speech.', autocompleteId: 'tag' })
    tag: string
  ): boolean {
    return tag === this._tag;
  }

  @Trigger({
    displayText: 'On Speech {0} Stop',
    description: 'Triggered when a speech was stopped.',
    category: 'triggerTag',
  })
  onSpeechStop(
    @Param({ desc: 'Tag to uniquely identify the speech.', autocompleteId: 'tag' })
    tag: string
  ): boolean {
    return tag === this._tag;
  }

  @Trigger({
    displayText: 'On {0} Error',
    description: 'Triggered when an error happens.',
    category: 'triggerTag',
  })
  onError(
    @Param({ desc: 'Tag to uniquely identify the speech.', autocompleteId: 'tag' })
    tag: string
  ): boolean {
    return tag === this._tag;
  }

  /* ============
   * Setters 
   ============= */

  @Action({
    listName: 'Set Volume',
    displayText: 'Set Volume To {0}db',
    category: 'parameters',
    description: 'Sets the volume parameter.',
    highlight: true,
  })
  setSpeechVolume(
    @Param({ desc: 'The attenuation in decibels (dB). 0 is original volume, -10 is about half as loud, etc.' })
    db: number
  ): void {
    this._volume = db;
  }

  @Action({
    listName: 'Set Pitch',
    displayText: 'Set Pitch To {0}',
    category: 'parameters',
    description: 'Sets the global pitch parameter.',
  })
  setSpeechPitch(
    @Param({ desc: 'The pitch value to set.' })
    pitch: number
  ): void {
    this._pitch = pitch;
  }

  @Action({
    listName: 'Set Speed',
    displayText: 'Set Speed To {0}',
    category: 'parameters',
    description: 'Sets the global speed parameter.',
  })
  setSpeechSpeed(
    @Param({ desc: 'The speed value to set.' })
    speed: number
  ): void {
    this._speed = speed;
  }

  @Action({
    listName: 'Set Mouth',
    displayText: 'Set Mouth To {0}',
    category: 'parameters',
    description: 'Sets the global mouth parameter.',
  })
  setSpeechMouth(
    @Param({ desc: 'The mouth value to set.' })
    mouth: number
  ): void {
    this._mouth = mouth;
  }

  @Action({
    listName: 'Set Throat',
    displayText: 'Set Throat To {0}',
    category: 'parameters',
    description: 'Sets the global throat parameter.',
  })
  setSpeechThroat(
    @Param({ desc: 'The throat value to set.' })
    throat: number
  ): void {
    this._throat = throat;
  }


  @Action({
    description: 'Resets the current volume value to its default one.',
    category: 'parametersReset',
    highlight: true
  })
  resetVolume(): void {
    this._volume = this._originalVolume
  }

  @Action({
    description: 'Resets the current global values to their default ones.',
    category: 'parametersReset',
  })
  resetAllProperties(): void {
    this._volume = this._originalVolume
    this._speed = this._originalSpeed
    this._pitch = this._originalPitch
    this._throat = this._originalThroat
    this._mouth = this._originalMouth
  }

  /* =========
   * Getters
   =========== */

  @Expression({
    description: 'The latest tag relevant to the the current trigger.',
    highlight: true
  })
  lastTag(): string {
    return this._tag;
  }

  @Expression({
    description: 'The latest error that was thrown.',
    highlight: true
  })
  lastError(): string {
    return this._error;
  }

  @Expression({
    description: 'The current global volume.',
    category: 'parameters',
  })
  volume(): number {
    return this._volume;
  }

  @Expression({
    description: 'The current global pitch.',
    category: 'parameters',
  })
  pitch(): number {
    return this._pitch;
  }

  @Expression({
    description: 'The current global speed.',
    category: 'parameters',
  })
  speed(): number {
    return this._speed;
  }

  @Expression({
    description: 'The current global mouth.',
    category: 'parameters',
  })
  mouth(): number {
    return this._mouth;
  }

  @Expression({
    description: 'The current global throat.',
    category: 'parameters',
  })
  throat(): number {
    return this._throat;
  }

  /* =========
   * Internal
   =========== */

  _registerDomHandlers() {
    this._addDOMMessageHandler('OnSpeechStart', (data: any) => {
      const { tag, buffer } = data;
      this._tag = tag;
      this._buffer = buffer;
      speaking.add(tag);

      this.trigger(this.onAnySpeechStart);
      this.trigger(this.onSpeechStart);
    })
    this._addDOMMessageHandler('OnSpeechEnd', (data: any) => {
      const { tag } = data;
      this._tag = tag;
      speaking.delete(tag);

      this.trigger(this.onAnySpeechEnd);
      this.trigger(this.onSpeechEnd);
    })
    this._addDOMMessageHandler('OnSpeechError', (data: any) => {
      const { tag, error } = data;
      this._error = `${error}`;
      this._tag = tag;
      speaking.delete(tag);

      this.trigger(this.onAnyError);
      this.trigger(this.onError);
    })
    this._addDOMMessageHandler('OnSpeechStop', (data: any) => {
      const { tag } = data;
      this._tag = tag;
      speaking.delete(tag);

      this.trigger(this.onAnySpeechStop);
      this.trigger(this.onSpeechStop);
    });
  }
}

export default Instance;