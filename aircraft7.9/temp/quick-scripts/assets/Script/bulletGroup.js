(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/bulletGroup.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3d2d93zegRMeaoaPHxucDMn', 'bulletGroup', __filename);
// Script/bulletGroup.js

'use strict';

//子弹生成位置
var bPosition = cc.Class({
    name: 'bPosition',
    properties: {
        xAxis: {
            default: '',
            tooltip: '初始x轴，相对hero'
        },
        yAxis: {
            default: '',
            tooltip: '初始y轴，相对hero'
        }
    }
});

//不限时长子弹
var bulletInfinite = cc.Class({
    name: 'bulletInfinite',
    properties: {
        name: '',
        freqTime: 0,
        initPollCount: 0,
        prefab: cc.Prefab,
        position: {
            default: [],
            type: bPosition,
            tooltip: '每次多少排子弹'
        }
    }
});

//有限时长子弹组
var bulletFiniteG = cc.Class({
    name: 'bulletFiniteG',
    extends: bulletInfinite,
    properties: {
        finiteTime: 0,
        orginName: ''
    }
});

cc.Class({
    extends: cc.Component,

    properties: function properties() {
        return {
            bulletInfinite: {
                default: null,
                type: bulletInfinite,
                tooltip: '单束子弹组'
            },
            bulletFiniteG: {
                default: [],
                type: bulletFiniteG,
                tooltip: '双束子弹组'
            },
            hero: cc.Node
        };
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.eState = D.commonInfo.gameState.none;
        //初始化无限子弹组
        D.common.initObjPool(this, this.bulletInfinite);
        //初始化🈶️限子弹组
        D.common.batchInitObjPool(this, this.bulletFiniteG);
    },

    startAction: function startAction() {
        this.eState = D.commonInfo.gameState.start;
        //生成子弹
        this.getNewbullet(this.bulletInfinite);
        this.bICallback = function () {
            this.getNewbullet(this.bulletInfinite);
        }.bind(this);
        this.schedule(this.bICallback, this.bulletInfinite.freqTime);
    },
    pauseAction: function pauseAction() {
        this.enabled = false;
        this.eState = D.commonInfo.gameState.pause;
    },
    resumeAction: function resumeAction() {
        this.enabled = true;
        this.eState = D.commonInfo.gameState.start;
    },
    //换子弹
    changeBullet: function changeBullet(ufoBulletName, index) {
        this.unschedule(this.bICallback);
        this.unschedule(this.bFCallback);
        // console.log('ufobulletname:'+ufoBulletName,index);
        // for (var bi=0; bi<this.bulletFiniteG.length; bi++){
        if (index > 0) {
            var bindex = index - 1;
            if (this.bulletFiniteG[bindex].orginName == ufoBulletName) {
                this.bFCallback = function (e) {
                    this.getNewbullet(this.bulletFiniteG[e]);
                }.bind(this, bindex);
                this.schedule(this.bFCallback, this.bulletFiniteG[bindex].freqTime, cc.macro.REPEAT_FOREVER, 0.2);
                // var delay = this.bulletFiniteG[bi].freqTime * this.bulletFiniteG[bi].finiteTime;
                // this.schedule(this.bICallback,this.bulletInfinite.freqTime,cc.macro.REPEAT_FOREVER,delay);
            }
        } else {
            this.schedule(this.bICallback, this.bulletInfinite.freqTime, cc.macro.REPEAT_FOREVER, 0.2);
        }
        // }
    },
    //生成子弹
    getNewbullet: function getNewbullet(bulletInfo) {
        var poolName = bulletInfo.name + 'Pool';
        for (var bc = 0; bc < bulletInfo.position.length; bc++) {
            var newNode = D.common.genNewNode(this[poolName], bulletInfo.prefab, this.node);
            var newV2 = this.getBulletPostion(bulletInfo.position[bc]);
            newNode.setPosition(newV2);
            newNode.getComponent('bullet').bulletGroup = this;
        }
    },
    //获取子弹位置
    getBulletPostion: function getBulletPostion(posInfo) {
        var hPos = this.hero.getPosition();
        var newV2_x = hPos.x + parseInt(posInfo.xAxis);
        var newV2_y = hPos.y + parseInt(posInfo.yAxis);
        return cc.p(newV2_x, newV2_y);
    },

    //子弹灭亡
    bulletDied: function bulletDied(nodeinfo) {
        // console.log('1111111111111111111');
        D.common.backObjPool(this, nodeinfo);
    },

    //停止子弹
    bulletStop: function bulletStop() {
        this.unschedule(this.bICallback);
        this.unschedule(this.bFCallback);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
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
        //# sourceMappingURL=bulletGroup.js.map
        