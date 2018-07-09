(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/start.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'start', __filename);
// Script/start.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        game_loading: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {

        var gameloading = this.game_loading.getComponent(cc.Animation);
        gameloading.play();
        cc.director.preloadScene('main');
    },

    //开始游戏
    startGame: function startGame() {
        cc.director.loadScene('main', function () {
            console.log('main is loaded');
        });
    }
    // called every frame
    //update: function (dt) {
    //},
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=start.js.map
        