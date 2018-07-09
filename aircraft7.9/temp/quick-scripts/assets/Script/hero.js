(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hero.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3f0ccHUefxOLK9+K5/zp2v4', 'hero', __filename);
// Script/hero.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: function properties() {
        return {

            hero_animation: {
                default: null,
                type: cc.Animation,
                tooltip: '动画'
            },

            gameOverClip: cc.AudioClip,
            main: {
                default: null,
                type: require('main')
            },
            bulletGroup: {
                default: null,
                type: require('bulletGroup')
            }
        };
    },

    // use this for initialization
    onLoad: function onLoad() {
        //this.init();
    },

    init: function init() {
        this.eState = D.commonInfo.gameState.none;

        if (!D.commonInfo.hero_index) {
            cc.log("error:not hero_index");
            return false;
        }

        var index = D.commonInfo.hero_index;

        //正常情况下应该无资源,根据hero_index来初始化
        var res = "prefab/hero" + String(index);
        var animation_name = "hero" + String(index) + "_stand";
        var self = this;
        cc.loader.loadRes(res, function (err, prefab) {
            var stand = cc.instantiate(prefab);
            self.node.addChild(stand);
            self.hero_animation = stand.getComponent(cc.Animation);
            self.hero_animation.play(animation_name);
        });

        var hero_Colliders = this.getComponents(cc.Collider);
        for (var loop = 0; loop < hero_Colliders.length; ++loop) {
            if (loop + 1 == index) {
                hero_Colliders[loop].enabled = true;
            } else {
                hero_Colliders[loop].enabled = false;
            }
        }
        this.onDrag();
    },

    //添加拖动监听
    onDrag: function onDrag() {
        this.node.on('touchmove', this.dragMove, this);
    },
    //去掉拖动监听
    offDrag: function offDrag() {
        this.node.off('touchmove', this.dragMove, this);
    },
    //拖动
    dragMove: function dragMove(event) {
        if (this.isDead()) {
            return false;
        }
        var locationv = event.getLocation();
        var location = this.node.parent.convertToNodeSpaceAR(locationv);
        //飞机不移出屏幕 
        var minX = -this.node.parent.width / 2 + this.node.width / 2;
        var maxX = -minX;
        var minY = -this.node.parent.height / 2 + this.node.height / 2;
        var maxY = -minY;
        if (location.x < minX) {
            location.x = minX;
        }
        if (location.x > maxX) {
            location.x = maxX;
        }
        if (location.y < minY) {
            location.y = minY;
        }
        if (location.y > maxY) {
            location.y = maxY;
        }
        this.node.setPosition(location);
    },
    //碰撞监测
    onCollisionEnter: function onCollisionEnter(other, self) {
        if (self.tag != D.commonInfo.hero_index) {
            return false;
        }

        if (this.isDead()) {
            return false;
        }

        if (other.node.group == 'ufo') {
            if (other.node.name == 'ufoBullet') {
                this.main.bulletname = 'ufoBullet';
                this.main.deltatime = 0;
                if (this.main.progressnum < 5) {
                    this.main.progressnum += 1;
                };
                this.main.setPowerProgressBar(this.main.progressnum);
                this.bulletGroup.changeBullet(other.node.name, this.main.progressnum);
            } else if (other.node.name == 'ufoBomb') {
                this.main.getUfoBomb();
            }
        } else if (other.node.group == 'enemy') {
            //播放动画
            var animation_name = "hero" + String(D.commonInfo.hero_index) + "_blowup";
            this.hero_animation.play(animation_name);
            this.hero_animation.on('finished', this.onFinished, this);
            //播放音效
            cc.audioEngine.playEffect(this.gameOverClip, false);
            //停止子弹
            this.bulletGroup.bulletStop();
        } else {
            return false;
        }
    },

    isDead: function isDead() {
        var animation_name = "hero" + String(D.commonInfo.hero_index) + "_blowup";
        var animState = this.hero_animation.getAnimationState(animation_name);
        if (animState) {
            if (animState.isPlaying) {
                return true;
            }
        }
        return false;
    },

    onFinished: function onFinished() {
        //动画结束后
        //清除节点
        this.node.destroy();
        //更新分数 
        this.main.gameOver();
        //
        this.destroy();
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
        //# sourceMappingURL=hero.js.map
        