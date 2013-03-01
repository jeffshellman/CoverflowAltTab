/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

/* CoverflowAltTab::Keybinder
 *
 * These are helper classes to handle the different keybinding apis.
 */

const Lang = imports.lang;
const Main = imports.ui.main;
const Meta = imports.gi.Meta;

function AbstractKeybinder() {
    this._init();
}

AbstractKeybinder.prototype = {
    _init: function() {
    },

    enable: function() {
        throw new Error("Abstract method enable not implemented");
    },

    disable: function() {
        throw new Error("Abstract method disable not implemented");
    }
}

function KeybinderNewApi() {
    this._init();
}

KeybinderNewApi.prototype = {
    __proto__: AbstractKeybinder.prototype,

    _init: function() {
        AbstractKeybinder.prototype._init.call(this);
    },

    enable: function(startAppSwitcherBind) {
        Meta.keybindings_set_custom_handler('switch-windows', startAppSwitcherBind);
        Meta.keybindings_set_custom_handler('switch-group', startAppSwitcherBind);
        Meta.keybindings_set_custom_handler('switch-panels', startAppSwitcherBind);
        Meta.keybindings_set_custom_handler('switch-windows-backward', startAppSwitcherBind);
        Meta.keybindings_set_custom_handler('switch-group-backward', startAppSwitcherBind);
    },

    disable: function() {
        Meta.keybindings_set_custom_handler('switch-windows', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
        Meta.keybindings_set_custom_handler('switch-group', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
        Meta.keybindings_set_custom_handler('switch-panels', Lang.bind(Main.wm, Main.wm._startA11ySwitcher));
        Meta.keybindings_set_custom_handler('switch-windows-backward', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
        Meta.keybindings_set_custom_handler('switch-group-backward', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
    }
};

function KeybinderOldApi() {
    this._init();
}

KeybinderOldApi.prototype = {
    __proto__: AbstractKeybinder.prototype,

    _init: function() {
        AbstractKeybinder.prototype._init.call(this);
    },

    enable: function(startAppSwitcherBind) {
        let wrapperBind = Lang.bind(this, function(wm, binding, mask, window, backwards) {
            let bindingWrapper = {
                get_mask: function() { return mask; },
                get_name: function() { return binding.replace('_', '-'); }
            };
            startAppSwitcherBind(global.display, global.screen, window, bindingWrapper);
        });
        Main.wm.setKeybindingHandler('switch_windows', wrapperBind);
        Main.wm.setKeybindingHandler('switch_group', wrapperBind);
        Main.wm.setKeybindingHandler('switch_panels', wrapperBind);
        Main.wm.setKeybindingHandler('switch_windows_backward', wrapperBind);
        Main.wm.setKeybindingHandler('switch_group_backward', wrapperBind);
    },

    disable: function() {
        Main.wm.setKeybindingHandler('switch_windows', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
        Main.wm.setKeybindingHandler('switch_group', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
        Main.wm.setKeybindingHandler('switch_panels', Lang.bind(Main.wm, Main.wm._startA11ySwitcher));
        Main.wm.setKeybindingHandler('switch_windows_backward', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
        Main.wm.setKeybindingHandler('switch_group_backward', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
    }
};
