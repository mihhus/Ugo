//Firebaseの設定
var firebase = require('firebase');
var request = require('request');
var fs = require('fs');


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAdOHAsXiiFqIz-uGE7X7AMOJx56Wtm-Sw",
    authDomain: "prj-ugo.firebaseapp.com",
    databaseURL: "https://prj-ugo.firebaseio.com",
    projectId: "prj-ugo",
    storageBucket: "prj-ugo.appspot.com",
    messagingSenderId: "269311604591",
    appId: "1:269311604591:web:7f843f566826825f"
};
firebase.initializeApp(firebaseConfig);

//センシングとモーター
fs.writeFileSync('/sys/class/gpio/export', 17);
fs.writeFileSync('/sys/class/gpio/gpio17/direction', 'in');
fs.writeFileSync('/sys/class/gpio/export', 24);
fs.writeFileSync('/sys/class/gpio/gpio24/direction', 'out');

//センサ監視
/*
fs.watch("/sys/class/gpio/gpio17/value", {persistent:true, recursive:false}, (eventType, filename)=>{
    if(fs.readFileSync('/sys/class/gpio/17/value') == 1){
        var dataString = `{"isClose": "1"}`;
        var firebase_options = {
            url: 'https://prj-ugo.firebaseio.com/device/sensor.json',
            method: 'PUT',
            body: dataString
        };
        request.put(firebase_options, function(error, response, body){});
    }
    else{
        var dataString = `{"isClose": "0"}`;
        var firebase_options = {
            url: 'https://prj-ugo.firebaseio.com/device/sensor.json',
            method: 'PUT',
            body: dataString
        };
        request.put(firebase_options, function(error, response, body){});
    }
});
*/

//GoogleHome→ Firebaseに関する記述
var googlehomeref = firebase.database().ref('/device/googlehome');

googlehomeref.on('value', function(snapshot){
    var key = snapshot.key;
    var command = snapshot.val();
    //GoogleHomeから入力があった場合入力に応じてフラグを変更する
    if(command.order !== '') {
        switch(true) {
            case /あけ.*て|上げ.*て|開け.*て/.test(command.order):
                var dataString = `{"isClose": "0", "order": "", "timestamp": "${get_date()}"}`;
                var firebase_options = {
                    url: 'https://prj-ugo.firebaseio.com/device/googlehome.json',
                    method: 'PUT',
                    body: dataString
                };
                request.put(firebase_options, function(error, response, body){});
                break;
            case /閉め.*て|落とし.*て|下ろし.*て/.test(command.order):
                var dataString = `{"isClose": "1", "order": "", "timestamp": "${get_date()}"}`;
                var firebase_options = {
                    url: 'https://prj-ugo.firebaseio.com/device/googlehome.json',
                    method: 'PUT',
                    body: dataString
                };
                request.put(firebase_options, function(error, response, body){});
                break;
            }
    }

});



//各フラグを処理するステートマシン
var rootref = firebase.database().ref();

