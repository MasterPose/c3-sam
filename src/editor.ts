// @ts-nocheck
import { Plugin, initEditor } from "c3-framework";
import Config from "./addon";

const A_C = SDK.Plugins[Config.id] = class BaseSamEditor extends Plugin.Editor.Base(Config) {
    constructor() {
        super();

        const info = this._info;

        this._info.SetDOMSideScripts(['libs/domSide.js']);
    }
};

A_C.Register(Config.id, A_C);

A_C.Type = Plugin.Editor.Type(Config);

A_C.Instance = Plugin.Editor.Instance(Config);
