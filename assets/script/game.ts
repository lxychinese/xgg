const { ccclass, property } = cc._decorator;
import http from './http'
@ccclass
export default class game extends cc.Component {
    public static Instance: game = null;

    block_type: number = 0
    block_random: number = 1
    refresh_num:number=3
    f_scale: number = 0.75
    score_curr: number = 0
    can_pz: boolean = true
    f_xian: number = 300
    is_over: boolean = false

    @property(cc.Node)
    block_show: cc.Node = null
    @property(cc.Prefab)
    pre_tx: cc.Prefab = null

    @property(cc.Label)
    label_score: cc.Label = null


    @property(Array(cc.Prefab))
    block_arr: Array<cc.Prefab> = []
    @property(Array(cc.Node))
    node_xian: cc.Node = null

    @property(cc.Node)
    layerOver: cc.Node = null

    @property(cc.Node)
    subView: cc.Node = null

    @property(cc.AudioClip)
    audoi_pz: cc.AudioClip = null

    @property(cc.Label)
    refresh_count: cc.Label = null


    rank() {

        this.subView.active = true
        this.subView.zIndex = 9
        cc.find("Canvas").getChildByName("bg").active = false;
        cc.find("Canvas").getChildByName("block_show").active = false;
        cc.find("Canvas").getChildByName("label_score").active = false;
        cc.find("Canvas").getChildByName("btns").active = false;
        cc.find("Canvas").getChildByName("node_qiang").active = false;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "xgrank"
            })
        }

        this.hideAllBlocks()

    }


    hide() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                messageType: 0
               
            });
        }
        this.subView.active = false
        cc.find("Canvas").getChildByName("bg").active = true;
        cc.find("Canvas").getChildByName("block_show").active = true;
        cc.find("Canvas").getChildByName("label_score").active = true;
        cc.find("Canvas").getChildByName("btns").active = true;
        cc.find("Canvas").getChildByName("node_qiang").active = true;
        this.showAllBlocks()

    }

    login() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.showShareMenu({
                menus: ['shareAppMessage', 'shareTimeline'],
                success(res) {
                    console.log(res)
                },
                fail(e) {
                    console.log(e)
                }
            })

            wx.login({
                success: (res) => {
                    if (res.code) {
                        http.get("/api/wx/openId", { 'code': res.code }, (res) => {

                            wx.setStorageSync('openid', res.openid);

                        })

                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                },
            })
        }

    }
    share(){
        wx.shareAppMessage({
            title: "合成大西瓜",
            imageUrl: 'http://liuxiaoyang.cn/xg3.png'
        })
    }

    onLoad() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {

            wx.onShareAppMessage(() => {
                return {
                    title: "合成大西瓜",
                    imageUrl: 'http://liuxiaoyang.996a.com/xg3.png'
                }
            })
            wx.onShareTimeline(() => {
                return {
                    title: '合成大西瓜',
                    imageUrl: 'http://liuxiaoyang.996a.com/xg3.png'
                }
            })
        }
       

        this.login()
        if (game.Instance === null) {
            game.Instance = this;
        }
        else {
            this.destroy();
            return;
        }
        this.init()
        this.setTouch()
        cc.director.getPhysicsManager().enabled = true;
    }

    init() {
        this.block_show.active = false
        this.node_xian.active = false
        this.layerOver.active = false
        this.layerOver.zIndex = 9
        this.refresh_num=3
        this.refresh_count.string=this.refresh_num+""
        this.f_scale = 0.75
        this.block_show.scale = this.f_scale

        this.score_curr = 0 //当前分数
        this.f_xian = 300 //警戒线显示的高度
        this.is_over = false

        this.label_score.string = this.score_curr + ""
        this.block_random = 1
        this.showBlock()
        this.cleanAllBlocks()
    }

    playSound() {
        cc.audioEngine.play(this.audoi_pz, false, 1)
    }

    //屏幕触摸
    setTouch() {
        // 使用事件名来注册
        this.node.on('touchstart', function (event) {

            if (this.block_show.active == false || this.is_over) {
                return
            }
            var pos_touch = event.getLocation()
            pos_touch = this.node.convertToNodeSpaceAR(pos_touch);
            this.block_show.x = pos_touch.x
        }, this);
        this.node.on('touchmove', function (event) {
            if (this.block_show.active == false || this.is_over) {
                return
            }
            var pos_touch = event.getLocation()
            pos_touch = this.node.convertToNodeSpaceAR(pos_touch);
            this.block_show.x = pos_touch.x
        }, this);
        this.node.on('touchend', function (event) {
            if (this.block_show.active == false || this.is_over) {
                return
            }
            this.block_show.active = false
            var pos_blockShow = this.block_show.getPosition()
            this.createBlock(this.block_random, pos_blockShow, false)
            this.block_random = Math.floor(Math.random() * 5) + 1 // 1-5
            this.scheduleOnce(function () {
                this.showBlock()
            }.bind(this), 1);

        }, this);
        this.node.on('touchcancel', function (event) {
            if (this.block_show.active == false || this.is_over) {
                return
            }
            this.block_show.active = false
            var pos_blockShow = this.block_show.getPosition()
            this.createBlock(this.block_random, pos_blockShow, false)
            //this.createBlock(10,pos_touch)
            this.block_random = Math.floor(Math.random() * 5) + 1 // 1-5

            this.scheduleOnce(function () {
                this.showBlock()
            }.bind(this), 1);
        }, this);
    }

    //显示生成的元素块
    showBlock() {
        this.block_show.active = true
        this.block_show.setPosition(cc.v2(0, 530))

        var children = this.block_show.children
        for (let i = 0; i < children.length; i++) {
            if (children[i].name == this.block_random + "") {
                children[i].active = true
            } else {
                children[i].active = false
            }
        }

        this.block_show.scale = 0
        var act_1 = cc.scaleTo(0.15, this.f_scale)
        this.block_show.runAction(act_1)
    }

    //创建元素块
    createBlock(i_type, pos_touch, can_scale) {
        var node_block = cc.instantiate(this.block_arr[i_type])//实例化
        node_block.parent = this.node
        node_block.scale = this.f_scale
        node_block.setPosition(pos_touch)
        var js_block = node_block.getComponent('block')
        js_block.init(i_type)

        if (can_scale) {
            node_block.scale = 0.3
            var act_1 = cc.scaleTo(0.12, this.f_scale)
            node_block.runAction(act_1)
        }
       
    }

    //创建爆炸特效
    createTx(i_type, pos_block, block_wh) {
        var node_tx = cc.instantiate(this.pre_tx)//实例化
        node_tx.parent = this.node
        node_tx.scale = 0
        node_tx.zIndex = 3
        node_tx.width = block_wh
        node_tx.height = block_wh
        node_tx.setPosition(pos_block)

        if (i_type == 1) {
            node_tx.color = new cc.Color(110, 16, 100);
        } else if (i_type == 2) {
            node_tx.color = new cc.Color(255, 9, 36);
        } else if (i_type == 3) {
            node_tx.color = new cc.Color(253, 111, 1);
        } else if (i_type == 4) {
            node_tx.color = new cc.Color(255, 230, 23);
        } else if (i_type == 5) {
            node_tx.color = new cc.Color(93, 222, 31);
        } else if (i_type == 6) {
            node_tx.color = new cc.Color(229, 25, 50);
        } else if (i_type == 7) {
            node_tx.color = new cc.Color(245, 159, 98);
        } else if (i_type == 8) {
            node_tx.color = new cc.Color(255, 225, 69);
        } else if (i_type == 9) {
            node_tx.color = new cc.Color(205, 201, 189);
        } else if (i_type == 10) {
            node_tx.color = new cc.Color(248, 64, 100);
        }

        var act_1 = cc.scaleTo(0.16, 1)
        var act_2 = cc.callFunc(function () {
            node_tx.removeFromParent()
        })
        var end = cc.sequence(act_1, act_2)
        node_tx.runAction(end)

    }
    //增加分数
    addScore(i_score) {
        this.score_curr = this.score_curr + i_score
        this.label_score.string = this.score_curr + ""
    }

    //显示警戒线
    showXian() {
        var can_show = false
        var children = this.node.children
        for (let i = 0; i < children.length; i++) {
            var js_block = children[i].getComponent('block')
            if (js_block && js_block.is_pz) {
                var y_block = children[i].y
                var y_gao = y_block + children[i].height / 2 * this.f_scale
                if (y_gao > this.f_xian) {
                    can_show = true
                    break
                }
            }
        }

        if (can_show) {
            this.node_xian.active = true
        } else {
            this.node_xian.active = false
        }
    }

    //游戏结束
    gameOver() {
        this.node_xian.active = false
        this.block_show.active = false
        var f_timeLong = 0
        this.is_over = true
        var children = this.node.children
        for (let i = 0; i < children.length; i++) {
            var js_block = children[i].getComponent('block')
            if (js_block != null) {
                var f_time = 0.1 + 0.025 * i
                if (f_timeLong < f_time) {
                    f_timeLong = f_time
                }
                var act_1 = cc.delayTime(f_time)
                var act_2 = cc.callFunc(function () {
                    var js_block = children[i].getComponent('block')
                    if (js_block != null) {
                        var block_type = js_block.block_type
                        var pos_block = children[i].getPosition()
                        var block_wh = children[i].width
                        this.createTx(block_type, pos_block, block_wh)
                        //this.addScore(block_type)
                        children[i].active = false
                    } else {
                        console.log('have block null', i)
                    }

                }, this)
                var end = cc.sequence(act_1, act_2)
                children[i].runAction(end)
            }
        }


        this.scheduleOnce(function () {

            this.layerOver.getChildByName('label_score').getComponent(cc.Label).string = this.score_curr + ""
            this.saveScore()
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {

                wx.postMessage({
                    messageType: 3,
                    MAIN_MENU_NUM: "xgrank",
                    score: this.score_curr
                });
            }

        }, f_timeLong + 0.1)

    }

    saveScore() {
        let openid = ""
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            openid = wx.getStorageSync('openid');
        }


        http.get("/api/wx/score", { 'openid': openid, 'score': this.score_curr }, (res) => {
            console.log('res', res)

            this.layerOver.getChildByName('label_bestScore').getComponent(cc.Label).string = res
            this.layerOver.active = true

        })
    }
    btnCallBack() {

        this.init()

    }
    again(){
       
        this.subView.active = false
        this.init()
    }


    refresh() {
    
        
        console.log(this.refresh_num,'refresh_num')
       
        if(this.refresh_num<=0){
            return 
        } 
        var children = this.node.children
        for (let i = children.length - 1; i >= 0; i--) {

            var js_block = children[i].getComponent('block')
            if (js_block) {
                console.log(children[i].getPosition())
                var act_1 = cc.scaleTo(0.2, 0)
                var act_2 = cc.callFunc(function () {
                    var num_random = Math.floor(Math.random() * children.length)
                    var pos_block_1 = children[i].getPosition()
                    // pos_block_1= this.node.convertToWorldSpaceAR(pos_block_1);
                    var pos_block_2 = null
                    if (children[num_random].getComponent('block')) {
                        pos_block_2 = children[num_random].getPosition()
                    }


                    children[i].setPosition(pos_block_2)
                    children[num_random].setPosition(pos_block_1)
                })
                var act_3 = cc.scaleTo(0.2, this.f_scale)
                var end = cc.sequence(act_1, act_2, act_3)
                children[i].runAction(end)
            }
        }
        console.log(this.refresh_num,'rr')

        var ns = this.refresh_num-1
        console.log(ns,'ns')
      
        this.refresh_count.string=ns+""
        this.refresh_num--
    }


    //清空所有的元素块
    cleanAllBlocks() {
        var children = this.node.children
        for (let i = children.length - 1; i >= 0; i--) {
            var js_block = children[i].getComponent('block')
            if (js_block) {
                children[i].removeFromParent()
            }
        }
    }


    //清空所有的元素块
    hideAllBlocks() {
        var children = this.node.children
        this.block_show.active=false
        for (let i = children.length - 1; i >= 0; i--) {
            var js_block = children[i].getComponent('block')
            if (js_block) {
                children[i].active = false
            }
        }
    }


    getAllBlockCount() {
        let count: number = 0
        var children = this.node.children
        for (let i = children.length - 1; i >= 0; i--) {
            var js_block = children[i].getComponent('block')
            if (js_block) {
                count++
            }
        }
        return count

    }
    //清空所有的元素块
    showAllBlocks() {
        var children = this.node.children
        for (let i = children.length - 1; i >= 0; i--) {
            var js_block = children[i].getComponent('block')
            if (js_block) {
                children[i].active = true
            }
        }
    }

    update(dt) {
        this.showXian()
    }

}