rootref.on('value', function(snapshot){
    var doClose = setTimeout(function() {
        fs.writeFileSync('/sys/class/gpio/gpio24/value', 0);
    }, 1000 * 30);
    var doOpen = setTimeout(function() {
        fs.writeFileSync('/sys/class/gpio/gpio24/value', 1);
    }, 1000 * 3);
    var key = snapshot.key;
    var command = snapshot.val();
    var googlehomeClose = command.device.googlehome.isClose;
    var smartphoneClose = command.device.smartphone.isClose;
    var weatherAPIClose = command.device.weatherAPI.isClose;
    var sensorClose = command.device.sensor.isClose;
    var googlehomeTime = command.device.googlehome.timestamp;
    var smartphoneTime = command.device.smartphone.timestamp;
    if(weatherAPIClose=="1"| sensorClose=="1"){
        fs.writeFileSync('/sys/class/gpio/gpio24/value', 1);
        doClose;
        var dataString = `{"isClose": "1"}`;
        var firebase_options = {
            url: 'https://prj-ugo.firebaseio.com/status.json',
            method: 'PUT',
            body: dataString
        };
        request.put(firebase_options, function(error, response, body){});
    }
    else if(googlehomeClose=="1"&smartphoneClose=="1"){
        fs.writeFileSync('/sys/class/gpio/gpio24/value', 1);
        doClose;
        setTimeout(function() {
            fs.writeFileSync('/sys/class/gpio/gpio24/value', 0);
        }, 1000 * 30);
        var dataString = `{"isClose": "1"}`;
        var firebase_options = {
            url: 'https://prj-ugo.firebaseio.com/status.json',
            method: 'PUT',
            body: dataString
        };
        request.put(firebase_options, function(error, response, body){});
    }
    else if(googlehomeClose=="1"|smartphoneClose=="1"){
        if(googlehomeTime > smartphoneTime){
            if(googlehomeClose){
                fs.writeFileSync('/sys/class/gpio/gpio24/value', 1);
                doClose;
                var dataString = `{"isClose": "1"}`;
                var firebase_options = {
                    url: 'https://prj-ugo.firebaseio.com/status.json',
                    method: 'PUT',
                    body: dataString
                };
                request.put(firebase_options, function(error, response, body){});
            }
            else{ var dataString = `{"isClose": "0"}`;
                fs.writeFileSync('/sys/class/gpio/gpio24/value', 0);
                doOpen;
                var firebase_options = {
                    url: 'https://prj-ugo.firebaseio.com/status.json',
                    method: 'PUT',
                    body: dataString
                };
                request.put(firebase_options, function(error, response, body){});
            }
        }
        else{
            if(smartphoneClose){
                fs.writeFileSync('/sys/class/gpio/gpio24/value', 1);
                doClose;
                var dataString = `{"isClose": "1"}`;
                var firebase_options = {
                    url: 'https://prj-ugo.firebaseio.com/status.json',
                    method: 'PUT',
                    body: dataString
                };
                request.put(firebase_options, function(error, response, body){});
            }
            else{
                fs.writeFileSync('/sys/class/gpio/gpio24/value', 0);
                doOpen;
                var dataString = `{"isClose": "0"}`;
                var firebase_options = {
                    url: 'https://prj-ugo.firebaseio.com/status.json',
                    method: 'PUT',
                    body: dataString
                };
                request.put(firebase_options, function(error, response, body){});
            }
        }
    }
    else{
        fs.writeFileSync('/sys/class/gpio/gpio24/value', 0);
        doOpen;
        var dataString = `{"isClose": "0"}`;
        var firebase_options = {
            url: 'https://prj-ugo.firebaseio.com/status.json',
            method: 'PUT',
            body: dataString
        };
        request.put(firebase_options, function(error, response, body){});
    }
});

//30分に1回実行
var span = 1000 * 60 * 30;
setInterval(get_weather, span);

//タイムスタンプ用
function get_date(_timestamp){
    var _d = _timestamp?new Date(_timestamp * 1000):new Date();
    var Y = _d.getFullYear();
    var m = _d.getMonth() + 1;
    var d = _d.getDate();
    var H = _d.getHours();
    var i = _d.getMinutes();
    var s = _d.getSeconds();

    return `${d}:${H}:${i}:${s}`;
}


//OpenWeatherAPIからRaspberry Pi付近の天気を取得する
function get_weather(){
    var location_options = {
        url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDp7MvATiANb7H9D1le2-isXu5ihY2kDlo",
        headers: { "Content-type": "application/json"},
        method: 'POST',
        json: true
    };

    request.post(location_options, function(error, response, body){
        var lat = body.location.lat;
        var lng = body.location.lng;
        var wether_options = {
            url : `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=656c9f2e36bab5eb95a0bea3dd5ae4ab`
        }

        request.post(wether_options, function(error, response, body){
            obj = JSON.parse(body);
            var isClose;
            switch(obj.weather[0].description){
                case "clear sky":
                case "few clouds":
                case "scattered clouds":
                case "broken clouds":
                case "mist":
                case "Smoke":
                case "Haze":
                case "fog":
                    isClose = 0;
                    break;
                default :
                    isClose = 1;
            }
            var dataString = `{"main": "${obj.weather[0].main}", "description": "${obj.weather[0].description}", "icon": "${obj.weather[0].icon}", "id": "${obj.weather[0].id}", "isClose": "${isClose}"}`;
            var firebase_options = {
                url: 'https://prj-ugo.firebaseio.com/device/weatherAPI.json',
                method: 'PUT',
                body: dataString
            };
            request.put(firebase_options, function(error, response, body){
            });
        });
    });
}
