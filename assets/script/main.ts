const { ccclass, property } = cc._decorator;
import http from './http'
@ccclass
export default class NewClass extends cc.Component {

    onLoad() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {

            wx.onShareAppMessage(() => {
                return {
                    title: "合成大西瓜",
                    imageUrl: 'http://liuxiaoyang.cn/xg3.png'
                }
            })
            wx.onShareTimeline(() => {
                return {
                    title: '合成大西瓜',
                    imageUrl: 'http://liuxiaoyang.cn/xg3.png'
                }
            })
        }
    }

    startGame() {
        http.get("/api/wx/status", {}, (res) => {
            console.log('status', res)
            if (res == 1) {
                cc.director.loadScene("lottery");
            } else {
                cc.director.loadScene("xg");
            }
        })
    }

    // update (dt) {}
}
