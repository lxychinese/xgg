
import game from "./game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class block extends cc.Component {

    block_type: number = 0
    can_pz: boolean = true
    i_over: number = 0
    is_pz: boolean = false
    is_chuiZi: boolean = false

    init(i_type) {
        this.block_type = i_type
        this.can_pz = true //是否可以碰撞
        this.is_pz = false //是否发生过碰撞
        if (i_type >= 11) {
            this.can_pz = false //是否可以碰撞
        }
        this.i_over = 0
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.tag != 11) {
            this.is_pz = true
        }

        var js_otherBlock = otherCollider.node.getComponent('block')
        if (js_otherBlock && this.can_pz) {
            if (this.block_type == js_otherBlock.block_type) {
                this.can_pz = false
                js_otherBlock.can_pz = false

                var pos_self = this.node.getPosition()
                var pos_other = otherCollider.node.getPosition()
                var pos_min = pos_self
                if (pos_min.y > pos_other.y) {
                    pos_min = pos_other
                }

                this.node.removeFromParent()
                otherCollider.node.removeFromParent()
                if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                    wx.vibrateShort({})
                }

                game.Instance.playSound()

                {
                    var block_wh = this.node.width
                    game.Instance.createTx(this.block_type, pos_self, block_wh)
                    game.Instance.createTx(this.block_type, pos_other, block_wh)
                }

                if (!game.Instance.is_over) {
                    if(this.block_type==10){
                        game.Instance.addScore(100)
                    }
                    game.Instance.addScore(this.block_type)
                }


                this.scheduleOnce(function () {
                    game.Instance.createBlock(this.block_type + 1, pos_min, true)
                }.bind(this), 0.15);


            }
        }

    }
    chuiZi() {
        this.is_chuiZi = true
    }
    quXiaoChuiZi(){
        this.is_chuiZi=false
    }

    update(dt) {
        if (game.Instance.is_over) {
            return
        }
        var y_gao = this.node.y + this.node.height * game.Instance.f_scale / 2
        if (y_gao > game.Instance.node_xian.y) {
            this.i_over++
            if (this.i_over > 120) {
                game.Instance.gameOver()
            }
        } else {
            this.i_over = 0
        }
    }
}
