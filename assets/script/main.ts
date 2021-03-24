const {ccclass, property} = cc._decorator;
import http from './http'
@ccclass
export default class NewClass extends cc.Component {




    start () {

    }

    startGame(){

        http.get("/api/wx/status", { }, (res) => {
            console.log('status',res)
            if(res==1){
                cc.director.loadScene("lottery");
            }else{
                cc.director.loadScene("xg");
            }


           
          
        })



       
    }

    // update (dt) {}
}
