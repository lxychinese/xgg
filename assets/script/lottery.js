cc.Class({
    extends: cc.Component,

    properties: {
      node_zhuanPan:{
          type:cc.Node,
          default:null
      }
    },

    onLoad () {
        console.log("wx:cocoscreator_666");
        console.log("qq:2504549300");
        this.arrJiangPin = ['谢谢参与','10元话费','雨伞','富光水杯','小爱同学','旅游背包','oppo手机','体重秤','现金红包','房卡','手机支架','充电宝']
      
        this.arrJiLv = [30,40,50,60,65,75,76,81,91,96,98,100]
    },

    //按钮的回调
    btnCallBack:function(sender,str){
        if (str == "btn_dianJi") {
            console.log("点击了按钮");

            var i_zhongJian = this.getNumRand()
            console.log("抽中的是："+i_zhongJian+' 奖品是：'+this.arrJiangPin[i_zhongJian]);
            this.actZhuanPan(i_zhongJian);
        }
    },

    //转盘旋转
    actZhuanPan:function(i_jp){

        var f_angle = this.node_zhuanPan.angle;

        while (true) {
            if(f_angle < -360){
                f_angle = f_angle + 360
            }else if(f_angle >= 0){
                f_angle = f_angle - 360
            }else{
                break;
            }
        }

        this.node_zhuanPan.angle = f_angle

        var f_jd = 360+f_angle + i_jp*30;
        if (f_jd < 360) {
            f_jd = f_jd + 360;
        }

        var f_time = f_jd / 200.0;

        var act_1 = cc.rotateBy(2,360*4).easing(cc.easeCubicActionIn())//由慢到快
        var act_2 = cc.rotateBy(f_time,f_jd).easing(cc.easeCubicActionOut())//由快到慢
        var act_3 = cc.sequence(act_1,act_2)
        this.node_zhuanPan.runAction(act_3);
    },

    getNumRand:function(){//根据概率 返回抽奖的角标

        var i_rand = Math.random() * 100 //0-100

        if (i_rand < this.arrJiLv[0]) {
            i_rand = 0;
        }else  if (i_rand < this.arrJiLv[1]) {
            i_rand = 1;
        }else  if (i_rand < this.arrJiLv[2]) {
            i_rand = 2;
        }else  if (i_rand < this.arrJiLv[3]) {
            i_rand = 3;
        }else  if (i_rand < this.arrJiLv[4]) {
            i_rand = 4;
        }else  if (i_rand < this.arrJiLv[5]) {
            i_rand = 5;
        }else  if (i_rand < this.arrJiLv[6]) {
            i_rand = 6;
        }else  if (i_rand < this.arrJiLv[7]) {
            i_rand = 7;
        }else  if (i_rand < this.arrJiLv[8]) {
            i_rand = 8;
        }else  if (i_rand < this.arrJiLv[9]) {
            i_rand = 9;
        }else  if (i_rand < this.arrJiLv[10]) {
            i_rand = 10;
        }else  if (i_rand < this.arrJiLv[11]) {
            i_rand = 11;
        }else{
            i_rand = 0
        }

        return i_rand
    },

    start () {
        console.log("start");
    },

    update (dt) {//1秒执行60次
        //console.log("update："+dt);
    },
});
