"use strict";
cc._RF.push(module, '6afa0phF7dPka/zlZtFFHow', 'main');
// Script/main.js

'use strict';

cc.Class({

    extends: cc.Component,

    properties: function properties() {
        return {
            pause: cc.Button,
            progresspower: {
                default: null,
                type: cc.ProgressBar
            },
            bartime: 0,
            btnSprite: {
                default: [],
                type: cc.SpriteFrame,
                tooltip: '暂停按钮不同状态的图片'
            },
            bomb: cc.Node,
            gameMusic: {
                default: null,
                type: cc.AudioSource
            },
            useBombClip: cc.AudioClip,
            enemyGroup: {
                default: null,
                type: require('enemyGroup')
            },
            prefabenemyGroup: {
                default: null,
                type: require('prefabenemyGroup')
            },
            hero: {
                default: null,
                type: require('hero')
            },
            ufoGroup: {
                default: null,
                type: require('ufoGroup')
            },
            bulletGroup: {
                default: null,
                type: require('bulletGroup')
            },
            scoreDisplay: cc.Label,
            bombNoDisplay: cc.Label,

            close: cc.Button,
            select: cc.Node,
            select_bk: cc.Node
        };
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.onSelect_Hero(null, 1);
        this.close.node.on('click', function (event) {
            this.select.active = false;
            this.select_bk.active = false;
            this.close.node.active = false;
            this.beginGame();
        }, this);
        //this.beginGame();
    },

    //开始游戏
    beginGame: function beginGame() {
        var that = this; //this的值是随时变化的。
        this.hero.init();
        this.score = 0;
        this.progressnum = 0;
        this.bombNo = 0;
        this.deltatime = 0;
        this.testime = 0;
        this.bulletname = 'ufoBullet';
        this.progresspower.progress = this.progressnum;
        this.scoreDisplay.string = this.score;
        this.bombNoDisplay.string = this.bombNo;
        this.eState = D.commonInfo.gameState.start;
        this.starttouchpos = null;
        this.enemyIndex = 0;
        this.freqTimeIndex = 0;
        this.enemyGroup.startAction(this.enemyIndex, this.freqTimeIndex, false);
        this.bulletGroup.startAction();
        this.ufoGroup.startAction();
        //console.log('adfjalsdfjadfja;ldfkja;ldfkja;dklfja;sldfj');
        //this.prefabenemyGroup.startAction();
        this.bomb.on('touchstart', this.bombOnclick, this);
        // var changefreqTimeIndex ='callbackindex20';
        that.changefreqTimeIndex = function () {
            that.freqTimeIndex += 1;
            if (that.freqTimeIndex > 5) {
                that.enemyGroup.startAction(this.enemyIndex, this.freqTimeIndex, true);
                console.log(this.enemyIndex, this.freqTimeIndex);
            }
        }.bind(that);
        this.schedule(that.changefreqTimeIndex, 20);

        // var changeEnemyIndex = 'callbackindex120';
        this.changeEnemyIndex = function () {
            that.enemyIndex += 3;
            if (that.enemyIndex > 10) {
                that.enemyIndex = 9;
            }
            that.unschedule(that.changefreqTimeIndex);
            that.freqTimeIndex = 0;
            that.schedule(that.changefreqTimeIndex, 20);
            that.enemyGroup.startAction(this.enemyIndex, this.freqTimeIndex, true);
            console.log(this.enemyIndex, this.freqTimeIndex);
        }.bind(this);

        this.schedule(this.changeEnemyIndex, 120);
        this.gameMusic.play();
        // cc.audioEngine.playMusic("gema_music.mp3",true,1);
        //this.node.addChild(background);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchcallback = function (event) {
            that.starttouchpos = event.getLocation();
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.movecallback = function (event) {
            var touchpos = event.getLocation(); //获取触摸点坐标
            var dirsx = touchpos.x - that.starttouchpos.x; //获得移动向量x
            var dirsy = touchpos.y - that.starttouchpos.y; //获得向量y
            //var dirs = touchpos - that.starttouchpos;//???为什么不能直接做减法运算 
            if (that.hero.node != null) {
                var nodepos = that.hero.node.getPosition(); //获得上一个位置

                var setpos = cc.p(dirsx * 2 + nodepos.x, dirsy * 2 + nodepos.y);
                that.starttouchpos = touchpos;
                //需要取得node节点才能利用node节点下的默认方法 
                //var touchposconv =that.hero.node.parent.convertToNodeSpaceAR(touchpos);//将触摸点转化成父节点的节点坐标
                var minX = -that.node.width / 2;
                var maxX = -minX;
                var minY = -that.node.height / 2;
                var maxY = -minY;
                if (setpos.x < minX) {
                    setpos.x = minX;
                }
                if (setpos.x > maxX) {
                    setpos.x = maxX;
                }
                if (setpos.y < minY) {
                    setpos.y = minY;
                }
                if (setpos.y > maxY) {
                    setpos.y = maxY;
                }
                that.hero.node.setPosition(setpos);
            } //设置飞机的位置},this);//注意设置size}


            // var backgroundmusic = wx.getBackgroundAudioManager();
            // backgroundmusic.src = 'assets/sound/game_music.mp3';
            // backgroundmusic.play();
            //cc.audioEngine.playMusic('Resources/game_music.mp3',true);
            //    var listener = {//添加监听事件，屏幕触摸监听
            //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //     onTouchBegan: function (touches, event) {
            //         that.starttouchpos = touches.getLocation();

            //     return true; // 这里必须要写 return true
            //     },
            //     onTouchMoved: function (touches, event) {
            //         var touchpos = touches.getLocation();//获取触摸点坐标

            //         var dirsx = touchpos.x-that.starttouchpos.x;//获得移动向量x
            //         var dirsy = touchpos.y-that.starttouchpos.y;//获得向量y
            //        //var dirs = touchpos - that.starttouchpos;//???为什么不能直接做减法运算 
            //         var nodepos = that.hero.node.getPosition();//获得上一个位置

            //         var setpos = cc.p(dirsx*2+nodepos.x,dirsy*2+nodepos.y);
            //         that.starttouchpos = touchpos;
            //         //需要取得node节点才能利用node节点下的默认方法 
            //         //var touchposconv =that.hero.node.parent.convertToNodeSpaceAR(touchpos);//将触摸点转化成父节点的节点坐标
            //         var minX = -that.node.width/2;
            //         var maxX = -minX;
            //         var minY = -that.node.height/2;
            //         var maxY = -minY;
            //         if (setpos.x< minX){
            //             setpos.x = minX;
            //         }
            //         if (setpos.x>maxX){
            //             setpos.x = maxX;
            //         }
            //         if (setpos.y< minY){
            //             setpos.y = minY;
            //         }
            //         if (setpos.y> maxY){
            //             setpos.y = maxY;
            //         }
            //         that.hero.node.setPosition(setpos);//设置飞机的位置

            //     },
            //  }
            //     cc.eventManager.addListener(listener, this.node); 
        });
    },

    bombOnclick: function bombOnclick() {
        var bombNoLabel = this.bomb.getChildByName('bombNo').getComponent(cc.Label);
        var bombNo = parseInt(bombNoLabel.string);
        // console.log('bomboncklick on touch ');

        if (bombNo > 0) {
            bombNoLabel.string = bombNo - 1;
            this.removeEnemy();
            cc.audioEngine.playEffect(this.useBombClip, false);
        } else {
            console.log('没有子弹');
        }
    },
    // called every frame, uncomment this function to activate update callback
    //update: function (dt) {

    //},

    //暂停按钮点击事件  
    pauseClick: function pauseClick() {
        //暂停 继续

        if (this.eState == D.commonInfo.gameState.pause) {
            this.resumeAction();
            this.eState = D.commonInfo.gameState.start;
        } else if (this.eState == D.commonInfo.gameState.start) {
            this.pauseAction();
            this.eState = D.commonInfo.gameState.pause;
        }
    },
    //游戏继续
    resumeAction: function resumeAction() {
        this.enemyGroup.resumeAction();
        this.bulletGroup.resumeAction();
        this.ufoGroup.resumeAction();
        this.hero.onDrag();
        this.gameMusic.resume();
        this.pause.normalSprite = this.btnSprite[0];
        this.pause.pressedSprite = this.btnSprite[1];
        this.pause.hoverSprite = this.btnSprite[1];
    },
    //游戏暂停
    pauseAction: function pauseAction() {
        this.enemyGroup.pauseAction();
        this.bulletGroup.pauseAction();
        this.hero.offDrag();
        this.gameMusic.pause();
        this.ufoGroup.pauseAction();
        this.pause.normalSprite = this.btnSprite[2];
        this.pause.pressedSprite = this.btnSprite[3];
        this.pause.hoverSprite = this.btnSprite[3];
    },
    //增加分数
    gainScore: function gainScore(scoreno) {
        this.score += scoreno;
        //更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = this.score.toString();
    },
    //get分数
    getScore: function getScore() {
        return parseInt(this.scoreDisplay.string);
    },
    setPowerProgressBar: function setPowerProgressBar(per) {
        //  console.log(this.progressnum);
        if (per > 5) {
            per = 5;
        }
        this.progresspower.progress = per * 0.2;
    },
    //分数写到本地（ 当前分 最高分 历史记录）
    update: function update(delta) {
        this.deltatime += delta;
        this.testime += delta;
        // console.log('time++++++++;',this.testime);
        if (this.deltatime >= 10) {
            this.progressnum -= 1;
            //  console.log('this.deltatime progressnum  :  ' +this.deltatime,this.progressnum);
            this.deltatime = 0;

            if (this.progressnum <= 0) {
                this.progressnum = 0;
            }
            this.bulletGroup.changeBullet(this.bulletname, this.progressnum);
        }
        // console.log('progressnum= '+this.progressnum);
        this.progresspower.progress -= delta * 0.02;
        if (this.progresspower.progress < 0) {
            this.progresspower.progress = 0;
        }
    },
    updateScore: function updateScore() {
        var currentScore = this.scoreDisplay.string;
        var scoreData = {
            'score': currentScore,
            'time': D.common.timeFmt(new Date(), 'yyyy-MM-dd hh:mm:ss')
        };
        var preData = cc.sys.localStorage.getItem('score');
        var preTopScore = cc.sys.localStorage.getItem('topScore');
        if (!preTopScore || parseInt(preTopScore) < parseInt(currentScore)) {
            cc.sys.localStorage.setItem('topScore', currentScore);
        }
        if (!preData) {
            preData = [];
            preData.unshift(scoreData);
        } else {
            preData = JSON.parse(preData);
            if (!(preData instanceof Array)) {
                preData = [];
            }
            preData.unshift(scoreData);
        }
        cc.sys.localStorage.setItem('currentScore', currentScore);
        cc.sys.localStorage.setItem('score', JSON.stringify(preData));
    },
    //炸弹清除敌机
    removeEnemy: function removeEnemy() {
        this.enemyGroup.killAllEnemy();
    },
    //接到炸弹
    getUfoBomb: function getUfoBomb() {
        if (parseInt(this.bombNoDisplay.string) < 3) {
            //多于三个炸弹就不累加
            this.bombNoDisplay.string += 1;
        }
    },
    //游戏结束
    gameOver: function gameOver() {
        this.pauseAction();
        this.updateScore();
        // this.gameMusic.stop();
        // this.node.off(cc.node.EventType.TOUCH_START,this.touchcallback,this.node);
        // this.node.off(cc.node.EventType.TOUCH_MOVE,this.movecallback,this.node);
        cc.director.loadScene('end');
    },
    onExit: function onExit() {

        this.gameMusic.stop();
        this.unschedule(this.setProgressCallBack);
    },

    onSelect_Hero: function onSelect_Hero(event, customEventData) {
        var index = customEventData;
        if (index < 1 || index > 7) {
            return false;
        }
        cc.log("onSelect_Hero");
        var node = this.select_bk.getChildByName("select_pic");
        var target_node = this.select_bk.getChildByName("select_hero" + index);
        if (!node) {
            cc.log("error select_pic");
            return false;
        }
        if (!target_node) {
            cc.log("error select_hero_");
            return false;
        }
        var pos = target_node.getPosition();
        pos.y = pos.y - 10;
        node.setPosition(pos);

        var curHeroNode = this.select_bk.getChildByName("cur_hero");
        curHeroNode.getComponent(cc.Sprite).spriteFrame = null;

        cc.loader.loadRes("Texture/hero" + index, cc.SpriteFrame, function (err, spriteFrame) {
            curHeroNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });

        D.commonInfo.hero_index = index;
    },

    onUnlock_Hero: function onUnlock_Hero(event) {
        var index = D.commonInfo.hero_index;
        if (index < 1 || index > 7) {
            return false;
        }
        var target_node = this.select_bk.getChildByName("select_hero" + index);
        target_node.getChildByName("mask").active = false;
        target_node.getChildByName("lock").active = false;
    },

    onSkillMaxBigen: function onSkillMaxBigen(event) {
        this.select.active = false;
        this.select_bk.active = false;
        this.close.node.active = false;
        this.beginGame();
        this.progressnum = 5;
        this.bulletGroup.changeBullet(this.bulletname, this.progressnum);
        this.setPowerProgressBar(this.progressnum);
    }
});

cc._RF.pop();