<img src="./src/icon.svg" width="100" /><br>

# SAM 

Run the SAM Text-To-Speech (TTS) inside Construct 3!

Author: Master Pose <br>
Website: [https://github.com/MasterPose/c3-sam](https://github.com/MasterPose/c3-sam) <br>
Addon Url: [https://github.com/MasterPose/c3-sam](https://github.com/MasterPose/c3-sam) <br>
Download Latest Version : [Version: 1.0.0.0](https://github.com/MasterPose/c3-sam/releases/latest) <br>

<br>

<sub>

Made using [c3-framework](https://github.com/C3Framework/framework) 

</sub>

## Table of Contents

- [Usage](#usage)
- [Examples Files](#examples-files)
- [Properties](#properties)
- [Actions](#actions)
- [Conditions](#conditions)
- [Expressions](#expressions)

---

## Usage

First you must install the dependencies via NPM using:

```
npm install
```

To build the addon, run the following command:

```
npx c3fo build
```

To start the dev server, run:

```
npx c3fo build -D
```

The build uses the `addon.ts` file for the configurations and the `runtime.ts` file as the entry point to generate everything else.
The files defined with `@AceClass` contain all the Actions, Conditions and Expressions logic and configuration, you may want to check them. 

## Examples Files

- [demo](./examples/demo.c3p)
<br>

---

## Properties

| Property Name | Description | Type |
| --- | --- | --- |
| Default Speed | The default speed for the TTS | integer |
| Default Pitch | The default pitch for the TTS | integer |
| Default Throat | The default throat for the TTS | integer |
| Default Mouth | The default mouth for the TTS | integer |

---

## Actions

| Action | Description | Params |
| --- | --- | --- |
| Start Speech | Starts a speech using the global parameters. | Text *(string)* <br>Tag *(string)* <br> |
| Start speech as | Starts a speech using parameters from list a of pre-defined typical settings. | Text *(string)* <br>Character *(combo)* <br>Tag *(string)* <br> |
| Start Speech Using Parameters | Starts a speech independently, manually setting all parameters. | Text *(string)* <br>Speed *(number)* <br>Pitch *(number)* <br>Throat *(number)* <br>Mouth *(number)* <br>db *(number)* <br>Tag *(string)* <br> |
| Stop Speech | Stops a speech of a given tag. | Tag *(string)* <br> |
| Stop All Speeches | Stops all playing speeches. |  |
| Set Volume | Sets the volume parameter. | Db *(number)* <br> |
| Set Pitch | Sets the global pitch parameter. | Pitch *(number)* <br> |
| Set Speed | Sets the global speed parameter. | Speed *(number)* <br> |
| Set Mouth | Sets the global mouth parameter. | Mouth *(number)* <br> |
| Set Throat | Sets the global throat parameter. | Throat *(number)* <br> |
| Reset Volume | Resets the current volume value to its default one. |  |
| Reset All Properties | Resets the current global values to their default ones. |  |

---
## Conditions

| Condition | Description | Params |
| --- | --- | --- |
| On Any Speech Start | Triggered when any speech starts. |  |
| On Any Speech End | Triggered when any speech ends. |  |
| On Any Speech Stop | Triggered when any speech was stopped. |  |
| On Any Error | Triggered when any error happens. |  |
| On Speech  Start | Triggered when a speech has started. | Tag *(string)* <br> |
| On Speech  End | Triggered when a speech has ended (not stopped). | Tag *(string)* <br> |
| On Speech  Stop | Triggered when a speech was stopped. | Tag *(string)* <br> |
| On Error | Triggered when an error happens. | Tag *(string)* <br> |

---
## Expressions

| Expression | Description | Return Type | Params |
| --- | --- | --- | --- |
| lastTag | The latest tag relevant to the the current trigger. | string |  |
| lastError | The latest error that was thrown. | string |  |
| volume | The current global volume. | number |  |
| pitch | The current global pitch. | number |  |
| speed | The current global speed. | number |  |
| mouth | The current global mouth. | number |  |
| throat | The current global throat. | number |  |
