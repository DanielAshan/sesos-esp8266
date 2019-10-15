//wifi
var WIFI_NAME = "Redmib";
var WIFI_OPTIONS = {
  password: "12345678"
};
var wifi = require("Wifi");
wifi.connect(WIFI_NAME, WIFI_OPTIONS, function(err) {
  if (err) {
    console.log("Connection error: " + err);
    return;
  }
  console.log("Connected!");
});
//GET
var http = require("http");
http.get("http://185.243.52.8/api/getCurrentLecture/E3", function(res) {
  var contents = "";
  res.on('data', function(data) { contents += data; });
  res.on('close', function () { var list = JSON.parse(contents);
console.log(list[0].start_date);                              
});
});




//obsługa ekranu
var a = 1;
setInterval(function() {
  a++;
  if(a>3){
     a=1;
     }
  console.log("zmiana");
}, 5000);

function drawScreen() {
  setInterval(function() {
    if (a == 1) {
      g.clear();
      g.setFontVector(10);
      g.drawString("Aktualne zajęcia", 10, 10);
      g.drawString("Aktualne zajęcia", 10, 25);
      g.flip();
      console.log("2");
    } 
    if(a == 2){
      g.clear();
      var d = new Date();
      g.setFontVector(10);
      g.drawString(d.toUTCString().substring(0,15), 10, 10);
      g.drawString(d.toUTCString().substring(16,25), 10, 25);
      g.flip();
      console.log("1");
    }
    if(a == 3){
     g.clear();
      g.setFontVector(10);
      g.drawString("Następne zajęcia", 10, 10);
      g.drawString("Następne zajęcia", 10, 25);
      g.flip();
      console.log("3");
    }
    
  }, 1000);
}
drawScreen();
//SPI
var s = new SPI();
s.setup({ mosi: D16, sck: D2 });
var g = require("SH1106").connectSPI(
  s,
  D04 /* DC */,
  D0 /* RST - can leave as undefined */,
  drawScreen
);

//----- -------------------------------------


//SPi do kart

var spi1 = new SPI();
spi1.setup({
  mosi: NodeMCU.D6,
  miso: NodeMCU.D5,
  sck: NodeMCU.D7
});
var nfc = require("MFRC522").connect(spi1, NodeMCU.D8 /*CS*/ );
//zakomentowane bo nei wiedziałem gdzie wysłać
/*var classroom = 'E4';
var wifi = require("Wifi");
var http = require('http');*/
/*
function sendRequest(idlegitymacji) {
  payload = {
    classroom: classroom,
    els_Id: idlegitymacji,
  };
  payload = JSON.stringify(payload);
  registerOptions = {
    host: '169.254.196.250',
    port: 8081,
    path: '/rejestracja',
    method: 'POST',
    protocol: 'http',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length,
      'Accept': 'application/json'
    }
  };
  var req = http.request(registerOptions, function(res) {
    console.log('Status: ' + res.statusCode);
    console.log('Headers: ' + JSON.stringify(res.headers));
    res.on('data', function(data) {
      console.log("HTTP> " + data);
    });
    res.on('close', function(data) {
      console.log("Connection closed");
    });
    res.on('error', function(error) {
      console.log(error);
    });
  });
  req.write(payload);
  req.end();
}

*/
setInterval(function() { 
  nfc.findCards(function(card) {
   
    print("Found card " + card);
    card = JSON.stringify(card);
  print("Found card " + card);
  });
}, 500);





























