import { BehaviorConfig, BuiltAddonConfig, PluginConfig } from "c3-framework";

const Config: PluginConfig = {
  addonType: "plugin",
  type: "object",
  id: "MasterPose_SamTTS",
  name: "SAM",
  version: "1.0.0.0",
  category: "general",
  author: "Master Pose",
  description: "Run the SAM Text-To-Speech (TTS) inside Construct 3!",
  icon: "icon.svg",
  editorScripts: ['editor.js'],
  website: "https://github.com/MasterPose/c3-sam",
  documentation: "https://github.com/MasterPose/c3-sam",
  addonUrl: 'https://github.com/MasterPose/c3-sam',
  githubUrl: "https://github.com/MasterPose/c3-sam",
  info: {
    Set: {
      CanBeBundled: true,
      IsDeprecated: false,
      IsSingleGlobal: true,
    },
  },
  fileDependencies: {
    "domSide.ts": 'copy-to-output'
  },
  properties: [
    {
      id: 'speed',
      name: 'Default Speed',
      type: 'integer',
      desc: 'The default speed for the TTS',
      options: {
        initialValue: 72,
        interpolatable: false,
      }
    },
    {
      id: 'pitch',
      name: 'Default Pitch',
      type: 'integer',
      desc: 'The default pitch for the TTS',
      options: {
        initialValue: 64,
        interpolatable: false,
      }
    },
    {
      id: 'throat',
      name: 'Default Throat',
      type: 'integer',
      desc: 'The default throat for the TTS',
      options: {
        initialValue: 128,
        interpolatable: false,
      }
    },
    {
      id: 'mouth',
      name: 'Default Mouth',
      type: 'integer',
      desc: 'The default mouth for the TTS',
      options: {
        initialValue: 128,
        interpolatable: false,
      }
    }
  ],
  aceCategories: {
    general: "Speech",
    stop: "Speech: Stop",
    parameters: "Parameters",
    parametersReset: "Parameters: Reset",
    triggerAll: "Speech: All",
    triggerTag: "Speech: Tag",
    dataBinary: "Binary"
  },
};

export default Config as BuiltAddonConfig;