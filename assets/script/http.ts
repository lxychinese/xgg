
const { ccclass, property } = cc._decorator;


const url = "https://open-pay.996a.com";
export default class http {

    /**

    * 请求协议的方法

    * @param path 请求接口的路径

    * @param params 参数

    * @param callBack 回调函数

    */

    static get(path, params, callBack) {

        var requestUrl = url + path;

        var xhr = cc.loader.getXMLHttpRequest();

        // var data=self.paramData(params);

        var data = params;

        let param = '?';
        let index = 0;

        for (var key in data) {

            var paramStr = key + "=" + data[key];

            if (param == "") {

                param += paramStr;

            } else {
                if (index == 0) {
                    param += paramStr;
                } else {
                    param += "&" + paramStr;
                }

                param += "&" + paramStr;

            }
            index++

        }

        xhr.open("GET", requestUrl + param);

        xhr.timeout = 5000;//

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        xhr.onreadystatechange = function () {

            if (xhr.readyState === 4 && xhr.status == 200) {

                var respone = xhr.responseText;

                console.log('响应参数')

                console.log(respone)

                callBack(JSON.parse(respone));

            }

        };

        xhr.send();

    }

}
